import { v4 as uuidv4 } from 'uuid';

export function getAuthenticated() {
    const idToken = window.localStorage.getItem('id_token');
    return idToken !== null;
}

export function login() {
    window.localStorage.removeItem('id_token');
    window.localStorage.removeItem('refresh_token');
    const state = uuidv4();
    const nonce = uuidv4();
    window.localStorage.setItem('state', state);
    window.localStorage.setItem('nonce', nonce);
    window.location.assign(`${process.env.REACT_APP_OIDC_URI_BASE}/login?state=${state}&nonce=${nonce}`);
}
