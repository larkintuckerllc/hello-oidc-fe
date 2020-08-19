import { getTokens, logout, refresh } from './oidc';

const getHelloResponse = async () => {
  const { id_token } = getTokens();
  const response = await fetch(`${process.env.REACT_APP_API_BASE}/`, {
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  });
  return response;
};

export const getHello = async () => {
  const response = await getHelloResponse();
  if (!response.ok) {
    if (response.status !== 401) {
      throw new Error();
    }
    try {
      await refresh();
    } catch (err) {
      logout();
      throw new Error();
    }
    const retryResponse = await getHelloResponse();
    if (!retryResponse.ok) {
      throw new Error();
    }
    const { hello } = await retryResponse.json();
    return hello;
  } 
  const { hello } = await response.json();
  return hello;
}
