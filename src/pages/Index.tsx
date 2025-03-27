
import { LanguageProvider } from '@/contexts/LanguageContext';
import { LanguageInitializer } from '@/components/language/LanguageInitializer';
import { IndexContentWithUpdaters } from '@/components/content/IndexContentWithUpdaters';

const Index = () => {
  return (
    <LanguageInitializer>
      <LanguageProvider>
        <IndexContentWithUpdaters />
      </LanguageProvider>
    </LanguageInitializer>
  );
};

export default Index;
