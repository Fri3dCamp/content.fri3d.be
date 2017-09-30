window.comments = {};

(function(comments) {

  comments.enable_new_comment_by = function(who) {
    $("form").removeClass("author fri3d " + who).addClass(who);
    $("#comments").show();
  };
  
  comments.add = function() {
    // TODO
    // - send new comment to BE
    // - refresh all comments (including thus the new comment)
  }

  function fetch(submission_id) {
    // TODO fetch comments the given submission_id
    return [
      {
        "who"     : "fri3d",
        "message" : "Message 3"
      },
      {
        "who"     : "author",
        "message" : "Message 2"
      },
      {
        "who"     : "fri3d",
        "message" : "Message 1"
      }
    ];
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
    $("#comments").append('\
<div class="comment ' + who + '">\
  <div class="author"><img src="/static/images/' + icon + '"></div>\
  <div class="message triangle-border ' + pos + '">\
    <p>' + comment.message + '</p>\
  </div>\
</div>'
    );
  }

  comments.refresh = function() {
    var id = get_current_submission_id();
    $(fetch(id)).each(function(index) {
      render(this);
    });
  }

})(window.comments);

// TODO enabling should be done depending on who's logged on and if we're
//      viewing the submission (not on initial submission)
window.comments.enable_new_comment_by("author");
window.comments.refresh();
