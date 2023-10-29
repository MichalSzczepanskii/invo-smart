import axios from 'axios';

export async function login(email: string, password: string) {
  const res = await axios.post('/api/auth/sign-in', { email, password });
  return res.data.accessToken;
}
