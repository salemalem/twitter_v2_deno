// @ts-ignore
import {
  logger,
} from "/deps.ts"; 
import postgresClient from "/db/postgreClient.ts";


/*
  * @param userID: string
  * @returns Array<string>
  * @returns Array of twitter IDs that follow the user
  * @description: cross check if user is followed by other twitter accounts
  * @example: await crossCheckFollow("2597413135");
*/
export default async function crossCheckFollow(userID: string): Promise<Array<string>> {
  const crossFollowQuery = `SELECT "twitterID" FROM "TwitterFollows" WHERE "followID" = ${userID}`;
  const postgresQuery = await postgresClient.queryArray(crossFollowQuery);

  logger.info(`Cross check for ${userID} with ${postgresQuery.rows.length} users`);
  logger.info(postgresQuery.rows);

  let crossCheckFollows: Array<string> = [];
  for (const crossFollow of postgresQuery.rows) {
    crossCheckFollows.push(crossFollow[0]);
  }
  return crossCheckFollows;
}
