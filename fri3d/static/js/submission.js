// submission (validation) support

window.submission = {};

(function(submission) {

  submission.submit = function submit() {
    var form = $('#form_cfp')[0];
    if (!form.checkValidity()) {
      form.reportValidity();
    }
    // backend things
  }

  submission.validate = function validate() {
    // TODO
  }

  submission.reset = function reset() {
    // TODO
  }

})(window.submission);
