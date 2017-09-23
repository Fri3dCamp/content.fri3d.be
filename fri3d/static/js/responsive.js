// responsive support: active elements (toggles and buttons) can push classes
//                     to the form
// in CSS we can now write rules to change the display property to create
// responsive disclosure tricks

(function() {
  $( document ).ready(function() {

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
    $("button.category").click(function() {
      $("form").removeClass("presentation workshop other")
               .addClass($(this).data("category"));
    });

  });

})();
