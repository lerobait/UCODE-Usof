import axios from 'axios';

export const getAllPosts = async () => {
  const response = await axios.get('http://localhost:3000/api/posts/');
  return response.data.data.posts;
};
