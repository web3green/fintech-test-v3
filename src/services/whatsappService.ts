export class WhatsAppService {
  private static instance: WhatsAppService;
  private phoneNumber: string = "";
  private apiKey: string = "";

  private constructor() {
    const storedConfig = localStorage.getItem("whatsappConfig");
    if (storedConfig) {
      const config = JSON.parse(storedConfig);
      this.phoneNumber = config.phoneNumber;
      this.apiKey = config.apiKey;
    }
  }

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  public setConfig(phoneNumber: string, apiKey: string): void {
    this.phoneNumber = phoneNumber;
    this.apiKey = apiKey;
    localStorage.setItem("whatsappConfig", JSON.stringify({ phoneNumber, apiKey }));
  }

  public async sendMessage(message: string): Promise<boolean> {
    if (!this.phoneNumber || !this.apiKey) {
      throw new Error("WhatsApp configuration is not set");
    }

    try {
      // Здесь нужно использовать API выбранного провайдера (например, Twilio)
      // Это пример для Twilio API
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.apiKey}/Messages.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${btoa(`${this.apiKey}:${this.apiKey}`)}`,
        },
        body: new URLSearchParams({
          To: `whatsapp:${this.phoneNumber}`,
          From: "whatsapp:+14155238886", // Twilio WhatsApp sandbox number
          Body: message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      return true;
    } catch (error) {
      console.error("WhatsApp send message error:", error);
      throw error;
    }
  }

  public async testConnection(): Promise<boolean> {
    if (!this.phoneNumber || !this.apiKey) {
      throw new Error("WhatsApp configuration is not set");
    }

    try {
      // Тестируем подключение к API провайдера
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.apiKey}.json`, {
        headers: {
          "Authorization": `Basic ${btoa(`${this.apiKey}:${this.apiKey}`)}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Invalid API credentials");
      }

      return true;
    } catch (error) {
      console.error("WhatsApp test connection error:", error);
      throw error;
    }
  }
} 