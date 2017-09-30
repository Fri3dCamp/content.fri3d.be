// submission (validation) support
// vim: set expandtab sw=2 ts=2 :

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
