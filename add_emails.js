// Скрипт для добавления уведомительных email-адресов
const emails = [
  'info@fintech-assist.com',
  'greg@fintech-assist.com',
  'alex@fintech-assist.com'
];

// Supabase URL и анонимный ключ
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bpytoeulcofbwpyxllku.supabase.co';
// Анонимный ключ для авторизации
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJweXRvZXVsY29mYndweXhsbGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5OTIzNzcsImV4cCI6MjA2MjU2ODM3N30.4HmkVdvNvQRa-2KWsUZoWp1LqsVVJFwNFcIHpSl8KzI';

const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/add_notification_email`;

async function addEmails() {
  console.log(`Добавление email адресов: ${emails.join(', ')}`);
  
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`
      },
      body: JSON.stringify({ emails: emails })
    });
    
    const resultText = await response.text();
    console.log('Ответ сервера:', resultText);
    
    let result;
    try {
      result = JSON.parse(resultText);
    } catch (e) {
      console.log('Ответ не в формате JSON');
      return;
    }
    
    if (response.ok) {
      console.log(`✅ Успешно: ${result.message}`);
      
      if (result.results?.success?.length > 0) {
        console.log(`Успешно добавлены: ${result.results.success.join(', ')}`);
      }
      
      if (result.results?.failed?.length > 0) {
        console.log(`Не удалось добавить: ${result.results.failed.join(', ')}`);
      }
    } else {
      console.error(`❌ Ошибка: ${result.error || `Статус: ${response.status}`}`);
    }
  } catch (error) {
    console.error(`❌ Исключение при добавлении email:`, error.message);
  }
}

addEmails().catch(e => console.error('Ошибка:', e)); 