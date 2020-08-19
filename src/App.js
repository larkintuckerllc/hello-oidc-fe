import React, { useCallback, useEffect, useState } from 'react';
import { getAuthenticated, loadLoginScreen, login, logout, validateState } from './api/oidc';

const params = (new URL(document.location)).searchParams;
const state = params.get('state');
const code = params.get('code'); 
const auth = getAuthenticated();

export default function App() {
  const [authenticated, setAuthenticated] = useState(auth);
  const [authenticating, setAuthenticating] = useState(code !== null);
  useEffect(() => {
    const execute = async () => {
      window.history.replaceState({}, document.title, '/');
      try {
        const validState = validateState(state);
        if (!validState) throw new Error();
        await login(code);
        setAuthenticated(true);
      } catch (err) {
        // DO NOTHING
      }
      setAuthenticating(false);
    };
    if (!authenticated && code !== null) {
      execute();
    }
  }, []);
  const handleLoginClick = useCallback(() => {
    loadLoginScreen();
  }, []);
  const handleLogoutClick = useCallback(() => {
    logout();
    setAuthenticated(false);
  }, []);

  if (authenticating) {
    return <div>authenticating...</div>;
  }
  if (!authenticated) {
    return <button onClick={handleLoginClick}>Login</button>;
  }
  return <button onClick={handleLogoutClick}>Logout</button>
}
