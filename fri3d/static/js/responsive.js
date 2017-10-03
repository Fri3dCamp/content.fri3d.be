// responsive support: active elements (toggles and buttons) can push classes
//                     to the form
// in CSS we can now write rules to change the display property to create
// responsive disclosure tricks

window.responsive = {};

(function(responsive) {
  
  function initialize() {
    // start from a basic reset, just to be sure
    
    // clear responsive trigger classes
    $("form").removeClass();

    // remove additional class on category buttons
    $("div.category").removeClass("selected");

    // it seems that the sub-toggles on availability aren't reset to checked
    $(".when-not-always-available input:checkbox").each(function(index) {
      $(this).bootstrapToggle('on');
    });

    // setup repsonsive behaviour
    
    // checkboxes/toggles do this on "change"
    $("input:checkbox").each(function(index) {
      if( $(this).attr("data-responsive") ) {
        // if currently checked, we need to perform it now also
        if(this.checked) { $("form").addClass($(this).data("responsive")); }
        // and on change
        $(this).change(function() {
          $("form").removeClass($(this).data("responsive"));
          if(this.checked ) {
            $("form").addClass($(this).data("responsive"));
          }
        });
      }
    });

    // buttons do this on "click"
    $("div.category").click(function() {
      $("form").removeClass("presentation workshop other")
               .addClass($(this).data("category"));
      // select selected button/div
      $("div.category").removeClass("selected");
      $(this).addClass("selected");
      $("#title").focus();
      submission.set_type($(this).data('category'));
    });
  }

  $( document ).ready(initialize);

  // export initialize function for reset purposes
  responsive.initialize = initialize;

  function get() {
      console.dir($('div.category selected'));
  }
  responsive.get = get;


})(window.responsive);
