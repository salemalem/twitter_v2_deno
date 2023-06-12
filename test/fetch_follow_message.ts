import checkNewFollow from "/components/checkNewFollow.ts";
import crossCheckFollow from "/components/crossCheckFollow.ts";
import convertTwitterIDtoUsername from "/components/convertTwitterIDtoUsername.ts";
import {
  logger,
  sendMessage,
} from "/deps.ts";
import discordBot from "/discord/discordBot.ts";

const twitterID = "3344834374"
const twitterLink = "https://www.twitter.com/";

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

  // SecureZero
  await sendMessage(discordBot, "1113203625280417822", {
    // content: message,
    embeds: [
      embed
    ]
  });

  // Block Hacks
  await sendMessage(discordBot, "1114084032246992977", {
    embeds: [
      embed
    ]
  });
}