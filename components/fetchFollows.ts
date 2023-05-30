// @ts-ignore
import envVars from "../envvars.ts";

const bearerToken = envVars.TWITTER_BEARER_TOKEN;

export type TwitterFollowStructure = {
  name:     string;
  id:       string;
  username: string;
}

export const fetchFollows = async (userID: string): Promise<Array<TwitterFollowStructure>> => {
  const followsResponse = await fetch(`https://api.twitter.com/2/users/${userID}/following`, {
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
      }
    });
  
  const followsJson = await followsResponse?.json();
  const followsJsonData = followsJson.data;
  return followsJsonData;
}