// responsive support
// TODO with new classes

function cfp_select_category(button) {
  // "select" correct button
  $("BUTTON.category").removeClass("selected").addClass("unselected");
  $(button).removeClass("unselected").addClass("selected");
  
  // show corresponding form part
  var category = $(button).data("category");
  $("DIV.details").hide();
  $("#form-"+category).show();
}

// activate category buttons

$( document ).ready(function() {
  $("BUTTON.category").click(function() {
    cfp_select_category(this);
  });
});
