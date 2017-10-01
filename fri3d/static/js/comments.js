window.comments = {};

(function(comments) {

  // TODO remove dummy datastore implementation
  // dummy local datastore
  var data = [
    {
      "who" : "author",
      "message" : "Dit is mijn initieel voorstel. (Alle wijzigingen, deze inclusief worden mee in de historiek in de commentaren opgenomen.)",
      "details" : {
        "_id": "ec11007f-9f90-4976-9aff-b75dd7cbedf5",
        "_index": "fri3d-cmp",
        "_score": 1.0,
        "_source": {
           "contents": {
              "cur": {
                 "activity_duration": 60,
                 "activity_participant_limit": 25,
                 "affiliated": false,
                 "always_available": true,
                 "audience_level": [],
                 "costs": 0,
                 "day_1_available": true,
                 "day_1_from": 9,
                 "day_1_until": 21,
                 "day_2_available": true,
                 "day_2_from": 9,
                 "day_2_until": 21,
                 "day_3_available": true,
                 "day_3_from": 9,
                 "day_3_until": 21,
                 "form_language": "nl",
                 "format": false,
                 "id": "5de07a12-ca83-4253-b35f-ce998c01050e",
                 "multiple_sessions": false,
                 "open_for_all": true,
                 "open_for_repetitions": true,
                 "session_count": 2,
                 "speaker_bio": "",
                 "speaker_email": "jef.vdb@gmail.com",
                 "speaker_name": "Deploytest Mail #1",
                 "status": "PROPOSED",
                 "summary": "Deploytest Mail #1",
                 "title": "Deploytest Mail #1",
                 "type": "PRESENTATION",
                 "visit_duration": 15
              },
              "diff": "<ul><h4>Toevoegingen:</h4>\n  <li><b>Huidige status</b>: <i>Ingediend</i></li>\n  <li><b>Type</b>: <i>Presentatie</i></li>\n  <li><b>Titel</b>: <i>Deploytest Mail #1</i></li>\n  <li><b>Beschrijving</b>: <i>Deploytest Mail #1</i></li>\n  <li><b>Naam</b>: <i>Deploytest Mail #1</i></li>\n  <li><b>Email</b>: <i>jef.vdb@gmail.com</i></li>\n  <li><b>Taal</b>: <i>nl</i></li>\n  <li><b>id</b>: <i>5de07a12-ca83-4253-b35f-ce998c01050e</i></li>\n</ul><!-- Toevoegingen:-->\n",
              "prev": {}
           },
           "origin": "system",
           "submission_id": "5de07a12-ca83-4253-b35f-ce998c01050e",
           "timestamp": "2017-09-20T20:44:59.120Z"
         },
         "_type": "comments"
       }
    }
  ];

  function fetch(handler) {
    var id = submission.get_id();
    // TODO fetch comments the (submission) id
    //      implemented asyncly to be closer to future impl ;-)
    setTimeout( function() { handler(data); }, 1000);
  }

  function post(author, comment, handler) {
    var id = submission.get_id();
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

  function expand_details() {
    var $el, $ps, $up, totalHeight;

    totalHeight = 0;

    $el = $(this);
    $p  = $el.parent();
    $f  = $p.parent();
    $up = $f.parent();
    $ps = $up.find(":not('.fadeout')");
    
    // take normal height of message div (first child) + same for last child
    totalHeight = $($ps).first().outerHeight() + $($ps).last().outerHeight();

    $up.css({
      // Set height to prevent instant jumpdown when max height is removed
      "height": $up.height(),
      "max-height": 9999
    })
    .animate({
      "height": totalHeight
    });

    // fade out read-more
    $f.fadeOut();

    // prevent jump-down
    return false;
  }

  function render(comment) {
    var who     = "author",
        icon    = "author.png",
        pos     = "left",
        message = comment.message.split("\n").join("<br>\n"),
        details = comment["details"] == undefined ? false : 
                  comment["details"]["_source"]["contents"]["diff"];
    if( comment.who == "fri3d" ) {
      who  = "fri3d";
      icon = "author-fri3d.png";
      pos  = "right";
    }
    if(details) {
      details = '<div class="sidebar-box">' +
                  '<div>' + details + '</div>' +
                  '<div class="fadeout">' +
                    '<p class="read-more"><a href="javascript:" class="button">' + i18n.get("MORE") + '</a></p>' +
                  '</div>' +
                '</div>';
    }

    $("#comments .archive").append('\
<div class="comment ' + who + '">\
  <div class="author"><img src="/static/images/' + icon + '"></div>\
  <div class="message triangle-border ' + pos + '">\
    <p>' + message + '</p>' + details + '\
  </div>\
</div>'
    );
    $(".sidebar-box .button").click(expand_details);
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
