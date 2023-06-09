// @ts-ignore
import postgresClient from "/db/postgreClient.ts";
import { 
  fetchFollows,
  TwitterFollowStructure
} from "/components/fetchFollows.ts";

const userID = "1330894331721494529";

const followsJson = await fetchFollows(userID);
(followsJson as Array<TwitterFollowStructure>).forEach(async (follow) => {
  const { id } = follow;
  console.log(id);
  const insertQuery = `INSERT INTO "TwitterFollows" ("twitterID", "followID") VALUES ('${userID}', '${id}')`;
  const postgresQuery = await postgresClient.queryArray(insertQuery);
  // console.log(postgresQuery);
});
