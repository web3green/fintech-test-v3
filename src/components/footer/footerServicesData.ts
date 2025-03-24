
import { 
  Building, 
  Landmark, 
  Wallet, 
  Gamepad, 
  CreditCard, 
  BarChart3 
} from 'lucide-react';

export const getMainServices = (t) => [
  {
    id: 'company-formation',
    title: t('services.company-formation.title'),
    icon: Building
  },
  {
    id: 'financial-licensing',
    title: t('services.financial-licensing.title'),
    icon: Landmark
  },
  {
    id: 'crypto-regulation',
    title: t('services.crypto-regulation.title'),
    icon: Wallet
  },
  {
    id: 'gambling-licensing',
    title: t('services.gambling-licensing.title'),
    icon: Gamepad
  },
  {
    id: 'payment-solutions',
    title: t('services.payment-solutions.title'),
    icon: CreditCard
  },
  {
    id: 'tax-planning',
    title: t('services.tax-planning.title'),
    icon: BarChart3
  },
];
