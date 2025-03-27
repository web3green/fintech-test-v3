
import { useEffect } from 'react';

interface VisibilityHandlerProps {
  onVisibilityChange: () => void;
}

export const VisibilityHandler: React.FC<VisibilityHandlerProps> = ({ onVisibilityChange }) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        onVisibilityChange();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onVisibilityChange]);
  
  return null;
};
