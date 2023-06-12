import checkNewFollow from "/components/checkNewFollow.ts";
import {
  logger,
} from "/deps.ts";

const twitterID = "3344834374"

const followMessages:{
  message: string,
  username: string,
}[] = await checkNewFollow(twitterID);

logger.info(followMessages);