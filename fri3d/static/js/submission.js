// submission (validation) support
// vim: set expandtab sw=2 ts=2 :

$(document).ready(function() {
  $('#cfp_form').validator(custom={
    custom: {
      'max-chars': function($el) {
        var max = $el.data('max-chars');
        if ($el.val().length > max) {
          return "Te lang!";
        }
      }
    },
    errors: {
      'max-chars': "Te lang!",
    }
  });


  // vert pixel offset of highlighted bad inputs,
  // skip past our static header
  $.fn.validator.Constructor.FOCUS_OFFSET = 100;

  $('#cfp_form').validator().on('submit', function(e) {
    if (e.isDefaultPrevented()) {
      // validation found & highlighted an error
      return false;
    }
    e.preventDefault();
    window.submission.submit();
  });
  // show/hide error message close to submit button

  $("#cfp_form").validator().on("validated.bs.validator", function(e) {
    if( $(this).data('bs.validator').hasErrors() ) {
      $("#errors").show();
    } else {
      $("#errors").hide();
    }
  });
});

// validate length of all textarea

$( document ).ready(function() {
  $("textarea").each(function(index) {
    if( $(this).attr("data-max-chars") ) {
      // generate label for "remaining" char count
      var label = $( "<div />", { "class": "pull-right remaining" } );
      $(this).after(label);
      var max = parseInt($(this).data("max-chars"));
      $(label).html(max + "/" + max);
      $(this).keyup(function() {
        var remaining = max - $(this).val().length;
        $(label).html(remaining + "/" + max);
        label.removeClass("invalid");
        if(remaining < 0) { label.addClass("invalid"); }
      });
    }
  });
});

// a stubbed submission module ...

window.submission = {};

(function(submission) {
  
  function reset_form() {
    // clear form fields
    $("form")[0].reset();
    // TODO check if this is enough?! e.g. toggles? default values?...
    // do a (re)init of the responsive behaviors
    responsive.initialize();
  }

  function collect() {
    // TODO maybe do this manually, rewriting?, add interpretation?
    //      or do that at BE?
    var data = {};
    $("#cfp_form").serializeArray().map(function(x){data[x.name] = x.value;});
    return data;
  }

  function post(data) {
    // TODO implement actual network posting
    console.log("posting", data);
    // TODO async behavior to match future actual post
    setTimeout(function() {
      // TODO notify of sucess _and_ failure ;-)
      notifications.report_success("SAVED_DIALOG_CONTENTS");
      // TODO only clear on success
      reset_form();
    }, 1000);
  }

  submission.submit = function submit() {
    post(collect());
  }

})(window.submission);
