import jwt_decode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';

/** Determines if application is authenticated */
export const getAuthenticated = () => {
  const idToken = window.localStorage.getItem('id_token');
  return idToken !== null;
}

/** Prepares application for login and loads login screen  */
export const loadLoginScreen = () => {
  window.localStorage.removeItem('id_token');
  window.localStorage.removeItem('refresh_token');
  const state = uuidv4();
  const nonce = uuidv4();
  window.localStorage.setItem('state', state);
  window.localStorage.setItem('nonce', nonce);
  window.location.assign(`${process.env.REACT_APP_OIDC_URI_BASE}/login-screen?state=${state}&nonce=${nonce}`);
}

export const validateState = checkState => {
  const state = window.localStorage.getItem('state');
  window.localStorage.removeItem('state');
  return checkState === state;
}

const validateNonce = checkNonce => {
  const nonce = window.localStorage.getItem('nonce');
  window.localStorage.removeItem('nonce');
  return checkNonce === nonce;
}

export const login = async code => {
  const response = await fetch(
    `${process.env.REACT_APP_OIDC_URI_BASE}/get-tokens`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code }), 
    },
  );
  if (!response.ok) {
    throw new Error();
  }
  const { id_token, refresh_token } = await response.json();
  const { nonce }= jwt_decode(id_token);
  const validNonce = validateNonce(nonce);
  if (!validNonce) throw new Error();
  window.localStorage.setItem('id_token', id_token);
  window.localStorage.setItem('refresh_token', refresh_token);
}

export const refresh = async () => {
  const refresh_token = window.localStorage.getItem('refresh_token');
  const response = await fetch(
    `${process.env.REACT_APP_OIDC_URI_BASE}/refresh-tokens`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token }), 
    },
  );
  if (!response.ok) {
    throw new Error();
  }
  const { id_token } = await response.json();
  window.localStorage.setItem('id_token', id_token);
}

export const logout = () => {
  window.localStorage.removeItem('id_token');
  window.localStorage.removeItem('refresh_token');
  window.location.reload();
}

export const getTokens = () => {
  const id_token = window.localStorage.getItem('id_token');
  return ({
    id_token,
  });
}
