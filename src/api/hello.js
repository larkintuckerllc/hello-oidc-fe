export const getHello = async () =>  {
  const response = await fetch(`${process.env.REACT_APP_API_BASE}/`);
  if (!response.ok) {
    throw new Error();
  }
  const { hello } = await response.json();
  return hello;
}
