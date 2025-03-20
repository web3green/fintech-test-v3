
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Send, X, Bot, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type Message = {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
};

export function AiChatbot() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Replace with your actual Make webhook URL for the AI chatbot
  const MAKE_AI_WEBHOOK_URL = "https://hook.eu1.make.com/youraichatwebhook";

  // Initial bot greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = language === 'en' 
        ? "Hello! I'm the FintechAssist AI assistant. How can I help you today?"
        : "Здравствуйте! Я ИИ-ассистент FintechAssist. Чем я могу вам помочь сегодня?";
        
      setMessages([
        {
          id: '1',
          type: 'bot',
          text: greeting,
          timestamp: new Date(),
        },
      ]);
    }
  }, [language, messages.length]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Make webhook to process message and get AI response
      const response = await fetch(MAKE_AI_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userMessage: input,
          language: language,
          timestamp: new Date().toISOString(),
          conversation: messages.map(m => ({ type: m.type, text: m.text }))
        }),
        mode: 'no-cors' // Use no-cors mode since webhook may not support CORS
      });
      
      // Since we're using no-cors, we can't actually process the response
      // In a real implementation, you would either:
      // 1. Use a CORS-enabled endpoint
      // 2. Use a backend proxy
      // 3. Use a serverless function
      
      // For demo purposes, simulate a response
      const demoResponse = language === 'en'
        ? "Thank you for your message. Our team will review your inquiry and get back to you shortly. For faster assistance, please contact us at +44 7450 574905."
        : "Спасибо за ваше сообщение. Наша команда рассмотрит ваш запрос и свяжется с вами в ближайшее время. Для более быстрой помощи, пожалуйста, свяжитесь с нами по телефону +44 7450 574905.";
      
      // Add bot response after a small delay to simulate processing
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          text: demoResponse,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage = language === 'en'
        ? "I'm sorry, I encountered an error while processing your request. Please try again later."
        : "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.";
        
      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        text: errorMessage,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full shadow-lg bg-fintech-blue hover:bg-fintech-blue-dark text-white p-4 z-50"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 shadow-2xl rounded-xl overflow-hidden z-50 bg-background border border-border animate-in slide-in-from-bottom-10 duration-300">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 bg-fintech-blue text-white">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-medium">FintechAssist AI</h3>
            </div>
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.type === 'user'
                      ? 'bg-fintech-blue text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-foreground'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 dark:bg-gray-800">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="border-t border-border p-4 flex space-x-2">
            <Input
              placeholder={language === 'en' ? "Type your message..." : "Введите ваше сообщение..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
