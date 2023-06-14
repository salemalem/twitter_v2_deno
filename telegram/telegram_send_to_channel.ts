const telegramBot = "bot5767618930:AAGqhNWPTG2sdizpJxBYhd3KoZvEEJ1igDY";
const telegramSendMessage = "https://api.telegram.org/" + telegramBot +"/sendMessage?chat_id=@block_hacks&parse_mode=Markdown&text=";

export async function telegramSendToChannel(message: string): Promise<void> {
  try {
    await fetch(telegramSendMessage + message);
  } catch (error) {
    console.error(error);
    return await telegramSendToChannel(message);
  }
}
