window.comments = {};

(function(comments) {

  // dummy local datastore
  var data = [
    { "who": "fri3d",  "message": "Message 3" },
    { "who": "author", "message": "Message 2" },
    { "who": "fri3d",  "message": "Message 1" }
  ];

  function fetch(handler) {
    var id = get_current_submission_id();
    // TODO fetch comments the (submission) id
    //      implemented asyncly to be closer to future impl ;-)
    setTimeout( function() { handler(data); }, 1000);
  }

  function post(author, comment, handler) {
    var id = get_current_submission_id();
    // TODO post to backend in stead of add to local dummy data
    //      implemented asyncly to be closer to future impl ;-)
    // TODO we shouldn't rely on this author information, we _should_ check
    //      this at the backend side ;-)
    // TODO the backend MUST sanitize the input !!!
    //      so this _bad_ quick 'n dirty demo solution, must be removed
    {
      var tmp = document.createElement("DIV");
      tmp.innerHTML = comment;
      comment = tmp.textContent || tmp.innerText || "";
    }
    data.unshift({ "who": author, "message": comment });
    setTimeout( handler, 1000 );
  }

  function get_current_submission_id() {
    // TODO here, or elsewhere, determine current submission id
    return "dummy";
  }

  function render(comment) {
    var who  = "author",
        icon = "author.png",
        pos  = "left";
    if( comment.who == "fri3d" ) {
      who  = "fri3d";
      icon = "author-fri3d.png";
      pos  = "right";
    }
    $("#comments .archive").append('\
<div class="comment ' + who + '">\
  <div class="author"><img src="/static/images/' + icon + '"></div>\
  <div class="message triangle-border ' + pos + '">\
    <p>' + comment.message + '</p>\
  </div>\
</div>'
    );
  }
  
  var interval = 60000,
      loop     = null;  // interval reference

  // this refresh function is used for normal, cyclic refreshing of the comments
  // you never know if there is some kind of "dialog going on" in real time ;-)
  // but it can be called at any time to trigger an ad-hoc refresh, e.g. after
  // adding/posting a new comment
  function refresh() {
    if(loop) { clearTimeout(loop); } // don't get into multiple refresh loops
    
    fetch(function(comments) {
      $("#comments .archive").empty();      
      $(comments).each(function(index) { render(this); });
      // done
      loop = setTimeout(refresh, interval);
    });
  }

  // start normal refresh loop
  refresh();

  // API call to determine which side can/will create a comment
  comments.enable_new_comment_by = function(who) {
    $("form").removeClass("author fri3d " + who).addClass(who);
    $("#comments").show();
  };

  // API call to add a comment by a given author
  comments.add = function(author, input) {
    post(author, input.value, function() {
      input.value = "";
      refresh();
    });
  }

})(window.comments);

// TODO enabling should be done depending on who's logged on and if we're
//      viewing the submission (not on initial submission)
window.comments.enable_new_comment_by("author");
