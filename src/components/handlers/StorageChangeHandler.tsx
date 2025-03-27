
import { useEffect } from 'react';

interface StorageChangeHandlerProps {
  onStorageChange: (key: string, newValue: string | null) => void;
}

export const StorageChangeHandler: React.FC<StorageChangeHandlerProps> = ({ onStorageChange }) => {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      onStorageChange(e.key || '', e.newValue);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [onStorageChange]);
  
  return null;
};
