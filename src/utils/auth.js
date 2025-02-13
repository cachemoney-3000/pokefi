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

    const { access_token, refresh_token, expires_in } = await result.json();
    return { access_token, refresh_token, expires_in };
}

export { exchangeCodeForToken }; 