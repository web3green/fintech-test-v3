
/**
 * Менеджер звуков с принудительным обновлением
 */

// Кеш для звуковых файлов
const soundCache: Record<string, HTMLAudioElement> = {};

// Загрузить звук с указанием версии для сброса кеша
export const loadSound = (soundPath: string): HTMLAudioElement => {
  // Добавляем timestamp для сброса кеша
  const cacheBustedPath = `${soundPath}?v=${Date.now()}`;
  
  // Проверяем, есть ли звук в кеше
  if (soundCache[soundPath]) {
    // Обновляем источник звука
    soundCache[soundPath].src = cacheBustedPath;
    return soundCache[soundPath];
  }
  
  // Создаем новый элемент Audio
  const audio = new Audio(cacheBustedPath);
  audio.preload = 'auto';
  
  // Кешируем звук
  soundCache[soundPath] = audio;
  
  return audio;
};

// Воспроизвести звук
export const playSound = (soundPath: string): void => {
  const sound = loadSound(soundPath);
  
  // Сбрасываем звук на начало
  sound.currentTime = 0;
  
  // Воспроизводим звук
  sound.play().catch(error => {
    console.warn(`Не удалось воспроизвести звук ${soundPath}:`, error);
  });
};

// Инициализировать все звуки заранее
export const preloadSounds = (): void => {
  const sounds = [
    '/sounds/bot-open.mp3',
    '/sounds/bot-send.mp3',
    '/sounds/bot-message.mp3'
  ];
  
  sounds.forEach(soundPath => {
    loadSound(soundPath);
    console.log(`🔊 Звук предзагружен: ${soundPath}`);
  });
};

// Обновить все звуки в кеше
export const refreshSounds = (): void => {
  Object.keys(soundCache).forEach(soundPath => {
    const cacheBustedPath = `${soundPath}?v=${Date.now()}`;
    soundCache[soundPath].src = cacheBustedPath;
    console.log(`🔄 Звук обновлен: ${soundPath}`);
  });
};

// Экспортируем константы для звуков
export const BOT_OPEN_SOUND = '/sounds/bot-open.mp3';
export const BOT_SEND_SOUND = '/sounds/bot-send.mp3';
export const BOT_MESSAGE_SOUND = '/sounds/bot-message.mp3';
