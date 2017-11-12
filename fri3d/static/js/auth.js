window.auth = {};

(function(auth) {

  function have_authenticated_user() {
    var expires_at = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expires_at;
  }

  auth.get_auth_headers = function() {
    o = {};
    if (have_authenticated_user()) {
      o['Authorization'] = 'Bearer '+localStorage.getItem('access_token');
      o['Access-Control-Allow-Origin'] = '*';
    }
    return o;
  }

  $(document).ready(function() {
    // auth stuff
    var webAuth = new auth0.WebAuth({
      domain : auth0_domain,
      clientID : auth0_client_id,
      redirectUri : auth0_redirect_uri,
      audience : auth0_audience,
      responseType : 'token id_token',
      scope : 'openid roles',
    });
    function handleAuthentication() {
      webAuth.parseHash(function(e, ret) {
        if (ret && ret.accessToken && ret.idToken) {
          window.location.hash = '';
          at = ret.accessToken;
          localStorage.setItem('access_token', ret.accessToken);
          localStorage.setItem('id_token', ret.idToken);
          localStorage.setItem('expires_at', JSON.stringify(ret.expiresIn * 1000 + new Date().getTime()));
          /*
          webAuth.client.userInfo(ret.accessToken, function(e, ret) {
            // do something with details about user here
            console.log("userInfo ret=",ret);
            console.log("userInfo e=",e);
          });
          */
        }
      });
    };
    // pull in auth data if present
    handleAuthentication();

    $('#btn-login').click(function(e) {
        e.preventDefault();
        webAuth.authorize();
    });
    $('#btn-logout').click(function(e) {
        [ 'access_token', 'id_token', 'expires_at' ].forEach(function(x) { localStorage.removeItem(x); });
        update_login_buttons();
    });
    function update_login_buttons() {
        if (have_authenticated_user()) {
            console.log("authed, cool");
            $('#btn-login').css('display', 'none');
            $('#btn-logout').css('display', 'inline');
        } else {
            console.log("not authed yet.");
            $('#btn-login').css('display', 'inline');
            $('#btn-logout').css('display', 'none');
        }
    }
    update_login_buttons();

    // load up the page
    var submission_id = window.submission.get_id();
    if (submission_id) {
        window.submission.load(submission_id);
        window.comments.enable_new_comment_by(
          have_authenticated_user() ? "fri3d" : "author"
        );
    }

  });


})(window.auth);
