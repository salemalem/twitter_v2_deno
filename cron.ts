// @ts-ignore
import {
  cron, daily, monthly, weekly,
  logger,
} from "/deps.ts";
import alert_new_follow from "/watchers/alert_new_follow.ts";

const every6hour  = "1 */6 * * *";

cron(every6hour, async () => {
  logger.info("cron job every 6 hours");
  await alert_new_follow();
});

const everyMinute = "* * * * *";

cron(everyMinute, async () => {
  logger.info("cron job every minute");
  await alert_new_follow();
});