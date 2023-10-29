import axios from 'axios';
import { login } from '../support/utils/login';
import * as process from 'process';

describe('google-calendar', () => {
  beforeAll(() => {
    axios.defaults.validateStatus = () => true;
  });

  it('should return unauthorized for request without bearer token', async () => {
    const res = await axios.get('/api/google-calendar/authorize');
    expect(res.status).toEqual(401);
  });

  describe('authorized user', () => {
    beforeEach(async () => {
      const accessToken = await login('root@localhost.com', 'root123');
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    });

    it('should return auth url', async () => {
      const res = await axios.get('/api/google-calendar/authorize');
      expect(res.data.url).toEqual(
        'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline' +
          '&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&prompt=select_account' +
          `&response_type=code&client_id=${process.env.GOOGLE_API_CLIENT_ID}` +
          `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_API_REDIRECT_URI)}`,
      );
    });
  });
});
