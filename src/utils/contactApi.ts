
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
  // This is a simple mock function
  // In a real implementation, this would connect to an AI service
  
  if (message.toLowerCase().includes("pricing")) {
    return "Our pricing plans start at $19/month for the basic tier. Would you like me to explain each plan in detail?";
  }
  
  if (message.toLowerCase().includes("support")) {
    return "Our support team is available 24/7. You can reach them via email at support@fintechassist.com or by phone at 1-800-FINTECH.";
  }
  
  // Default response
  return "Thank you for your message. A member of our team will get back to you shortly. Is there anything specific you'd like to know about our services in the meantime?";
};
