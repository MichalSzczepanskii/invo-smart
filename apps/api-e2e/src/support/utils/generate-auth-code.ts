import Nightmare from 'nightmare';

export async function generateAuthCode() {
  const nightmare = Nightmare({ show: false, pollInterval: 50 });
  return nightmare
    .on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      if (newUrl.startsWith('http://localhost')) {
        nightmare.halt(newUrl);
      }
    })
    .goto(
      'https://accounts.google.com/o/oauth2/v2/auth?' +
        'access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly' +
        '&prompt=select_account&response_type=code' +
        `&client_id=${process.env.GOOGLE_API_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(process.env.GOOGLE_API_REDIRECT_URI)}`,
    )
    .insert('#identifierId', process.env.GOOGLE_API_TEST_ACCOUNT_EMAIL)
    .click('#identifierNext')
    .wait('#password')
    .insert('#password', process.env.GOOGLE_API_TEST_ACCOUNT_PASSWORD)
    .click('#passwordNext')
    .wait('#submit_approve_access:not(:disabled)')
    .click('#submit_approve_access')
    .wait(500)
    .end()
    .catch(e => {
      if (typeof e === 'string' && e.startsWith('http://localhost')) return e;
      console.log(e);
    });
}
