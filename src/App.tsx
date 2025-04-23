import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef, useState, ErrorInfo, Component } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { toast } from "sonner";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import "@/utils/diagnostics";
import "@/utils/debug";
import { testSupabaseConnection, supabase } from "@/integrations/supabase/client";
import { checkStorageAccess } from "@/utils/storageUtils";
import { DebugPanel } from "@/components/Debug";
import { ErrorBoundary } from "react-error-boundary";
import { clearBrowserCache } from "./utils/cacheCleanup";
import { Helmet } from 'react-helmet-async';

// Ставим статичную версию для начала
const APP_VERSION = '0.1.0';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 5 * 60 * 1000, // 5 минут
    },
  },
});

const VersionChecker = () => {
  useEffect(() => {
    const savedVersion = localStorage.getItem('app_version');
    
    if (savedVersion && savedVersion !== APP_VERSION) {
      console.log('Обнаружена новая версия приложения. Обновление...');
      // Очищаем кеш ПЕРЕД перезагрузкой
      clearBrowserCache().catch(err => 
        console.warn('Ошибка при очистке кеша во время обновления:', err)
      );
      localStorage.setItem('app_version', APP_VERSION);
      
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
          });
        });
      }
      
      toast.info('Обновляем приложение до последней версии...', {
        duration: 3000,
        onAutoClose: () => window.location.reload()
      });
    } else {
      localStorage.setItem('app_version', APP_VERSION);
    }
  }, []);

  return null;
};

const AppContent = () => {
  const { isLoading: isLangLoading } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);

  useEffect(() => {
    console.log('App component mounted - basic setup only');
    
    try {
      // Только базовая настройка темы без обращения к внешним ресурсам
      const savedTheme = localStorage.getItem('theme');
      
      // По умолчанию используем темную тему, если не сохранена светлая
      // if (savedTheme !== 'light') { // Temporarily commenting out theme logic
      //   // Add checks before using classList.add
      //   if (document.documentElement && document.documentElement.classList) {
      //     document.documentElement.classList.add('dark');
      //   } else {
      //     console.warn('Could not set dark theme: documentElement or classList is not available at this time.');
      //   }
      // }
      
      // Немедленно разрешаем загрузку без дополнительных проверок
      setIsLoaded(true);
    } catch (error) {
      console.error('Critical error during app initialization:', error);
      setLoadErrors(prev => [...prev, `Критическая ошибка при инициализации: ${error.message}`]);
      setIsLoaded(true); // Все равно разрешаем загрузку, чтобы показать ошибки
    }
  }, []);

  if (!isLoaded || isLangLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-fintech-blue mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {loadErrors.length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-destructive/10 p-2">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-destructive">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              <h3 className="font-semibold text-destructive">Внимание: обнаружены некритические ошибки</h3>
            </div>
            <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
              {loadErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
            <p className="text-xs mt-2 text-muted-foreground">Приложение продолжает работу, но некоторые функции могут быть недоступны</p>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/debug" element={<DebugPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Компонент для отображения ошибок в UI
const ErrorDisplay = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md w-full bg-card shadow-lg rounded-lg p-6 border border-muted">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-destructive mr-2" />
          <h2 className="text-lg font-semibold">Произошла ошибка</h2>
        </div>
        <div className="bg-muted p-3 rounded-md mb-4 overflow-auto max-h-[200px]">
          <p className="text-sm font-mono">{error.message}</p>
        </div>
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
        >
          Перезагрузить приложение
        </button>
      </div>
    </div>
  );
}

// Главный компонент App с обработкой ошибок
const App = () => {
  return (
    <ErrorBoundary fallbackRender={ErrorDisplay}>
      <Helmet>
        <title>FinTechAssist - Ваш Партнер в Лицензировании</title>
        <meta name="description" content="FinTechAssist предлагает решения для лицензирования и развития вашего бизнеса. Получите лицензию, подготовьтесь и действуйте уверенно." />
        {/* Schema.org markup for Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "FinTechAssist",
            "url": "https://fintech-assist.com/",
            "logo": "https://fintech-assist.com/images/logo.png",
            // Optional: Add contact points or social links here if available
            // "contactPoint": {
            //   "@type": "ContactPoint",
            //   "telephone": "+1-XXX-XXX-XXXX",
            //   "contactType": "customer service"
            // },
            // "sameAs": [
            //   "https://www.facebook.com/yourprofile",
            //   "https://www.linkedin.com/company/yourcompany"
            // ]
          })}
        </script>
        {/* Schema.org markup for WebSite */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://fintech-assist.com/",
            // No search action defined as there's no internal search
          })}
        </script>
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
