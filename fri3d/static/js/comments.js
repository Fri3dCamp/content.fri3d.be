window.comments = {};

(function(comments) {

  function fetch(handler) {
    var id = submission.get_id();
    $.ajax({
      type : 'GET',
      // TODO config knob
      url : fri3d_api_base + '/submissions/'+id+'/comments',
      dataType : 'json',
      success : function(ret) {
        if( handler ) { handler(ret); }
      },
      failure : function(ret) {
        notifications.report_failure("FETCH_COMMENTS_FAILURE");
      },
    });
  }

  function post(author, comment, handler) {
    var id = submission.get_id();
    $.ajax({
      type : 'POST',
      // TODO configknob
      url : fri3d_api_base + '/submissions/' + id + '/comments',
      data : JSON.stringify({ 'contents' : { 'message' : comment }, 'origin' : author }),
      headers : window.auth.get_auth_headers(),
      contentType : 'application/json; charset=utf-8',
      dataType : 'json',
      success : function(ret) {
        // call (optional) handler
        if( handler) { setTimeout( handler, 100 ); }
        // call refresh explicitely to refresh comments, including new one, this
        // way we don't need to sanitize client-side, and can rely on the server
        setTimeout( refresh, 1000 );
      },
      failure : function(ret) {
        notifications.report_failure("POST_COMMENT_FAILURE");
      },
    });
  }

  var expanded = {};

  function expand_details(comment) {
    var box         = $(comment.el.find(".sidebar-box")),
        details     = $(comment.el.find(".details")),
        fadeout     = $(comment.el.find(".fadeout")),
        totalHeight = 0;

    // take normal height of message div (first child) + same for last child
    totalHeight = details.outerHeight() + fadeout.outerHeight();

    box.css({
      // Set height to prevent instant jumpdown when max height is removed
      "height": box.height(),
      "max-height": 9999
    })
    .animate({
      "height": totalHeight
    });

    // fade out read-more
    fadeout.fadeOut();

    // mark comment as expanded, by keeping it in a list of expanded comments
    // this is used by refresh to keep expanded comments expanded
    expanded[comment.timestamp] = true;

    // prevent jump-down
    return false;
  }

  function render(comment) {
    var who     = "author",
        icon    = "author.png",
        pos     = "left",
        // TODO i18n ?!
        message = "een boodschap",
        details = comment["details"] == undefined ? false :
                  comment["details"]["_source"]["contents"]["diff"];
    if( comment.origin == "fri3d" ) {
      who  = "fri3d";
      icon = "author-fri3d.png";
      pos  = "right";
      // TODO i18n ?!
      message = "Een boodschap van de orga (op " + comment.timestamp + "):";
      details = comment.contents.message;
    } else if (comment.origin == "author") {
      who  = "author";
      icon = "author.png";
      pos  = "left";
      // TODO i18n ?!
      message = "Uw boodschap (op " + comment.timestamp + "):";
      details = comment.contents.message;
    } else if (comment.origin == "system") {
      // TODO these are system-generated (when someone submits, at the moment
      // we don't store _who_, so using "orga" here might give the wrong idea
      // if $user clicks submit on an updated form
      who = "fri3d";
      icon = "author-fri3d.png";
      pos = "right";
      // TODO i18n ?!
      message = "Verandering aan de inhoud (op " + comment.timestamp + "):";
      details = comment.contents.diff;
    }
    if(details) {
      details = '<div class="sidebar-box">' +
                  '<div class="details">' + details + '</div>' +
                  '<div class="fadeout">' +
                    '<p class="read-more"><a href="javascript:" class="i18n button" data-i18n="MORE">' + i18n.get("MORE") + '</a></p>' +
                  '</div>' +
                '</div>';
    }

    comment.el = $('\
<div class="comment ' + who + '">\
  <div class="author-img"></div>\
  <div class="message ' + pos + '">\
    <p class="commentmeta">' + message + '</p>' +
    details + '\
  </div>\
</div>');
    $("#comments .archive").append(comment.el);

    // is this comment (on refresh) is already expanded, keep it expanded,
    // else provide button to expand
    if( comment.timestamp in expanded ) {
      expand_details(comment);
    } else {
      // activate button and enable i18n
      comment.el.find(".sidebar-box .button").click(function() { expand_details(comment); });
      i18n.learn_element($(".sidebar-box .button")[0]);
    }
  }

  var interval       = 6000,
      loop           = null;  // interval reference
      shown_comments = { "total" : 0 };

  // this refresh function is used for normal, cyclic refreshing of the comments
  // you never know if there is some kind of "dialog going on" in real time ;-)
  // but it can be called at any time to trigger an ad-hoc refresh, e.g. after
  // adding/posting a new comment
  function refresh() {
    if(loop) { clearTimeout(loop); } // don't get into multiple refresh loops

    fetch(function(comments) {
      if( comments.total != shown_comments.total ) {
        $("#comments .archive").empty();
        $(comments['data']).each(function(index) { render(this.data); });
        // done
        loop = setTimeout(refresh, interval);
        shown_comments = comments;
      }
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
