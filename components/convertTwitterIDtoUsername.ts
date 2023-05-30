import envVars from "../envvars.js";

const bearerToken = envVars.TWITTER_BEARER_TOKEN;

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
  return twitterUserInfoJson.data.username;
}