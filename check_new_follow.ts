// @ts-ignore
import envVars from "./envvars.ts";
// components
import { 
  fetchFollows,
  TwitterFollowStructure,
} from "./components/fetchFollows.ts";
import telegramSendMessage from "./components/telegramSendMessage.ts";
import convertTwitterIDtoScreenName from "./components/convertTwitterIDtoScreenName.ts";
import postgresClient from "./db/postgreClient.ts";

const userID = "1330894331721494529"; // twitter
const followsJson = await fetchFollows(userID);
const twitterLink = "https://www.twitter.com/";

const SPECIAL_CHARS = [
  '\\',
  '_',
  '*',
  '[',
  ']',
  '(',
  ')',
  '~',
  '`',
  '>',
  '<',
  '&',
  '#',
  '+',
  '-',
  '=',
  '|',
  '{',
  '}',
  '.',
  '!'
]

const escapeMarkdown = (text) => {
  SPECIAL_CHARS.forEach(char => (text = text.replaceAll(char, `\\${char}`)))
  return text
}
let count = 0;
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
    count++;
    const twitterScreenName = await convertTwitterIDtoScreenName(userID);
    const twitterFollowLink = `[${twitterScreenName}](${twitterLink}${twitterScreenName})`;
    let message = `${twitterFollowLink} follows ${name}  [${username}](${twitterLink}${username})`;
    message = escapeMarkdown(message);
    console.log(message);
    // message = message
    //   .replace(/\_/g, '\\_')
    //   .replace(/\*/g, '\\*')
    //   .replace(/\[/g, '\\[')
    //   .replace(/\]/g, '\\]')
    //   .replace(/\(/g, '\\(')
    //   .replace(/\)/g, '\\)')
    //   .replace(/\~/g, '\\~')
    //   .replace(/\`/g, '\\`')
    //   .replace(/\>/g, '\\>')
    //   .replace(/\#/g, '\\#')
    //   .replace(/\+/g, '\\+')
    //   .replace(/\-/g, '\\-')
    //   .replace(/\=/g, '\\=')
    //   .replace(/\|/g, '\\|')
    //   .replace(/\{/g, '\\{')
    //   .replace(/\}/g, '\\}')
    //   .replace(/\./g, '\\.')
    //   .replace(/\!/g, '\\!')
    // console.log(message);

    const chat_id = 6072771460;
    const telegramMessage = await telegramSendMessage(message, chat_id);
    console.log(telegramMessage);

    const insertQuery = `INSERT INTO "TwitterFollows" ("twitterID", "followID") VALUES ('${userID}', '${id}')`;
    const postgresQuery = await postgresClient.queryArray(insertQuery);
  }
});
if (count == 0) {
  console.log("No new follows");
}
