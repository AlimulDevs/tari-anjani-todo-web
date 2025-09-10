import React, { useState, useEffect } from 'react';
import { PinInput } from './components/PinInput';
import { Dashboard } from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedPin = localStorage.getItem('userPin');
    if (storedPin) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handlePinSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-pink-300 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PinInput onSuccess={handlePinSuccess} />;
  }

  return <Dashboard />;
}

export default App;