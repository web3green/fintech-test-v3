import { supabase } from '@/integrations/supabase/client';

/**
 * Contact form API utilities for handling form submissions and webhook integration
 */

// Define the type for the form data, aligning with ContactFormFields.tsx
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

// Function to process contact form submissions
export const processContactForm = async (formData: ContactFormData) => {
  
  // Insert data into Supabase
  try {
    const { data: insertedData, error: insertError } = await supabase
      .from('contact_requests')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          status: 'unanswered' // Default status
        }
      ])
      .select() // Return the inserted row(s)
      .single(); // Expecting a single row back

    if (insertError) {
      console.error("Error inserting contact request into Supabase:", insertError);
      throw new Error(`Supabase error: ${insertError.message}`); // Throw an error to be caught below
    }

    // If Supabase insert is successful, proceed with webhook
    try {
      const webhookUrl = localStorage.getItem("webhookUrl"); // Keep webhook optional via localStorage for now
      if (webhookUrl && insertedData) {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors", // Handle CORS issues
          body: JSON.stringify({
            event: "new_contact_request",
            request: { // Send the data inserted into Supabase
              id: insertedData.id,
              name: insertedData.name,
              email: insertedData.email,
              phone: insertedData.phone,
              service: insertedData.service,
              message: insertedData.message,
              status: insertedData.status,
              created_at: insertedData.created_at
            },
            timestamp: new Date().toISOString()
          }),
        });
      }
      // Return success based on Supabase insert
      return { success: true, id: insertedData?.id }; 

    } catch (webhookError) {
      console.error("Error sending webhook (but Supabase insert was successful):", webhookError);
      // Still return success because the primary action (DB insert) worked
      return { success: true, id: insertedData?.id }; 
    }

  } catch (error) {
    console.error("Failed to process contact form submission:", error);
    // Return failure if Supabase insert failed
    return { success: false, error: (error as Error).message }; 
  }
};

// AI assistant helper function - Now returns a key instead of text
export const generateAIResponse = (message: string): string => {
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes("pricing") || lowercaseMessage.includes("cost") || lowercaseMessage.includes("price")) {
    return "chatbot.response.pricing";
  }
  
  if (lowercaseMessage.includes("support") || lowercaseMessage.includes("help") || lowercaseMessage.includes("assistance")) {
    return "chatbot.response.support";
  }
  
  if (lowercaseMessage.includes("invest") || lowercaseMessage.includes("investing") || lowercaseMessage.includes("investment")) {
    return "chatbot.response.investment";
  }
  
  if (lowercaseMessage.includes("loan") || lowercaseMessage.includes("credit") || lowercaseMessage.includes("borrow")) {
    return "chatbot.response.loan";
  }
  
  if (lowercaseMessage.includes("account") || lowercaseMessage.includes("sign up") || lowercaseMessage.includes("register")) {
    return "chatbot.response.account";
  }
  
  if (lowercaseMessage.includes("demo") || lowercaseMessage.includes("trial") || lowercaseMessage.includes("try")) {
    return "chatbot.response.demo";
  }
  
  if (lowercaseMessage.includes("blockchain") || lowercaseMessage.includes("crypto") || lowercaseMessage.includes("bitcoin")) {
    return "chatbot.response.blockchain";
  }
  
  if (lowercaseMessage.includes("security") || lowercaseMessage.includes("safe") || lowercaseMessage.includes("protect")) {
    return "chatbot.response.security";
  }
  
  // If no specific intent is detected
  return "chatbot.response.default";
};
