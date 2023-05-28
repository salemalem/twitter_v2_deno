// @ts-ignore
import envVars from "./envvars.ts";
import { 
  fetchFollows,
  TwitterFollowStructure,
} from "./components/fetchFollows.ts";
import postgresClient from "./db/postgreClient.ts";

const userID = "1482802950104031232";
const followsJson = await fetchFollows(userID);
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
    console.log(`New follow: ${id} ${name} ${username}`);
  }
});
