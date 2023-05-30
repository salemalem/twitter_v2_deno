// @ts-ignore
import envVars from "./envvars.ts";
// components
import { 
  fetchFollows,
  TwitterFollowStructure,
} from "./components/fetchFollows.ts";
import convertTwitterIDtoUsername from "./components/convertTwitterIDtoUsername.ts";
import postgresClient from "./db/postgreClient.ts";

const userID = "1330894331721494529"; // twitter
const followsJson = await fetchFollows(userID);
const twitterLink = "https://www.twitter.com/";


let count = 0;
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
    const twitterScreenName = await convertTwitterIDtoUsername(userID);
    const twitterFollowLink = `[${twitterScreenName}](${twitterLink}${twitterScreenName})`;
    let message = `${twitterFollowLink} follows ${name}  [${username}](${twitterLink}${username})`;
    console.log(message);
    

    const insertQuery = `INSERT INTO "TwitterFollows" ("twitterID", "followID") VALUES ('${userID}', '${id}')`;
    const postgresQuery = await postgresClient.queryArray(insertQuery);
  }
});
if (count == 0) {
  console.log("No new follows");
}
