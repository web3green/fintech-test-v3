/**
 * Contact form API utilities for handling form submissions and webhook integration
 */

// Function to process contact form submissions
export const processContactForm = async (formData: {
  name: string;
  email: string;
  message: string;
}) => {
  // Save to localStorage for local testing
  const existingRequests = localStorage.getItem("requests");
  const requests = existingRequests ? JSON.parse(existingRequests) : [];
  
  const newRequest = {
    id: requests.length ? Math.max(...requests.map((r: any) => r.id)) + 1 : 1,
    ...formData,
    status: "new",
    date: new Date().toISOString().split("T")[0],
  };
  
  requests.push(newRequest);
  localStorage.setItem("requests", JSON.stringify(requests));
  
  // Send to webhook if configured
  try {
    const webhookUrl = localStorage.getItem("webhookUrl");
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Handle CORS issues
        body: JSON.stringify({
          event: "new_contact_request",
          request: newRequest,
          timestamp: new Date().toISOString()
        }),
      });
    }
    return { success: true, id: newRequest.id };
  } catch (error) {
    console.error("Error sending webhook:", error);
    return { success: true, id: newRequest.id }; // Still return success since we saved locally
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
