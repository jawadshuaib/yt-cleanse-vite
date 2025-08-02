import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // This effect runs on page load to handle the return from Google's OAuth redirect.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // Remove the '#'
      const token = params.get('access_token');

      if (token) {
        setAccessToken(token);

        // Clean up the URL so the token doesn't stay in the address bar.
        window.history.replaceState(
          null,
          document.title,
          window.location.pathname + window.location.search,
        );
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleLogout = () => {
    setAccessToken(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {accessToken ? (
        <Dashboard accessToken={accessToken} onLogout={handleLogout} />
      ) : (
        <LoginScreen />
      )}
    </div>
  );
};

export default App;
