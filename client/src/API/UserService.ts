import axios from 'axios';

export const getUserById = async (id: number) => {
  const response = await axios.get(`http://localhost:3000/api/users/${id}`);
  return response.data;
};
