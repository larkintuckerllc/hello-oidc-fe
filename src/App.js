import React, { useCallback, useEffect, useState } from 'react';
import { getHello } from  './api/hello';
import { getAuthenticated, loadLoginScreen, login, logout, validateState } from './api/oidc';

const params = (new URL(document.location)).searchParams;
const state = params.get('state');
const code = params.get('code'); 
const auth = getAuthenticated();

export default function App() {
  const [authenticated, setAuthenticated] = useState(auth);
  const [authenticating, setAuthenticating] = useState(code !== null);
  const [hello, setHello] = useState('');
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
  }, [authenticated]);
  const handleHelloClick = useCallback(async () => {
    try {
      const newHello = await getHello();
      setHello(newHello);
    } catch (err) {
      // DO NOTHING
    }
  }, []);
  const handleLoginClick = useCallback(() => {
    loadLoginScreen();
  }, []);
  const handleLogoutClick = useCallback(() => {
    logout();
    setHello('');
    setAuthenticated(false);
  }, []);

  if (authenticating) {
    return <div>authenticating...</div>;
  }
  if (!authenticated) {
    return <button onClick={handleLoginClick}>Login</button>;
  }
  return (
    <>
      <div>
        <div><b>Hello:</b> {hello}</div>
        <button onClick={handleHelloClick}>Hello</button>
      </div>
      <div>
        <button onClick={handleLogoutClick}>Logout</button>
      </div>
    </>
  );
}
