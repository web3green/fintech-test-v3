
import { useLanguage } from '@/contexts/LanguageContext';

export function IndustriesSection() {
  const { t } = useLanguage();

  const industries = [
    { id: 'fintech', name: t('industries.fintech') },
    { id: 'ecommerce', name: t('industries.ecommerce') },
    { id: 'blockchain', name: t('industries.blockchain') },
    { id: 'startups', name: t('industries.startups') },
    { id: 'neobanks', name: t('industries.neobanks') },
    { id: 'wallets', name: t('industries.wallets') },
    { id: 'gaming', name: t('industries.gaming') },
    { id: 'saas', name: t('industries.saas') },
    { id: 'edtech', name: t('industries.edtech') },
  ];

  return (
    <section className="bg-fintech-blue-dark py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-500 rounded-full w-32 h-32 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">FA</span>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">FinTechAssist</h2>
            <p className="text-gray-300 text-xl">{t('industries.title')}</p>
          </div>

          {/* Industry Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((industry) => (
              <div 
                key={industry.id}
                className="bg-blue-500 text-white rounded-lg p-6 text-center hover:bg-blue-600 transition-colors"
              >
                <span className="text-xl font-semibold">{industry.name}</span>
              </div>
            ))}
          </div>

          {/* Banking and Licenses Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Banking Section */}
            <div className="bg-blue-500 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-2">{t('banking.title')}</h3>
              <p className="text-2xl font-bold text-white mb-4">{t('banking.subtitle')}</p>
            </div>

            {/* Licenses Section */}
            <div className="bg-blue-500 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-white mb-4">{t('licenses.title')}</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-600 rounded p-2 text-center text-white">
                  {t('licenses.emi')}
                </div>
                <div className="bg-blue-600 rounded p-2 text-center text-white">
                  {t('licenses.crypto')}
                </div>
                <div className="bg-blue-600 rounded p-2 text-center text-white">
                  {t('licenses.igaming')}
                </div>
                <div className="bg-blue-600 rounded p-2 text-center text-white">
                  {t('licenses.psp')}
                </div>
                <div className="bg-blue-600 rounded p-2 text-center text-white">
                  {t('licenses.gambling')}
                </div>
                <div className="bg-blue-600 rounded p-2 text-center text-white">
                  {t('licenses.emoney')}
                </div>
              </div>
            </div>
          </div>

          {/* Global Jurisdictions */}
          <div className="bg-blue-500 p-8 rounded-lg mt-8">
            <h3 className="text-xl font-bold text-white mb-4">{t('jurisdictions.title')}</h3>
            <div className="flex flex-wrap gap-2">
              <div className="bg-blue-600 rounded px-4 py-2 text-center text-white">
                {t('jurisdictions.mga')}
              </div>
              <div className="bg-blue-600 rounded px-4 py-2 text-center text-white">
                {t('jurisdictions.curacao')}
              </div>
              <div className="bg-blue-600 rounded px-4 py-2 text-center text-white">
                {t('jurisdictions.fca')}
              </div>
              <div className="bg-blue-600 rounded px-4 py-2 text-center text-white">
                {t('jurisdictions.aml5')}
              </div>
              <div className="bg-blue-600 rounded px-4 py-2 text-center text-white">
                {t('jurisdictions.casino')}
              </div>
            </div>
          </div>

          {/* Stats Counter Section - Updated with proper text colors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 text-center">
            <div className="text-black dark:text-white bg-blue-600 dark:bg-blue-600 p-4 rounded-lg">
              <p className="text-2xl font-bold">{t('stats.countries')}</p>
            </div>
            <div className="text-black dark:text-white bg-blue-600 dark:bg-blue-600 p-4 rounded-lg">
              <p className="text-2xl font-bold">{t('stats.clients')}</p>
            </div>
            <div className="text-black dark:text-white bg-blue-600 dark:bg-blue-600 p-4 rounded-lg">
              <p className="text-2xl font-bold">{t('stats.years')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
