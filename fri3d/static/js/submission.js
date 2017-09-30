// submission (validation) support
// vim: set expandtab sw=2 ts=2 :

$(document).ready(function() {
  $('#cfp_form').validator(custom={
    custom: {
      'max-chars': function($el) {
        var max = $el.data('max-chars');
        console.log($el + " " + max + " " + $el.val().length);
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

  submission.submit = function submit() {
    // backend things
  }

  submission.validate = function validate() {
    // TODO
  }

  submission.reset = function reset() {
    // TODO
  }

})(window.submission);
