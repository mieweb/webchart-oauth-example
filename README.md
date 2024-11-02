# webchart-oauth-example

[![Node.js CI](https://github.com/mieweb/webchart-oauth-example/actions/workflows/node.js.yml/badge.svg)](https://github.com/mieweb/webchart-oauth-example/actions/workflows/node.js.yml)


Example OAuth2 token

This starts a webserver on localhost, allows someone to connect, then connects to fhirr4sandbox.webch.art and promoted the Authorization token to a session token.

[![Watch the video](https://img.youtube.com/vi/-YaW9Qa5wvc/0.jpg)](https://youtu.be/-YaW9Qa5wvc)

## Documentation

* https://docs.webchartnow.com/resources/system-specifications/fhir-application-programming-interface-api/oauth-2.0-tutorial/
* https://docs.enterprisehealth.com/resources/system-specifications/fhir-application-programming-interface-api/oauth-2.0-tutorial/


## Sequence Diagram 

```mermaid
sequenceDiagram
    actor U as User
    participant N as Node.js Server
    participant O as OAuth2 Server (.well-known)

    U ->> N: Access Node.js server
    N ->> O: Request OpenID configuration (.well-known/openid-configuration)
    O -->> N: Return configuration (auth & token endpoints)

    N ->> O: Generate login link using authorization endpoint
    O -->> N: Send login link back
    N ->> U: Show login link to user

    U ->> O: User clicks login link (Authorization URL)
    O ->> U: Prompt User for Authentication
    U -->> O: User Authenticates

    O ->> U: Redirect to Node.js Server with Authorization Code
    U ->> N: Send Authorization Code to Node.js Server

    N ->> O: Exchange Authorization Code for Access Token
    O -->> N: Return Access Token

    N ->> U: Respond with Access Token or Success Message

```
