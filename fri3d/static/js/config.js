const production = {
  "fri3d_api_base"     : 'https://api.fri3d.be/v1',
  "auth0_domain"       : 'fri3d.eu.auth0.com',
  "auth0_client_id"    : 'wsiU2YbxFdKORIYOtp19TJv12Qs0nElO',
  "auth0_redirect_uri" : 'https://content.fri3d.be/callback',
  "auth0_audience"     : 'https://api.fri3d.be/v1'
};

const staging = {
  "fri3d_api_base"     : 'https://staging.api.fri3d.be/v1',
  "auth0_domain"       : 'fri3d.eu.auth0.com',
  "auth0_client_id"    : 'vgV4jgHiy9UotHWj0HzcURPgM64dEZKO',
  "auth0_redirect_uri" : 'https://staging.content.fri3d.be/callback',
  "auth0_audience"     : 'https://staging.api.fri3d.be/v1'
};

var config = {
  "staging.content.fri3d.be" : staging,
  "localhost"                : staging,
  "content.fri3d.be"         : production
}[window.location.hostname];

console.log(window.location.hostname, config);
