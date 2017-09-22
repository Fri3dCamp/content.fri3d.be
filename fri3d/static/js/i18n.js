// some basic i18n support
// external usage needs to provide (using the "learn()" method):
// - "2 language codes", e.g. [ "nl", "en" ] 
// - a translations dict
// the language is stored in a hash part "l:<lang code>"
// all elements marked with class="i18n" and having a "data-i18n" key will be
// tranlated

window.i18n = {};

(function(i18n) {

  var DEFAULT    = 0,
      TRANSLATED = 1;

  var languages    = [];
  var translations = [];

  function i18n_translate(key, translated) {
    if( key in translations ) {
      return translations[key][ translated ? TRANSLATED : DEFAULT ];
    } else {
      return "UNKNOWN: " + key;
    }
  }

  // detect all elements with class "i18n" and register them for translation
  // based on their data-i18n key

  var elements = $([]);

  function i18n_show(translated) {
    console.log("showing " + languages[ translated ? TRANSLATED : DEFAULT ]);
    elements.each(function(index) {
      $(this).html(
        i18n_translate( $(this).attr("data-i18n"), translated )
      );
    });
  }

  // setup language based on hash

  function i18n_remove_lang_hash() {
    var parts = window.location ? window.location.hash.substr(1).split(",") : [];
    var idx = parts.indexOf("l:" + languages[TRANSLATED]);
    if(idx > -1) { parts.splice(idx, 1); }
    idx = parts.indexOf("l:" + languages[DEFAULT]);
    if(idx > -1) { parts.splice(idx, 1); }
    window.location.hash = parts.join();
  }

  function i18n_add_lang_hash(lang) {
    var parts = window.location.hash ? window.location.hash.substr(1).split(",") : [];
    parts.push( "l:" + lang );
    window.location.hash = parts.join();  
  }

  function i18n_apply_translation(translated) {
    i18n_show(translated);
    if( translated ) {
      i18n_add_lang_hash(languages[TRANSLATED]);
    } else {
      i18n_remove_lang_hash();
    }
  }

  // exposed setter for languages and translations

  i18n.learn = function i18n_learn(langs, trans) {
    // detect all elements that might need translation
    $(".i18n").each(function(index) {
      if( $(this).attr("data-i18n") ) {
        elements.push(this);
      }
    });

    // setup languages + init toggle button
    languages = langs;
    $('.i18n.toggle INPUT').bootstrapToggle({
      off: languages[0].toUpperCase(),
      on:  languages[1].toUpperCase()
    });

    // setup translations + show current lang (e.g. from hash)
    translations = trans;

    // check for language hash
    var translated = window.location.hash.indexOf("l:" + languages[1]) > -1;
    // add additional notification to catch attention for other language
    setTimeout(function() {
      $.notify( $(".i18n.toggle"), i18n_translate("LANGUAGE_PROMPT", ! translated), {
        className    : "info",
        position     : "bottom center",
        autoHideDelay: 3000
      });
    }, 1000);
    $('.i18n.toggle INPUT').bootstrapToggle(translated ? "on" : "off");
    
    i18n_show(translated);

    // trigger translation on toggle
    $('.i18n.toggle INPUT').change( function(){
      i18n_apply_translation( this.checked );
    });
  }


})(window.i18n);
