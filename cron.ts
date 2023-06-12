// @ts-ignore
import {
  cron, daily, monthly, weekly,
  logger,
} from "/deps.ts";
import alert_new_follow from "/watchers/alert_new_follow.ts";

const every6hour  = "1 */6 * * *";

await alert_new_follow();
cron(every6hour, async () => {
  logger.info("cron job every 6 hours");
  await alert_new_follow();
});

// const everyMinute = "*/5 * * * *";

// cron(everyMinute, async () => {
//   logger.info("cron job every 5 minutes");
//   await alert_new_follow();
// });
