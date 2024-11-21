import express from 'express';
import * as openidClient from 'openid-client';
import session from 'express-session';
import winston from 'winston';

const app = express();
const PORT = 8080;

// Set up logger using winston
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});


/* OAuth Setup Details */
// Fetch OAuth client details from environment variables for security
const clientID = 'MIE-localhost';
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = 'http://localhost:8080/code';
let serverMetadata;
let config;

/* Session setup for storing temporary data like code verifier, state, nonce */
app.use(
  session({
    secret: 'Alpha001', // Secret key for signing the session ID
    resave: false, 
    saveUninitialized: true, 
  })
);

/**
 * Main function to encapsulate the setup and execution of the app.
 */
async function main() {
  try {
    /* Route: Initiates the authentication process */
    app.get('/login', async (req, res) => {
      try {

          // Discover the OpenID Connect configuration from the provider's well-known endpoint
          const discoveredConfig = await openidClient.discovery( 
          new URL(
            'https://fhirr4sandbox.webch.art/webchart.cgi/.well-known/openid-configuration'
          ),
          clientID,
          clientSecret
        );

        logger.info(`Discovered config: ${JSON.stringify(discoveredConfig.serverMetadata())}`);

        // Override server metadata to account for any custom changes (e.g., proxy adjustments)
        serverMetadata = {
          ...discoveredConfig.serverMetadata(),
          authorization_endpoint: discoveredConfig
            .serverMetadata()
            .authorization_endpoint.replace(
              'https://fhirr4sandbox.webch.art/webchart.cgi/oauth/authorization/',   // Making this change because the authorization path is wrong at /.well-known of webchart. We can delete this after the corrections are made in webchart's /.well-known
              'https://fhirr4sandbox.webch.art/webchart.cgi/oauth/authenticate/'
            ),
        };

        // Create OAuth client configuration
        config = new openidClient.Configuration
        ( serverMetadata, 
          clientID, {
          client_secret: clientSecret,
        });

        // Generate a random state to prevent CSRF attacks
        const state = openidClient.randomState();

        // Store state in the session for later verification
        req.session.state = state;
        req.session.config = config;

        // Parameters for generating the authorization URL
        const parameters = {
          response_type: 'code', // Authorization code grant flow
          redirect_uri: redirectUri, // Callback URL
          state, // State for security verification
          scope: 'launch/patient openid fhirUser offline_access patient/*.read', // Scopes for permissions
          aud: 'https://fhirr4sandbox.webch.art/webchart.cgi', // Audience
        };

        // Generate the authorization URL
        const authUrl = openidClient.buildAuthorizationUrl(config, parameters);

        logger.info(`The Authorization URL generated as: ${authUrl}`);

        // Redirect the user to the generated authorization URL
        res.redirect(authUrl);
      } catch (error) {
        logger.error(`Error initiating login: ${error.message}`);
        res.status(500).send('Error initiating login');
      }
    });

    /* Route: Handles the callback from the OpenID provider */
    app.get('/code', async (req, res) => {
      try {
        logger.info('Callback route accessed with query parameters:', req.query);

        // Verify that the state in the query matches the state stored in the session
        if (req.query.state !== req.session.state) {
          throw new Error('State mismatch');
        }

        logger.info(`Authorization Code received: ${req.query.code}`);

        /* The below code is commented as this is open issue | need to ask Doug, about it. to get access tokens, openid-client has inbuilt method for that but i am getting error so i used normal fetch with the auth code to get the access token 

        const tokens = await openidClient.authorizationCodeGrant(config, currentUrl, {
          expectedState: req.session.state,
          idTokenExpected: true,
          redirectUri: redirectUri,
        }); */

        // Exchange the authorization code for tokens
        const currentUrl = new URL(req.originalUrl, `http://${req.headers.host}`);
        
        const tokenResponse = await fetch(serverMetadata.token_endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'authorization_code',
            code: req.query.code,
            redirect_uri: redirectUri,
            client_id: clientID
          })
        });
        const tokens = await tokenResponse.json();

        // Validate token response
        if (!tokens || !tokens.access_token) {
          throw new Error('Invalid token response - no access token received');
        }
        req.session.id_token = tokens.id_token;
        logger.info('Authorization code grant completed. Tokens received.');
        res.json({
          message: 'Login successful',
          access_token: tokens.access_token,
        });
      } catch (error) {
        logger.error(`Error handling callback: ${error.message}`);
        res.status(500).send("Authentication failed");
      }
    });

    // Start the server and listen for requests
    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Error setting up the POC: ${error.message}`);
  }
}

// Call the main function
main().catch((error) => {
  logger.error(`Error in main execution: ${error.message}`);
});
