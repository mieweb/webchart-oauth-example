var http = require('http');
var qs = require('querystring');
var OAuth2 = require('oauth').OAuth2;
var readline = require('readline');

// Read client secret from environment variable
var clientID = 'MIE-localhost';
var clientSecret = process.env.CLIENT_SECRET;

if (!clientSecret) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter the client secret: ', (input) => {
        clientSecret = input;
        rl.close();
        startServer();
    });
} else {
    startServer();
}

function startServer() {
    var oauth2 = new OAuth2(
        clientID,
        clientSecret,
        'https://fhirr4sandbox.webch.art',
        '/webchart.cgi/oauth/authenticate/',
        '/webchart.cgi/oauth/token/',
        null
    );

    // Wrapper function to add logging
    function addLoggingToOAuth2(oauth2Instance) {
        const methodsToLog = ['getAuthorizeUrl', 'getOAuthAccessToken', '_request'];

        methodsToLog.forEach(method => {
            const originalMethod = oauth2Instance[method];
            oauth2Instance[method] = function(...args) {
                console.log(`Calling ${method} with arguments:`, args);
                return originalMethod.apply(oauth2Instance, args);
            };
        });
    }

    // Add logging to OAuth2 instance
    addLoggingToOAuth2(oauth2);

    http.createServer(function (req, res) {
        var p = req.url.split('/');
        var pLen = p.length;
        
        var authURL = oauth2.getAuthorizeUrl({
            response_type: 'code', // Explicitly specify the response type
            redirect_uri: 'http://localhost:8080/code',
            scope: 'launch/patient openid fhirUser offline_access patient/*.read',
            state: 'some random string to protect against cross-site request forgery attacks',
            aud: 'https://fhirr4sandbox.webch.art/webchart.cgi' // Add the correct audience
        });

        console.log('authURL: ', authURL);

        var body = '<a href="' + authURL + '"> Get Code </a>';
        if (pLen === 2 && p[1] === '') {
            res.writeHead(200, {
                'Content-Length': body.length,
                'Content-Type': 'text/html' });
            res.end(body);
        } else if (pLen === 2 && p[1].indexOf('code') === 0) {
            var qsObj = qs.parse(p[1].split('?')[1]); 

            console.log('qsObj: ', qsObj);

            oauth2.getOAuthAccessToken(
                qsObj.code,
                {
                    'redirect_uri': 'http://localhost:8080/code',
                    'grant_type': 'authorization_code' // Set the grant_type
                },
                function (e, access_token, refresh_token, results){
                    if (e) {
                        console.log(e);
                        res.end(e);
                    } else if (results.error) {
                        console.log(results);
                        res.end(JSON.stringify(results));
                    }
                    else {
                        console.log('Obtained access_token: ', access_token);
                        res.end(access_token);
                    }
            });

        } else {
            // Unhandled url
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not Found');
        }

    }).listen(8080, () => {
        console.log('Server is listening on port 8080');
    });
}