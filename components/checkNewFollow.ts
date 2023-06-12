// @ts-ignore
import {
  sleep,
  logger,
} from "/deps.ts"; 


// components
import { 
  fetchFollows,
  TwitterFollowStructure,
} from "./fetchFollows.ts";
import convertTwitterIDtoUsername from "./convertTwitterIDtoUsername.ts";
import postgresClient from "/db/postgreClient.ts";



export default async function checkNewFollow (userID: string) {
  logger.info(`START: checkNewFollow for ${userID}`);
  const followsJson = await fetchFollows(userID);
  let count = 0;
  const newFollowMessages:{
    message: string,
    username: string,
  }[] = [];
  const twitterUsername = await convertTwitterIDtoUsername(userID);

  (followsJson as Array<TwitterFollowStructure>).forEach(async (follow) => {
    const { 
      id,
      name,
      username,
    } = follow;
    
    const checkIfFollowsAlreadyQuery = `SELECT EXISTS(SELECT 1 FROM "TwitterFollows" WHERE "twitterID" = ${userID} AND "followID" = ${id})`;
    const postgresQuery = await postgresClient.queryArray(checkIfFollowsAlreadyQuery);
    const result = postgresQuery.rows[0][0];
    if (result != true) { // didn't follow before
      count++;
      // const twitterUsername = "";
      const message = `${twitterUsername} follows ${name}`;
      const newFollowMessage = {
        message: "",
        username,
        id,
      };
      newFollowMessage["message"] = message;
      logger.info(`${userID}: ${message}`);
      const insertQuery = `INSERT INTO "TwitterFollows" ("twitterID", "followID") VALUES ('${userID}', '${id}')`;
      const _postgresQuery = await postgresClient.queryArray(insertQuery);
      newFollowMessages.push(newFollowMessage);
    }
  });

  // sleep because function is async and code below will be executed before for each loop is finished
  await sleep(1);
  if (count == 0) {
    logger.info(`FINISH: No new follows for ${userID}`);
  }
  return newFollowMessages;
}