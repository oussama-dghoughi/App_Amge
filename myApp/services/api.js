const BASE_URL = 'http://192.168.1.25:3000';

export const getOffres = async () => {
  const response = await fetch(`${BASE_URL}/offres`);
  return response.json();
};