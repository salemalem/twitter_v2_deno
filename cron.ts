// @ts-ignore
import {cron, daily, monthly, weekly} from "deps.ts";
import alert_new_follow from "./watchers/alert_new_follow.ts";
import { logger } from "./deps";

const every6hour = "1 */6 * * *";

cron(every6hour, async () => {
  await alert_new_follow();
  logger.info("cron job every 6 hours");
});
