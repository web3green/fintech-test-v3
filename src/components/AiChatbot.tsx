
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X, ChevronDown, Bot, Sparkles, Brain } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { generateAIResponse } from '@/utils/contactApi';

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
  const [isAnimating, setIsAnimating] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Create audio elements
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.5;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play sound effect
  const playSound = (type: 'open' | 'message' | 'send') => {
    if (!audioRef.current) return;
    
    switch (type) {
      case 'open':
        audioRef.current.src = '/sounds/bot-open.mp3';
        break;
      case 'message':
        audioRef.current.src = '/sounds/bot-message.mp3';
        break;
      case 'send':
        audioRef.current.src = '/sounds/bot-send.mp3';
        break;
    }
    
    audioRef.current.play().catch(err => console.error("Error playing sound:", err));
  };

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

  const toggleChat = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) {
      playSound('open');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Play send sound
    playSound('send');

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
      // First, use the local AI response generator
      const aiResponse = generateAIResponse(input);
      
      // Then, if webhook is configured, send data to Make
      const storedWebhookUrl = localStorage.getItem('webhookUrl');
      if (storedWebhookUrl) {
        await fetch(storedWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors", // Handle CORS issues
          body: JSON.stringify({
            userMessage: input,
            aiResponse: aiResponse,
            language: language,
            timestamp: new Date().toISOString(),
            conversation: messages.map(m => ({ type: m.type, text: m.text }))
          }),
        });
      }
      
      // Add bot response after a small delay to simulate processing
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          text: aiResponse,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
        playSound('message');
      }, 1000);
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
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 rounded-full shadow-lg bg-fintech-blue hover:bg-fintech-blue-dark text-white p-4 z-50 transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}
        size="icon"
        onMouseEnter={() => setIsAnimating(true)}
        onMouseLeave={() => setIsAnimating(false)}
        onAnimationEnd={() => setIsAnimating(false)}
      >
        <div className="relative flex items-center justify-center">
          <Brain 
            className={`h-6 w-6 absolute transition-opacity duration-300 ${isAnimating ? 'opacity-100 animate-pulse' : 'opacity-0'}`} 
          />
          <Bot 
            className={`h-6 w-6 transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`} 
          />
          <Sparkles 
            className={`h-3 w-3 absolute -top-1 -right-1 text-white transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'} animate-pulse`} 
          />
        </div>
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 shadow-2xl rounded-xl overflow-hidden z-50 bg-background border border-border animate-in slide-in-from-bottom-10 duration-300">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 bg-fintech-blue text-white">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 animate-pulse" />
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
