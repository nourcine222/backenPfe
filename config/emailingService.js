const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs').promises;
const path = require('path');

require('dotenv').config();

const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.OAUTH_REDIRECT_URI || 'urn:ietf:wg:oauth:2.0:oob'
);

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = path.join(__dirname, 'token.json');

async function getNewToken() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting:', authUrl);

  const code = await new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the authorization code: ', (code) => {
      rl.close();
      resolve(code);
    });
  });

  const { tokens } = await oauth2Client.getToken(code);
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
  return tokens;
}

async function authorize() {
  try {
    const token = await fs.readFile(TOKEN_PATH);
    oauth2Client.setCredentials(JSON.parse(token));
    return oauth2Client;
  } catch (err) {
    const tokens = await getNewToken();
    oauth2Client.setCredentials(tokens);
    return oauth2Client;
  }
}

async function sendEmail(to, subject, body) {
  try {
    const auth = await authorize();
    const gmail = google.gmail({ version: 'v1', auth });

    const raw = [
      `From: ${process.env.EMAIL_FROM}`,
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      `Subject: ${subject}`,
      '',
      body,
    ].join('\n');

    const encoded = Buffer.from(raw)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encoded },
    });
    return res.data;
  } catch (error) {
    console.error('Failed to send email:', error.message);
    throw error;
  }
}

module.exports = sendEmail;