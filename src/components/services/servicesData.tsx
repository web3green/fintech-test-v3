
import { Building, Landmark, Wallet, Gamepad, CreditCard, BarChart3, Briefcase, Shield, Banknote } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ServiceItem } from './types';

export function useServicesData(): ServiceItem[] {
  const { t } = useLanguage();
  
  return [
    {
      id: 'company-formation',
      title: t('services.company-formation.title'),
      description: t('services.company-formation.short'),
      details: t('services.company-formation.details'),
      icon: Building,
      color: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-fintech-blue dark:text-fintech-blue-light',
      borderColor: 'border-fintech-blue/20',
    },
    {
      id: 'financial-licensing',
      title: t('services.financial-licensing.title'),
      description: t('services.financial-licensing.short'),
      details: t('services.financial-licensing.details'),
      icon: Landmark,
      color: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-fintech-orange dark:text-fintech-orange-light',
      borderColor: 'border-fintech-orange/20',
    },
    {
      id: 'crypto-regulation',
      title: t('services.crypto-regulation.title'),
      description: t('services.crypto-regulation.short'),
      details: t('services.crypto-regulation.details'),
      icon: Wallet,
      color: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'gambling-licensing',
      title: t('services.gambling-licensing.title'),
      description: t('services.gambling-licensing.short'),
      details: t('services.gambling-licensing.details'),
      icon: Gamepad,
      color: 'bg-emerald-50 dark:bg-emerald-950',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'payment-solutions',
      title: t('services.payment-solutions.title'),
      description: t('services.payment-solutions.short'),
      details: t('services.payment-solutions.details'),
      icon: CreditCard,
      color: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'text-fintech-blue dark:text-fintech-blue-light',
      borderColor: 'border-fintech-blue/20',
    },
    {
      id: 'fiat-crypto',
      title: t('services.fiat-crypto.title'),
      description: t('services.fiat-crypto.short'),
      details: t('services.fiat-crypto.details'),
      icon: Banknote,
      color: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'tax-planning',
      title: t('services.tax-planning.title'),
      description: t('services.tax-planning.short'),
      details: t('services.tax-planning.details'),
      icon: BarChart3,
      color: 'bg-orange-50 dark:bg-orange-950',
      iconColor: 'text-fintech-orange dark:text-fintech-orange-light',
      borderColor: 'border-fintech-orange/20',
    },
    {
      id: 'investment',
      title: t('services.investment.title'),
      description: t('services.investment.short'),
      details: t('services.investment.details'),
      icon: Briefcase,
      color: 'bg-purple-50 dark:bg-purple-950',
      iconColor: 'text-purple-500',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'nominee',
      title: t('services.nominee.title'),
      description: t('services.nominee.short'),
      details: t('services.nominee.details'),
      icon: Shield,
      color: 'bg-emerald-50 dark:bg-emerald-950',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-500/20',
    },
  ];
}
