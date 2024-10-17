import api from './api'; 

export const getProviders = async (token: string) => {
  const response = await api.get('/users?role=provider', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getServices = async (token: string) => {
  const response = await api.get('/services', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
