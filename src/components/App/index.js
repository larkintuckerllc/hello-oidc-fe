import React, { useCallback, useState } from 'react';
import { getAuthenticated, login } from '../../api/oidc';

export default function App() {
    const authenticated = getAuthenticated();
    const [auth, setAuth] = useState(authenticated);
    const handleClick = useCallback(() => {
        login();
    }, []);

    if (!auth) {
        return <button onClick={handleClick}>Login</button>;
    }
    return (
        <div>Logged in.</div>
    );
}
