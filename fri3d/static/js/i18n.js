// some basic i18n support
// the language is stored in a hash part "l:en"
// default is l:nl
// toggling shows/hides DIVs marked with class="i18n en" or class="i18n nl"

function i18n_remove_hash() {
  var parts = window.location ? window.location.hash.substr(1).split(",") : [];
  var idx = parts.indexOf("l:en");
  if(idx > -1) { parts.splice(idx, 1); }
  idx = parts.indexOf("l:nl");
  if(idx > -1) { parts.splice(idx, 1); }
  window.location.hash = parts.join();
}

function i18n_add_hash(part) {
  var parts = window.location.hash ? window.location.hash.substr(1).split(",") : [];
  parts.push(part);
  window.location.hash = parts.join();  
}

function i18n_show_nl() {
  $(".i18n.nl").show();
  $(".i18n.en").hide();
  i18n_remove_hash();
}

function i18n_show_en() {
  $(".i18n.nl").hide();
  $(".i18n.en").show();
  i18n_remove_hash();
  i18n_add_hash("l:en");
}

function i18n_toggle(toggle) {
  if(toggle.checked) {
    i18n_show_nl();
  } else {
    i18n_show_en();
  }
}

$( document ).ready(function() {

  // check for anchor and 
  // - set correct initial i18n
  // - notify that the toggle can be used to change the language
  // - setup the toggle button
  if(window.location.hash.indexOf("l:en") > -1) {
    i18n_show_en();
    setTimeout(function() {
      $.notify( $(".i18n.toggle"), "Liever Nederlands?", {
        className    : "info",
        position     : "bottom center",
        autoHideDelay: 3000
      });
    }, 1000);
    $('.i18n.toggle INPUT').prop("checked", false);
  } else {
    i18n_show_nl();
    setTimeout(function() {
      $.notify( $(".i18n.toggle"), "Prefer English?", {
        className    : "info",
        position     : "bottom center",
        autoHideDelay: 3000
      });
    }, 1000);
    $('.i18n.toggle INPUT').prop("checked", true);
  }

  $('.i18n.toggle INPUT').bootstrapToggle({
    on:  "NL",
    off: "EN"
  });
  $('.i18n.toggle INPUT').change(function(){ i18n_toggle(this); });

});
