export class TelegramService {
  private static instance: TelegramService;
  private botToken: string = "";
  private chatId: string = "";

  private constructor() {
    const storedConfig = localStorage.getItem("telegramConfig");
    if (storedConfig) {
      const config = JSON.parse(storedConfig);
      this.botToken = config.botToken;
      this.chatId = config.chatId;
    }
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  public setConfig(botToken: string, chatId: string): void {
    this.botToken = botToken;
    this.chatId = chatId;
    localStorage.setItem("telegramConfig", JSON.stringify({ botToken, chatId }));
  }

  public async sendMessage(message: string): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      throw new Error("Telegram configuration is not set");
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: "HTML",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.description || "Failed to send message");
      }

      return true;
    } catch (error) {
      console.error("Telegram send message error:", error);
      throw error;
    }
  }

  public async testConnection(): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      throw new Error("Telegram configuration is not set");
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/getMe`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.description || "Invalid bot token");
      }

      const botInfo = await response.json();
      if (!botInfo.ok || !botInfo.result) {
        throw new Error("Invalid bot token");
      }

      return true;
    } catch (error) {
      console.error("Telegram test connection error:", error);
      throw error;
    }
  }
} 