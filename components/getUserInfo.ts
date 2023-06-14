import {
  logger,
} from "/deps.ts"; 

const bearerToken = Deno.env.get("TWITTER_BEARER_TOKEN");

export default async function getUserInfo(
  twitterID: string,
): Promise<string> {
  const twitterUserInfo = await fetch(`https://api.twitter.com/2/users/${twitterID}?user.fields=public_metrics,description`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${bearerToken}`,
    }
  })
  const twitterUserInfoJson = await twitterUserInfo.json();
  if (twitterUserInfoJson.data === undefined) {
    logger.error(twitterUserInfoJson);
    throw new Error("Error fetching twitter user info");
  }
  if (twitterUserInfoJson.errors) {
    logger.error(twitterUserInfoJson.errors);
    throw new Error("Error fetching twitter user info");
  }
  return twitterUserInfoJson.data;
}