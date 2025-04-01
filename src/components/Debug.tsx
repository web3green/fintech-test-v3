import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertTriangle, RefreshCw, Database, CloudCog, Server, FileCode, Globe } from "lucide-react";
import { logEnvironmentVariables, testFetchStorage, testSupabaseStorage, testSupabaseConnection } from "@/utils/debug";
import { useSiteTexts } from '@/services/siteTextsService';
import { toast } from 'sonner';

export function DebugPanel() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [fetchResult, setFetchResult] = useState<any>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [storageResult, setStorageResult] = useState<any>(null);
  const [storageLoading, setStorageLoading] = useState(false);
  const [dbResult, setDbResult] = useState<any>(null);
  const [dbLoading, setDbLoading] = useState(false);
  const [jsErrors, setJsErrors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const { resetToInitial } = useSiteTexts();
  
  useEffect(() => {
    try {
      const vars = logEnvironmentVariables();
      setEnvVars(vars);
      
      // Установка слушателя для отлавливания ошибок
      const errorHandler = (event: ErrorEvent) => {
        event.preventDefault();
        setJsErrors(prev => [...prev, `${event.message} (${event.filename}:${event.lineno})`]);
      };
      
      window.addEventListener('error', errorHandler);
      
      return () => {
        window.removeEventListener('error', errorHandler);
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке переменных окружения');
    }
  }, []);
  
  const handleTestFetch = async () => {
    setFetchLoading(true);
    setFetchResult(null);
    
    try {
      const result = await testFetchStorage();
      setFetchResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при тестировании fetch');
    } finally {
      setFetchLoading(false);
    }
  };
  
  const handleTestStorage = async () => {
    setStorageLoading(true);
    setStorageResult(null);
    
    try {
      const result = await testSupabaseStorage();
      setStorageResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при тестировании хранилища');
    } finally {
      setStorageLoading(false);
    }
  };
  
  const handleTestDbConnection = async () => {
    setDbLoading(true);
    setDbResult(null);
    
    try {
      const result = await testSupabaseConnection();
      setDbResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при тестировании базы данных');
    } finally {
      setDbLoading(false);
    }
  };
  
  const checkMainAppRendering = () => {
    try {
      // Проверяем загрузку модулей
      const modules = Object.keys(window).filter(key => 
        key.startsWith('__vite') || 
        key.startsWith('react') || 
        key.includes('RefreshRuntime')
      );
      
      // Проверяем рендеринг основного содержимого
      const root = document.getElementById('root');
      const rootContent = root?.innerHTML || '';
      const hasRootContent = rootContent.length > 10; // Есть какой-то контент
      
      setJsErrors(prev => [...prev, 
        `Vite/React модули: ${modules.length} загружено`,
        `Контент root: ${hasRootContent ? 'Есть' : 'Отсутствует'}`
      ]);
      
      // Проверяем ошибки консоли
      console.log('Диагностика: проверка работы консоли');
    } catch (err) {
      setJsErrors(prev => [...prev, `Ошибка при проверке: ${err instanceof Error ? err.message : String(err)}`]);
    }
  };
  
  const handleResetTexts = () => {
    resetToInitial();
    toast.success('Тексты обновлены и недостающие ключи добавлены');
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Панель диагностики</h1>
      <p className="text-muted-foreground mb-8">Инструменты для диагностики соединения с Supabase и другими сервисами</p>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="env">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="env">Переменные окружения</TabsTrigger>
          <TabsTrigger value="fetch">Тест Fetch API</TabsTrigger>
          <TabsTrigger value="storage">Supabase Storage</TabsTrigger>
          <TabsTrigger value="database">База данных</TabsTrigger>
          <TabsTrigger value="js-errors">Ошибки JS</TabsTrigger>
        </TabsList>
        
        <TabsContent value="env">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CloudCog className="h-5 w-5 mr-2" />
                Переменные окружения
              </CardTitle>
              <CardDescription>
                Настройки подключения к Supabase и другим сервисам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя переменной</TableHead>
                    <TableHead>Значение</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(envVars).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-mono text-sm">{key}</TableCell>
                      <TableCell>
                        {value === 'Определено' ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" /> {value}
                          </Badge>
                        ) : value === 'Не определено' ? (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            <XCircle className="h-3 w-3 mr-1" /> {value}
                          </Badge>
                        ) : (
                          <span className="font-mono text-sm break-all">{value}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fetch">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 mr-2" />
                Тестирование Fetch API
              </CardTitle>
              <CardDescription>
                Прямое соединение с сервером Supabase Storage по URL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={handleTestFetch} 
                    disabled={fetchLoading}
                    variant="outline"
                  >
                    {fetchLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Globe className="h-4 w-4 mr-2" />}
                    Проверить Fetch API
                  </Button>
                  
                  <Button 
                    onClick={handleTestStorage} 
                    disabled={storageLoading}
                    variant="outline"
                  >
                    {storageLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
                    Проверить Storage API
                  </Button>
                  
                  <Button 
                    onClick={handleResetTexts} 
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Обновить тексты
                  </Button>
                </div>
                
                {fetchResult && (
                  <div className="mt-4">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold mr-2">Результат:</h3>
                      {fetchResult.success ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" /> Успешно
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" /> Ошибка
                        </Badge>
                      )}
                    </div>
                    
                    {fetchResult.error ? (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Ошибка соединения</AlertTitle>
                        <AlertDescription>{fetchResult.error}</AlertDescription>
                      </Alert>
                    ) : (
                      <>
                        <h4 className="font-semibold mb-2">Запрос к сервису хранилища:</h4>
                        <pre className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md text-sm mb-4 overflow-auto">
                          {JSON.stringify(fetchResult.storageResponse, null, 2)}
                        </pre>
                        
                        {fetchResult.bucketResponse && (
                          <>
                            <h4 className="font-semibold mb-2">Запрос к бакету:</h4>
                            <pre className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md text-sm overflow-auto">
                              {JSON.stringify(fetchResult.bucketResponse, null, 2)}
                            </pre>
                          </>
                        )}
                        
                        {fetchResult.bucketError && (
                          <Alert variant="destructive" className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Ошибка при доступе к бакету</AlertTitle>
                            <AlertDescription>{fetchResult.bucketError}</AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CloudCog className="h-5 w-5 mr-2" />
                Supabase Storage
              </CardTitle>
              <CardDescription>
                Проверка работы Supabase Storage через клиент
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={handleTestStorage} 
                  disabled={storageLoading}
                  className="w-full"
                >
                  {storageLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Проверка...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Проверить Storage API
                    </>
                  )}
                </Button>
                
                {storageResult && (
                  <div className="mt-4">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold mr-2">Результат:</h3>
                      {storageResult.success ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" /> Успешно
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" /> Ошибка
                        </Badge>
                      )}
                    </div>
                    
                    {storageResult.error ? (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Ошибка хранилища</AlertTitle>
                        <AlertDescription>{storageResult.error}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Статус клиента:</h4>
                          <div className="flex items-center">
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mr-2">
                              <CheckCircle className="h-3 w-3 mr-1" /> Клиент инициализирован
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Доступные бакеты:</h4>
                          <div className="flex flex-wrap gap-2">
                            {storageResult.buckets?.map((bucket: string) => (
                              <Badge key={bucket} variant="outline">
                                {bucket}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Структура хранилища:</h4>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Badge 
                                variant="outline" 
                                className={storageResult.assetsBucketExists ? 
                                  "bg-green-50 text-green-700 border-green-200 mr-2" : 
                                  "bg-red-50 text-red-700 border-red-200 mr-2"}
                              >
                                {storageResult.assetsBucketExists ? 
                                  <CheckCircle className="h-3 w-3 mr-1" /> : 
                                  <XCircle className="h-3 w-3 mr-1" />}
                                Бакет assets
                              </Badge>
                            </div>
                            
                            {storageResult.assetsBucketExists && (
                              <div className="ml-6">
                                <div className="flex items-center">
                                  <Badge 
                                    variant="outline" 
                                    className={storageResult.logosExists ? 
                                      "bg-green-50 text-green-700 border-green-200 mr-2" : 
                                      "bg-red-50 text-red-700 border-red-200 mr-2"}
                                  >
                                    {storageResult.logosExists ? 
                                      <CheckCircle className="h-3 w-3 mr-1" /> : 
                                      <XCircle className="h-3 w-3 mr-1" />}
                                    Папка logos
                                  </Badge>
                                </div>
                                
                                {storageResult.logosExists && (
                                  <div className="ml-6">
                                    <div className="flex items-center">
                                      <Badge 
                                        variant="outline" 
                                        className={storageResult.logoExists ? 
                                          "bg-green-50 text-green-700 border-green-200 mr-2" : 
                                          "bg-red-50 text-red-700 border-red-200 mr-2"}
                                      >
                                        {storageResult.logoExists ? 
                                          <CheckCircle className="h-3 w-3 mr-1" /> : 
                                          <XCircle className="h-3 w-3 mr-1" />}
                                        Файл logo.svg
                                      </Badge>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {storageResult.logoUrl && (
                          <div>
                            <h4 className="font-semibold mb-2">URL логотипа:</h4>
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md text-sm overflow-auto break-all">
                              <a href={storageResult.logoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {storageResult.logoUrl}
                              </a>
                            </div>
                            
                            <div className="mt-4 flex items-center">
                              <span className="mr-2">Статус доступности:</span>
                              {storageResult.logoAccessible ? (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  <CheckCircle className="h-3 w-3 mr-1" /> Доступен ({storageResult.logoStatus})
                                </Badge>
                              ) : (
                                <Badge variant="destructive">
                                  <XCircle className="h-3 w-3 mr-1" /> Недоступен ({storageResult.logoStatus})
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                База данных Supabase
              </CardTitle>
              <CardDescription>
                Проверка соединения с базой данных и RPC функций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={handleTestDbConnection} 
                  disabled={dbLoading}
                  className="w-full"
                >
                  {dbLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Проверка...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Проверить соединение с базой данных
                    </>
                  )}
                </Button>
                
                {dbResult && (
                  <div className="mt-4">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold mr-2">Результат:</h3>
                      {dbResult.success ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" /> Успешно
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" /> Ошибка
                        </Badge>
                      )}
                    </div>
                    
                    {dbResult.error ? (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Ошибка соединения с базой данных</AlertTitle>
                        <AlertDescription>{dbResult.error}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">RPC функция:</h4>
                          <pre className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md text-sm mb-4 overflow-auto">
                            {JSON.stringify(dbResult.rpcResponse, null, 2)}
                          </pre>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Доступ к таблице настроек:</h4>
                          <div className="flex items-center mb-2">
                            <Badge 
                              variant="outline" 
                              className={dbResult.settingsAvailable ? 
                                "bg-green-50 text-green-700 border-green-200 mr-2" : 
                                "bg-amber-50 text-amber-700 border-amber-200 mr-2"}
                            >
                              {dbResult.settingsAvailable ? 
                                <CheckCircle className="h-3 w-3 mr-1" /> : 
                                <AlertTriangle className="h-3 w-3 mr-1" />}
                              {dbResult.settingsAvailable ? "Настройки доступны" : "Настройки отсутствуют"}
                            </Badge>
                          </div>
                          
                          {dbResult.settings && dbResult.settings.length > 0 && (
                            <pre className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md text-sm overflow-auto">
                              {JSON.stringify(dbResult.settings, null, 2)}
                            </pre>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="js-errors">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileCode className="h-5 w-5 mr-2" />
                Диагностика JavaScript
              </CardTitle>
              <CardDescription>
                Проверка ошибок и состояния JavaScript приложения
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={checkMainAppRendering} 
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Проверить рендеринг приложения
                </Button>
                
                {jsErrors.length > 0 ? (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-4">Обнаруженные проблемы:</h3>
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md text-sm overflow-auto max-h-[300px]">
                      <ul className="space-y-2">
                        {jsErrors.map((err, index) => (
                          <li key={index} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                            {err}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 text-center text-muted-foreground">
                    Ошибки JavaScript не обнаружены
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Страница диагностики для проверки соединений и конфигурации приложения.
          <br />
          В случае проблем, пожалуйста, обратитесь к разработчикам.
        </p>
      </div>
    </div>
  );
} 