import { getTokens } from './oidc';

// TODO: REFRESH
export const getHello = async () =>  {
  const { id_token } = getTokens();
  const response = await fetch(`${process.env.REACT_APP_API_BASE}/`, {
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  });
  if (!response.ok) {
    throw new Error();
  }
  const { hello } = await response.json();
  return hello;
}
