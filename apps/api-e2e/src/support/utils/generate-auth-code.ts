import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Page } from 'puppeteer';

const addPageInterceptors = async (page: Page) => {
  await page.setRequestInterception(true);
  page.on('request', req => {
    switch (req.resourceType()) {
      case 'image':
      case 'stylesheet':
      case 'font':
      case 'media':
        req.abort();
        break;
      default:
        req.continue();
        break;
    }
  });
};

export async function generateAuthCode() {
  const url =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    'access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly' +
    '&prompt=select_account&response_type=code' +
    `&client_id=${process.env.GOOGLE_API_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_API_REDIRECT_URI)}`;

  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--disable-features=site-per-process',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--no-sandbox',
    ],
  });
  const page = await browser.newPage();
  await addPageInterceptors(page);
  const request = page.waitForRequest(req => req.url().startsWith('http://localhost'));

  await page.goto(url);

  await page.type('#identifierId', process.env.GOOGLE_API_TEST_ACCOUNT_EMAIL);
  await page.click('#identifierNext');

  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', process.env.GOOGLE_API_TEST_ACCOUNT_PASSWORD);

  await page.waitForSelector('#passwordNext');
  await page.click('#passwordNext');

  const redirectUrl = (await request).url();

  await browser.close();

  return redirectUrl;
}
