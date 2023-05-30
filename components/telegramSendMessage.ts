import envVars from "../envvars.ts";

export default async function telegramSendMessage(
  text: string,
  chatId: number,
) : Promise<any> {
  const response = await fetch(
    `https://api.telegram.org/bot${envVars.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${chatId}&parse_mode=MarkdownV2&text=${text}`,
  );
  console.log(response.url);

  if (!response.ok) {
    throw new Error(
      `Failed to send message to Telegram. Response: ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
}