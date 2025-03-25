
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Helper function to force image meta tags to update with cache busting
const updateImageMetaTags = () => {
  const timestamp = Date.now();
  const logoUrl = `https://test.mcaweb.xyz/lovable-uploads/8f51558f-dcfd-4921-b6e4-112532ad0723.png?nocache=${timestamp}`;
  
  // Remove any existing OG image tags first
  document.querySelectorAll('meta[property^="og:image"]').forEach(tag => {
    if (tag.getAttribute('property') !== 'og:image:alt' && 
        tag.getAttribute('property') !== 'og:image:width' && 
        tag.getAttribute('property') !== 'og:image:height') {
      tag.remove();
    }
  });
  
  // Remove Twitter image tags
  document.querySelectorAll('meta[name="twitter:image"], meta[property="twitter:image"]').forEach(tag => {
    tag.remove();
  });
  
  // Create fresh meta tags with cache busting
  const metaTags = [
    { property: 'og:image', content: logoUrl },
    { property: 'og:image:url', content: logoUrl },
    { property: 'og:image:secure_url', content: logoUrl },
    { name: 'twitter:image', content: logoUrl }
  ];
  
  metaTags.forEach(({ property, name, content }) => {
    const meta = document.createElement('meta');
    if (property) meta.setAttribute('property', property);
    if (name) meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  });
  
  console.log("Meta tags updated with cache-busting timestamp:", timestamp);
};

// Initial update when page loads
document.addEventListener('DOMContentLoaded', () => {
  updateImageMetaTags();
  
  // Set interval to periodically update meta tags
  setInterval(updateImageMetaTags, 5000);
});

createRoot(document.getElementById("root")!).render(<App />);
