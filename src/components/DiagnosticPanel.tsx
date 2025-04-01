import { useState } from 'react';
import { FixSupabaseBucket } from '@/utils/diagnostics';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  CheckCircle2, 
  Database, 
  Image, 
  Loader2, 
  RefreshCw, 
  X
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Диагностическая панель для исправления проблем с загрузкой приложения
 * Отображается, когда возникают проблемы с загрузкой приложения
 */
export const DiagnosticPanel = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  
  const handleFixLogo = async () => {
    setIsRunning(true);
    setResults(null);
    
    try {
      const result = await FixSupabaseBucket.forceLogoInitialization();
      setResults(result);
      
      if (result.success) {
        toast.success('Логотип успешно загружен в Supabase!');
        
        // Перезагрузить страницу через 3 секунды
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error('Не удалось загрузить логотип. Проверьте консоль для деталей.');
      }
    } catch (error) {
      console.error('Ошибка при инициализации логотипа:', error);
      setResults({ success: false, error });
      toast.error('Произошла ошибка при инициализации логотипа');
    } finally {
      setIsRunning(false);
    }
  };
  
  // Отображаем кнопку диагностики в углу экрана
  return (
    <>
      {showPanel ? (
        <div className="fixed bottom-4 right-4 z-50 w-80 bg-card shadow-lg rounded-lg border border-border p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg flex items-center">
              <Database className="w-5 h-5 mr-2" /> Диагностика
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowPanel(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground mb-2">
              Если у вас возникли проблемы с загрузкой приложения, вы можете попробовать исправить их автоматически.
            </div>
            
            <Button 
              variant="default" 
              className="w-full" 
              disabled={isRunning}
              onClick={handleFixLogo}
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                  Загрузка логотипа...
                </>
              ) : (
                <>
                  <Image className="h-4 w-4 mr-2" /> 
                  Загрузить логотип в Supabase
                </>
              )}
            </Button>
            
            {results && (
              <div className={`mt-2 p-3 text-sm rounded-md ${results.success ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
                <div className="flex items-start">
                  {results.success ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    {results.success ? (
                      <>
                        <p className="font-medium text-green-500">Успешно!</p>
                        <p className="text-muted-foreground">
                          Логотип загружен. Страница будет перезагружена автоматически.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-destructive">Ошибка на шаге {results.step}</p>
                        <p className="text-muted-foreground break-all">
                          {results.error?.message || 'Неизвестная ошибка'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" /> 
              Перезагрузить страницу
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 shadow-md"
          onClick={() => setShowPanel(true)}
        >
          <Database className="h-4 w-4 mr-2" /> 
          Диагностика
        </Button>
      )}
    </>
  );
}; 