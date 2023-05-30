import envVars from "../envvars.ts";

const bearerToken = envVars.TWITTER_BEARER_TOKEN;

export default async function convertTwitterIDtoScreenName(
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