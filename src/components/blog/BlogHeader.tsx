
import React from 'react';

interface BlogHeaderProps {
  language: string;
}

export const BlogHeader = ({ language }: BlogHeaderProps) => {
  return (
    <section className="py-20 md:py-28 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            {language === 'en' ? 'Our Blog' : 'Наш Блог'}
          </h1>
          <p className="text-xl text-muted-foreground">
            {language === 'en' 
              ? 'Insights, guides, and updates on international business and finance' 
              : 'Аналитика, руководства и обновления о международном бизнесе и финансах'}
          </p>
        </div>
      </div>
    </section>
  );
};
