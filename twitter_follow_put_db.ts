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

const twitterFollowPutID = async (userID: string) => {
  const followsJson = await fetchFollows(userID);
  const followsCount = followsJson.length;
  logger.info(`Fetched ${followsCount} follows for ${userID}`);
  let counter = 0;
  for (const follow of followsJson) {
    counter++;
    const { id } = follow;
    logger.info(`Inserted ${id} into database with counter of ${counter}`);
    const insertQuery = `INSERT INTO "TwitterFollows" ("twitterID", "followID") VALUES ('${userID}', '${id}')`;
    const postgresQuery = await postgresClient.queryArray(insertQuery);
  }

  await sleep(10);
  if (counter === followsCount) {
    logger.info("Finished inserting all follows into database");
  }
};

const batchPutDB = async () => {
  logger.info("START: twitter_follow_put_db Batch process");
  const selectQuery = `SELECT "twitter_id" FROM "track_ids"`;
  const postgresQuery = await postgresClient.queryArray(selectQuery);
  const twitterIDsRows = postgresQuery.rows;

  let twitterIDs: string[] = [];
  for (const twitterID of twitterIDsRows) {
    const twitterIDparsed = twitterID[0].toString().replace(/[^0-9]/g, '');
    twitterIDs.push(twitterIDparsed.toString());
  }

  let counter = 0;
  for (const twitterID of twitterIDs) {
    await twitterFollowPutID(twitterID);
    logger.info(`Finished inserting all follows for ${twitterID} into database with counter of ${counter}`);
    counter++;
  }
}

await batchPutDB();

