import {
  load,
} from "/deps.ts"; 

const SPECIAL_CHARS = [
  '\\',
  '_',
  '*',
  '[',
  ']',
  '(',
  ')',
  '~',
  '`',
  '>',
  '<',
  '&',
  '#',
  '+',
  '-',
  '=',
  '|',
  '{',
  '}',
  '.',
  '!'
]

const escapeMarkdown = (text) => {
  SPECIAL_CHARS.forEach(char => (text = text.replaceAll(char, `\\${char}`)))
  return text
}

export default async function telegramSendMessage(
  text: string,
  chatId: number,
) : Promise<any> {
  const response = await fetch(
    `https://api.telegram.org/bot${Deno.env.get("TELEGRAM_BOT_TOKEN")}/sendMessage?chat_id=${chatId}&parse_mode=MarkdownV2&text=${text}`,
  );
  console.log(response.url);

  if (!response.ok) {
    throw new Error(
      `Failed to send message to Telegram. Response: ${response.status} ${response.statusText}`,
    );
  }
  return response.json();
}