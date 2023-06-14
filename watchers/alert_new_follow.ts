// @ts-ignore
import discordBot from "/discord/discordBot.ts";
import { 
  sendMessage,
  logger
} from "../deps.ts"; 
import checkNewFollow from "/components/checkNewFollow.ts";
import crossCheckFollow from "/components/crossCheckFollow.ts";
import postgresClient from "/db/postgreClient.ts";
import getUserInfo from "../components/getUserInfo.ts";


export default async function alert_new_follow() {
  logger.info("START: alert_new_follow process");
  const selectQuery = `SELECT "twitter_id" FROM "track_ids"`;
  const postgresQuery = await postgresClient.queryArray(selectQuery);
  const twitterIDsRows = postgresQuery.rows;

  let twitterIDs: string[] = [];
  for (const twitterID of twitterIDsRows) {
    const twitterIDparsed = twitterID[0].toString().replace(/[^0-9]/g, '');
    twitterIDs.push(twitterIDparsed.toString());
  }

  const twitterLink = "https://www.twitter.com/";

  for (const twitterID of twitterIDs) {
    const followMessages:{
      message: string,
      username: string,
      id: string,
    }[] = await checkNewFollow(twitterID);
    logger.info(followMessages);
    for (const followMessage of followMessages) {
      logger.info(followMessage);

      const { 
        message, 
        username,
        id,
      } = followMessage;
      const userInfo = await getUserInfo(id);
      const userDescription = userInfo.description;
      const userMetrics = userInfo.public_metrics;
      const userFollowers = userMetrics.followers_count;
      const tweetCount = userMetrics.tweet_count;
      let crossCheckMessage = "";
      let crossFollows = await crossCheckFollow(id);
      logger.info(crossFollows);
      logger.info(crossFollows.length);
      crossFollows = [...new Set(crossFollows)];
      if (crossFollows.length > 1) {
        crossCheckMessage = "Already followed by";
        for (const crossFollow of crossFollows) {
          if (crossFollow === twitterID) {
            continue;
          }
          crossCheckMessage += " " + await convertTwitterIDtoUsername(crossFollow);
        }
      }
      const embed = {
        title: message,
        description: `***${userDescription}***\n **Followers:** ${userFollowers}\n **Tweets:** ${tweetCount}`,
        color: 0x00ff00,
        fields: [
          {
            name: crossCheckMessage,
            value: twitterLink + username,
          },
        ],
      };
      logger.info(`Message: ${message}`);
      logger.info(`Cross check: ${crossCheckMessage}`);

      // Secure Zero
      await sendMessage(discordBot, "1113203625280417822", {
        // content: message,
        embeds: [
          embed
        ]
      });

      // Block Hacks
      await sendMessage(discordBot, "1114084032246992977", {
        // content: message,
        embeds: [
          embed
        ]
      });
    }
  }
  logger.info("FINISH: alert_new_follow process");
};