import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

export function FooterLogo() {
  const { language, t } = useLanguage();

  // Используем статический путь к логотипу из папки public
  const logoSrc = '/images/logo.png';

  // Слоганы для разных языков - используем переводы из базы данных
  const slogan = t('slogan.en', 'Where Business Meets the Right Route');
  
  return (
    <div className="flex flex-col space-y-4 items-start">
      <Link to="/" className="flex items-center space-x-2 group">
          <img
          src={logoSrc} // Используем статический путь
          alt="FinTechAssist Logo Footer" // Обновленный alt текст
          className="mr-2 object-contain"
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
        />
        <span className="font-display font-bold text-xl text-foreground dark:text-foreground group-hover:text-fintech-blue transition-colors">
          FinTechAssist
        </span>
      </Link>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {slogan}
      </p>
    </div>
  );
}
