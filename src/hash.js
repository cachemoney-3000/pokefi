// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function(initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

// Store token expiration time in localStorage
if (hash.expires_in) {
  const tokenExpirationTime = Date.now() + (hash.expires_in * 1000);
  localStorage.setItem('spotifyTokenExpiration', tokenExpirationTime);
}

export default hash;
