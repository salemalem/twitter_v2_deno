// @ts-ignore
import {
  logger,
} from "/deps.ts"; 
import postgresClient from "/db/postgreClient.ts";

const follows: {
  [twitterID: string]: string[] 
} = {};

export const removeDuplicateFollowIDs = async () => {
  const selectQuery = `SELECT * FROM "TwitterFollows"`;
  const allFollowIDsQuery = await postgresClient.queryArray(selectQuery);
  const allFollowIDs = allFollowIDsQuery.rows;
  for (const follow of allFollowIDs) {
    logger.info(`Checking follow: ${follow}`);
    const rowID: string = follow[0].toString();
    const twitterID: string = follow[1];
    const followID: string = follow[2];
    follows[twitterID] = follows[twitterID] || [];
    // TODO: finish logic
    follows[twitterID].push(rowID);
    follows[twitterID].push(followID);
    logger.info(`Follows: ${JSON.stringify(follows)}`);
    return;
  }
};

await removeDuplicateFollowIDs();