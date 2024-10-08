const http = require('http');
const { URL } = require('url');
const { OAuth2 } = require('oauth');
const readline = require('readline');

// Read client secret from environment variable
const clientID = 'MIE-localhost';
let clientSecret = process.env.CLIENT_SECRET;

if (!clientSecret) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the client secret: ', (input) => {
    clientSecret = input;
    rl.close();
    startServer();
  });
} else {
  startServer();
}

/**
 * Starts the HTTP server and sets up the OAuth2 authentication flow.
 */
function startServer() {
  const oauth2 = new OAuth2(
    clientID,
    clientSecret,
    'https://fhirr4sandbox.webch.art',
    '/webchart.cgi/oauth/authenticate/',
    '/webchart.cgi/oauth/token/',
    null
  );

  /**
   * Adds logging functionality to specified methods of the OAuth2 instance.
   * @param {OAuth2} oauth2Instance - The OAuth2 instance to enhance.
   */
  function addLoggingToOAuth2(oauth2Instance) {
    const methodsToLog = ['getAuthorizeUrl', 'getOAuthAccessToken', '_request'];

    methodsToLog.forEach((method) => {
      const originalMethod = oauth2Instance[method];
      oauth2Instance[method] = function (...args) {
        console.log(`Calling ${method} with arguments:`, args);
        return originalMethod.apply(oauth2Instance, args);
      };
    });
  }

  // Add logging to OAuth2 instance
  addLoggingToOAuth2(oauth2);

  const authURL = oauth2.getAuthorizeUrl({
    response_type: 'code',
    redirect_uri: 'http://localhost:8080/code',
    scope: 'launch/patient openid fhirUser offline_access patient/*.read',
    state: 'some random string to protect against cross-site request forgery attacks',
    aud: 'https://fhirr4sandbox.webch.art/webchart.cgi',
  });

  console.log('authURL: ', authURL);

  http
    .createServer((req, res) => {
      try {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const pathname = urlObj.pathname;
        const params = urlObj.searchParams;

        if (pathname === '/') {
          const body = `<a href="${authURL}">Get Code</a>`;
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(body);
          return;
        }

        if (pathname === '/code') {
          const code = params.get('code');

          if (!code) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Bad Request: Missing code parameter');
            return;
          }

          console.log('Received code:', code);

          oauth2.getOAuthAccessToken(
            code,
            {
              redirect_uri: 'http://localhost:8080/code',
              grant_type: 'authorization_code',
            },
            (e, access_token, refresh_token, results) => {
              if (e) {
                console.error('Error obtaining access token:', e);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
              }

              if (results.error) {
                console.error('OAuth error:', results);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(results));
                return;
              }

              console.log('Obtained access_token:', access_token);
              res.writeHead(200, { 'Content-Type': 'text/plain' });
              res.end(access_token);
            }
          );
          return;
        }

        // Unhandled URL
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    })
    .listen(8080, () => {
      console.log('Server is listening on port 8080');
    });
}
