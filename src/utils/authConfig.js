// authConfig.js
const { ConfidentialClientApplication } = require('@azure/msal-node');

const msalConfig = {
    auth: {
        clientId: '177b3dca-d0f7-4ac0-883a-7a389357a93d',
        authority: 'https://login.microsoftonline.com/4a22f116-51ce-4fe3-aeaa-9c46143d088b',
        clientSecret: 'R8N8Q~cuDCI7VJvkQpwZrLYo1UQ22-YtHfCiZa9n',
    }
};

const cca = new ConfidentialClientApplication(msalConfig);

async function getAccessToken() {
    const clientCredentialRequest = {
        scopes: ['https://graph.microsoft.com/.default'],
    };

    const response = await cca.acquireTokenByClientCredential(clientCredentialRequest);
    return response.accessToken;
}

module.exports = getAccessToken;
