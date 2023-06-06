import {
  load,
  logger
} from "../deps.ts"; 

await load({
  envPath: "../.env",
  export: true,
});
const bearerToken = Deno.env.get("TWITTER_BEARER_TOKEN");

export default async function convertTwitterIDtoUsername(
  twitterID: string,
): Promise<string> {
  const twitterUserInfo = await fetch(`https://api.twitter.com/2/users/${twitterID}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`,
    }
  })
  const twitterUserInfoJson = await twitterUserInfo.json();
  console.log(twitterUserInfoJson);
  if (twitterUserInfoJson.data === undefined) {
    logger.error(twitterUserInfoJson);
    throw new Error("Error fetching twitter user info");
  }
  if (twitterUserInfoJson.errors) {
    logger.error(twitterUserInfoJson.errors);
    throw new Error("Error fetching twitter user info");
  }
  return twitterUserInfoJson.data.username;
}