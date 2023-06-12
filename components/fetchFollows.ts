// @ts-ignore
import {
  logger,
} from "/deps.ts"; 


const bearerToken = Deno.env.get("TWITTER_BEARER_TOKEN");

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
  if (followsJson.errors) {
    logger.error(followsJson.errors);
    throw new Error("Error fetching follows");
  }
  const followsJsonData = followsJson.data;
  return followsJsonData;
  
}
