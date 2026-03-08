async function exchangeCodeForToken(code) {
    const codeVerifier = localStorage.getItem('code_verifier');

    const params = new URLSearchParams();
    params.append("client_id", process.env.REACT_APP_CLIENT_ID);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", process.env.REACT_APP_REDIRECT_URI);
    params.append("code_verifier", codeVerifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const data = await result.json();
    if (!data.access_token) {
        throw new Error(data.error_description || data.error || 'Token exchange failed');
    }
    return { access_token: data.access_token, refresh_token: data.refresh_token, expires_in: data.expires_in };
}

export { exchangeCodeForToken };
