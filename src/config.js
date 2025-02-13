export const authEndpoint = process.env.REACT_APP_AUTH_ENDPOINT;
export const clientId = process.env.REACT_APP_CLIENT_ID;
export const redirectUri = process.env.REACT_APP_REDIRECT_URI;
export const scopes = process.env.REACT_APP_SCOPES.split(',');

// Remove clientSecret as it shouldn't be exposed in frontend
// export const clientSecret = process.env.REACT_APP_CLIENT_SECRET;