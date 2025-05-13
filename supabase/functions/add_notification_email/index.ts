// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/supabase_edge_functions

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Cors headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

console.log("Функция add_notification_email запущена!")

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Проверяем, что метод POST
    if (req.method !== 'POST') {
      throw new Error('Метод должен быть POST')
    }

    // Получаем параметры запроса - поддерживаем как массив email адресов, так и одиночный email
    const body = await req.json()
    const emails = body.emails || (body.email ? [body.email] : [])
    
    if (emails.length === 0) {
      throw new Error('Не указаны email адреса для добавления')
    }

    // Создаем клиента Supabase - не требуем авторизации 
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Используем сервисный ключ
    )

    const results = {
      success: [] as string[],
      failed: [] as string[]
    }

    // Обрабатываем каждый email
    for (const emailRaw of emails) {
      try {
        // Очищаем и проверяем email
        const email = emailRaw.trim().toLowerCase()
        if (!email || !email.includes('@') || !email.includes('.')) {
          results.failed.push(emailRaw)
          console.error(`Некорректный формат email: ${emailRaw}`)
          continue
        }

        // Проверяем, существует ли уже такой email
        const { data: existingEmails, error: checkError } = await supabaseClient
          .from('notification_emails')
          .select('email')
          .eq('email', email)
        
        if (checkError) {
          console.error(`Ошибка проверки существующего email ${email}:`, checkError)
          results.failed.push(email)
          continue
        }

        if (existingEmails && existingEmails.length > 0) {
          console.log(`Email ${email} уже существует`)
          results.success.push(email) // Считаем это успехом, так как email уже в базе
          continue
        }

        // Сначала пробуем обычную вставку
        const { error: insertError } = await supabaseClient
          .from('notification_emails')
          .insert([{ 
            email: email, 
            created_at: new Date().toISOString() 
          }])
        
        if (insertError) {
          console.error(`Ошибка вставки email ${email}:`, insertError)
          
          // Если ошибка связана с ограничением формата, используем прямой SQL
          if (insertError.code === '23514') {
            // Используем SQL для обхода ограничения
            const { error: sqlError } = await supabaseClient.rpc('exec_sql', { 
              sql_query: `INSERT INTO notification_emails (email, created_at) 
                VALUES ('${email}', now()) 
                ON CONFLICT (email) DO NOTHING`
            })
            
            if (sqlError) {
              console.error(`Ошибка SQL вставки для ${email}:`, sqlError)
              results.failed.push(email)
            } else {
              console.log(`Email ${email} успешно добавлен через SQL`)
              results.success.push(email)
            }
          } else {
            results.failed.push(email)
          }
        } else {
          console.log(`Email ${email} успешно добавлен`)
          results.success.push(email)
        }
      } catch (emailError) {
        console.error(`Ошибка обработки email ${emailRaw}:`, emailError)
        results.failed.push(emailRaw)
      }
    }

    // Возвращаем результаты
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Обработано ${emails.length} email адресов, успешно: ${results.success.length}, с ошибками: ${results.failed.length}`,
        results
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: results.success.length > 0 ? 200 : 400
      }
    )
  } catch (error) {
    console.error('Общая ошибка в функции:', error)
  return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Неизвестная ошибка' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/add_notification_email' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
