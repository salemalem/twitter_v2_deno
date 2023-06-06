// @ts-ignore
import { 
  createBot, GatewayIntents, startBot,
  addReaction, sendMessage,
  load
} from "../deps.ts"; 

await load({
  envPath: "../.env",
  export: true,
});

const discordToken = Deno.env.get("DISCORD_BOT_TOKEN")

const discordIntents = [GatewayIntents.Guilds, GatewayIntents.GuildMessages, GatewayIntents.MessageContent, GatewayIntents.GuildMembers];
const discordBot = createBot({
  token: discordToken,
  intents: GatewayIntents.Guilds | GatewayIntents.GuildMessages,
  events: {
    ready() {
      console.log("Successfully connected to Discord gateway");
    },
  },
});

discordBot.events.messageCreate = function (b, message) {
  addReaction(discordBot,
    message.channelId,
    message.id,
    "👍"
  );
};


await startBot(discordBot);

// await sendMessage(discordBot, "1113203625280417822", {
//   content: "Hello World!",
// });

export default discordBot;