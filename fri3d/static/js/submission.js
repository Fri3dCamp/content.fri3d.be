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
