import axios from 'axios';
import { login } from '../support/utils/login';
import prisma from './prisma/prisma-client';
import { ServiceEnum } from '@invo-smart/shared/data-access';
import { parseJwt } from '../support/utils/parse-jwt';
import { generateAuthCode } from '../support/utils/generate-auth-code';

describe('google-calendar', () => {
  beforeAll(() => {
    axios.defaults.validateStatus = () => true;
  });

  it('should return unauthorized for request without bearer token', async () => {
    const res = await axios.get('/api/google-calendar/authorize');
    expect(res.status).toEqual(401);
  });

  describe('authorized user', () => {
    let accessToken: string;

    beforeEach(async () => {
      accessToken = await login('root@localhost.com', 'root123');
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    });

    it('should redirect to auth url', async () => {
      const res = await axios.get('/api/google-calendar/authorize', {
        maxRedirects: 0,
      });
      expect(res.status).toEqual(302);
      console.log(res.headers.location);
      expect(res.headers.location).toEqual(
        'https://accounts.google.com/o/oauth2/v2/auth?' +
          'access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly' +
          '&prompt=select_account&response_type=code' +
          `&client_id=${process.env.GOOGLE_API_CLIENT_ID}` +
          `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_API_REDIRECT_URI)}`,
      );
    });

    it('should save refresh_token', async () => {
      const result = await generateAuthCode();
      const authCode = new URL(result).searchParams.get('code');
      const res = await axios.post('/api/google-calendar/save-token', {
        code: authCode,
      });
      const token = await prisma.oAuth2Token.findUnique({
        where: {
          userId: parseJwt(accessToken).id,
          serviceId: ServiceEnum.GOOGLE_CALENDAR,
        },
      });
      expect(res.data.id).toEqual(token.id);
      expect(res.status).toEqual(201);
    }, 30000);
  });
});
