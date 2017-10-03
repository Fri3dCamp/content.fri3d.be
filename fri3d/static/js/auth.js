window.auth = {};

(function(auth) {

  function have_authenticated_user() {
    // TODO implement actual auth0 check for authenticated user
    //      currently checks for a:fri3d in location hash
    var parts = window.location ? window.location.hash.substr(1).split(",") : [];
    var idx = parts.indexOf("a:fri3d");
    return idx > -1;
  }

  function show_comments() {
    // TODO replace with actual check for viewing in stead of submitting
    //      currently checks for availability of s:123 in location hash
    return submission.get_id();
  }
  
  $(document).ready(function() {
    var submission_id = window.submission.get_id();
    if (submission_id) {
        window.submission.load(submission_id);
    }
    if( show_comments() ) {
      window.comments.enable_new_comment_by(
        have_authenticated_user() ? "fri3d" : "author"
      );
    }
  });
  
})(window.auth);
