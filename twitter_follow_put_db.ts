// @ts-ignore
import postgresClient from "/db/postgreClient.ts";
import { 
  fetchFollows,
  TwitterFollowStructure
} from "/components/fetchFollows.ts";
import {
  logger,
  sleep,
} from "/deps.ts"

const userID = "14946614";

const followsJson = await fetchFollows(userID);
const followsCount = followsJson.length;
logger.info(`Fetched ${followsCount} follows`);
let counter = 0;
(followsJson as Array<TwitterFollowStructure>).forEach(async (follow) => {
  counter++;
  const { id } = follow;
  logger.info(`Inserted ${id} into database with counter of ${counter}`);
  const insertQuery = `INSERT INTO "TwitterFollows" ("twitterID", "followID") VALUES ('${userID}', '${id}')`;
  const postgresQuery = await postgresClient.queryArray(insertQuery);
});

await sleep(10);
if (counter === followsCount) {
  logger.info("Finished inserting all follows into database");
}