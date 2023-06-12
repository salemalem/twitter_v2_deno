// @ts-ignore
import discordBot from "/discord/discordBot.ts";
import { 
  sendMessage,
  logger
} from "../deps.ts"; 
import checkNewFollow from "/components/checkNewFollow.ts";
import crossCheckFollow from "/components/crossCheckFollow.ts";
import postgresClient from "/db/postgreClient.ts";
import convertTwitterIDtoUsername from "/components/convertTwitterIDtoUsername.ts";


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

  for (const twitterID of twitterIDs){
    const followMessages:{
      message: string,
      username: string,
    }[] = await checkNewFollow(twitterID);
    logger.info(followMessages);
    for (const followMessage of followMessages) {
      logger.info(followMessage);

      const { 
        message, 
        username,
        id,
      } = followMessage;
      let crossCheckMessage = "";
      const crossFollows = await crossCheckFollow(id);
      logger.info(crossFollows);
      logger.info(crossFollows.length);
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
        // description: "Follow alert",
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
      await sendMessage(discordBot, "1113203625280417822", {
        // content: message,
        embeds: [
          embed
        ]
      });
      // TODO: add send message for 1114084032246992977 and test it
    }
  }
  logger.info("FINISH: alert_new_follow process");
};