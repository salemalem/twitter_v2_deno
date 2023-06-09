// @ts-ignore
import discordBot from "../discord/discordBot.ts";
import { 
  sendMessage,
  load,
  logger
} from "../deps.ts"; 
import checkNewFollow from "../components/checkNewFollow.ts";
import crossCheckFollow from "../components/crossCheckFollow.ts";
import postgresClient from "../db/postgreClient.ts";
import convertTwitterIDtoUsername from "../components/convertTwitterIDtoUsername.ts";

await load({
  envPath: "../.env",
  export: true,
});

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
    if (crossFollows.length > 0) {
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
      description: "Investment opportunity",
      color: 0x00ff00,
      fields: [
        {
          name: crossCheckMessage,
          value: twitterLink + username,
        },
      ],
    };
    await sendMessage(discordBot, "1113203625280417822", {
      // content: message,
      embeds: [
        embed
      ]
    });
  }
}
