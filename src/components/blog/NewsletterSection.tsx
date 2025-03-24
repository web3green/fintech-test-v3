
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlowingEffect } from '@/components/ui/glowing-effect';

interface NewsletterSectionProps {
  language: string;
}

export const NewsletterSection = ({ language }: NewsletterSectionProps) => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto bg-fintech-blue text-white dark:bg-fintech-blue-dark rounded-2xl p-8 md:p-12 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-fintech-blue-dark/20"></div>
            <GlowingEffect 
              blur={10} 
              spread={40} 
              glow={true} 
              disabled={false} 
              inactiveZone={0.2}
              proximity={100}
            />
          </div>
          <div className="relative z-10 text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              {language === 'en' ? 'Stay Updated' : 'Будьте в курсе'}
            </h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              {language === 'en' 
                ? 'Subscribe to our newsletter to receive the latest insights and updates on international business and finance.' 
                : 'Подпишитесь на нашу рассылку, чтобы получать последние аналитические данные и обновления о международном бизнесе и финансах.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Input 
                type="email" 
                placeholder={language === 'en' ? "Your email address" : "Ваш email адрес"} 
                className="w-full sm:w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button className="bg-white text-fintech-blue hover:bg-gray-100 w-full sm:w-auto">
                {language === 'en' ? 'Subscribe' : 'Подписаться'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
