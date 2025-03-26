
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import AboutUs from '@/pages/AboutUs';
import Services from '@/pages/Services';
import Blog from '@/pages/Blog';
import NotFound from '@/pages/NotFound';
import Admin from '@/pages/Admin';

// Favicon manager component ensures our favicon is always set
function FaviconManager() {
  useEffect(() => {
    // Define our favicon base64 data
    const OUR_FAVICON_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/0lEQVR42mNkGGDAOOqAUQeMOmDUAaMO4D4AH2egFQAAgL7gNAOwAICvBzx+/Jjl4cOH8p8/f2YihJmZmbmYmJg3CQkJP6Fyn6H0F3Fxca+QkJCvKSkpX+Pi4r7/hYI/f/68//Tp09OJiYmvO39sEdZVNzU7evToWxkZme8gR/z8+fPPnz9/fv/69evv79+//0HB/4H4HxD/B+E/UP5/EP0fCYP4/xkYGBmA8v+A4vA4AMXRTwYsBuAK/FetWnVm7969x48cOXLi8ePHN27evHnj1q1bd+7cuXMPiO/CcBbQ9OfPn79y48aNG1euXLly+fLly5cuXbpw/vz5M2fOnDlNU1sAB1+QqgkWAlsAAAAASUVORK5CYII=';
    
    // Set our favicon
    const setOurFavicon = () => {
      // Remove unwanted icons
      const unwantedIcons = document.querySelectorAll(
        'link[href*="heart"], link[href*="favicon.ico"], link[href*="gpteng"], link[href*="gptengineer"]'
      );
      unwantedIcons.forEach(icon => icon.remove());
      
      // Add our favicon
      let ourIcon = document.querySelector('link[href="' + OUR_FAVICON_BASE64 + '"]');
      if (!ourIcon) {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = OUR_FAVICON_BASE64;
        document.head.appendChild(link);
      }
    };

    // Set favicon immediately and on intervals
    setOurFavicon();
    
    // Set up intervals to ensure favicon persistence
    const intervals = [];
    for (let i = 0; i < 10; i++) {
      intervals.push(setTimeout(setOurFavicon, i * 500));
    }
    
    // Set up continuous monitoring
    const intervalId = setInterval(setOurFavicon, 2000);
    
    return () => {
      intervals.forEach(clearTimeout);
      clearInterval(intervalId);
    };
  }, []);

  return null;
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="fintech-theme">
      <FaviconManager />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
