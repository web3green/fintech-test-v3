
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

// AI assistant helper function
export const generateAIResponse = (message: string): string => {
  // Look for intent keywords in the message
  const lowercaseMessage = message.toLowerCase();
  
  // Financial services related keywords
  if (lowercaseMessage.includes("pricing") || lowercaseMessage.includes("cost") || lowercaseMessage.includes("price")) {
    return "Our pricing plans start at $19/month for the basic tier. Would you like me to explain each plan in detail?";
  }
  
  if (lowercaseMessage.includes("support") || lowercaseMessage.includes("help") || lowercaseMessage.includes("assistance")) {
    return "Our support team is available 24/7. You can reach them via email at support@fintechassist.com or by phone at 1-800-FINTECH.";
  }
  
  if (lowercaseMessage.includes("invest") || lowercaseMessage.includes("investing") || lowercaseMessage.includes("investment")) {
    return "Our investment platform offers various options for different risk profiles. We recommend speaking with one of our financial advisors who can provide personalized investment strategies based on your goals.";
  }
  
  if (lowercaseMessage.includes("loan") || lowercaseMessage.includes("credit") || lowercaseMessage.includes("borrow")) {
    return "We offer competitive loan products with interest rates starting at 3.5% APR. Would you like information about our personal loans, business loans, or mortgage options?";
  }
  
  if (lowercaseMessage.includes("account") || lowercaseMessage.includes("sign up") || lowercaseMessage.includes("register")) {
    return "Creating an account with FinTech Assist is easy! You can register online in just 5 minutes. Would you like me to guide you through the process or provide you with the registration link?";
  }
  
  if (lowercaseMessage.includes("demo") || lowercaseMessage.includes("trial") || lowercaseMessage.includes("try")) {
    return "We offer a 14-day free trial of our platform with full access to all features. No credit card required to start. Would you like me to set up a demo account for you?";
  }
  
  if (lowercaseMessage.includes("blockchain") || lowercaseMessage.includes("crypto") || lowercaseMessage.includes("bitcoin")) {
    return "Our blockchain solutions provide secure, transparent financial services. We support major cryptocurrencies and offer institutional-grade security for digital assets. Would you like to know more about our specific blockchain offerings?";
  }
  
  if (lowercaseMessage.includes("security") || lowercaseMessage.includes("safe") || lowercaseMessage.includes("protect")) {
    return "Security is our top priority. We use bank-level encryption, multi-factor authentication, and continuous monitoring to keep your financial data safe. All transactions are protected by our security guarantee.";
  }
  
  // If no specific intent is detected
  return "Thank you for your message. I'd be happy to help with any questions about our financial services. Is there something specific you'd like to know about our banking, investment, or payment solutions?";
};
