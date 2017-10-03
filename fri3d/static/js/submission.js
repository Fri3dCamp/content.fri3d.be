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
    var data = {};
    var form = $('#cfp_form').serializeArray();

    // serializeArray() forgets unchecked checkboxes, add them here
    $.each($('#cfp_form input[type="checkbox"]')
      .filter(function(i) { return $(this).prop('checked') === false; }),
      function(i, el) {
        if (!$(el).attr('name')) {
          console.log("WARNING; there's a form input without a name");
          return;
        }
        form.push({ 'name' : $(el).attr('name'), 'value' : 'off'});
      }
    );

    // we require per-datatype handling
    form.forEach(function(x) {
      var input = $('#cfp_form input[name="'+x.name+'"]')[0]
        || $('#cfp_form textarea[name="'+x.name+'"]')[0];
      var d = undefined;
      if (!input) {
        console.log("weirdness; no input for "+x.name);
        return;
      }
      if (input.type === 'number') {
        d = parseInt(x.value);
      } else if (input.type === 'checkbox') {
        d = (x.value === 'on') ? true : false;
      } else {
        d = x.value;
      }
      data[x.name] = d;
    });

    // collabs and audience level needs special handling
    data.collaborators = window.collaborators.pack_for_shipping();
    data.audience_level = [];
    var audience_types = [ 'adult', 'beginner', 'child', 'expert',
      'family', 'intermediate' ];
    // only populate data.audience_level if open_for_all is false
    if (!('open_for_all' in data && data.open_for_all == true)) {
      for (var i in audience_types) {
        var n = audience_types[i];
        var k = 'audience_type_' + n;
        var e = 'LEVEL_' + n.toUpperCase();
        if (k in data && data[k] == true) {
          data.audience_level.push(e);
        }
      }
    }

    return data;
  }

  function post(data) {
    console.log("posting", data);
    $.ajax({
      type : 'POST',
      url : 'https://staging.api.fri3d.be/v1/submissions',
      data : JSON.stringify(data),
      contentType : 'application/json; charset=utf-8',
      dataType : 'json',
      success : function(ret) {
        // TODO async behavior to match future actual post
        setTimeout(function() {
          // TODO notify of sucess _and_ failure ;-)
          notifications.report_success("SAVED_DIALOG_CONTENTS");
          // TODO only clear on success
          reset_form();
        }, 1000);
      },
      failure : function(ret) {
        // TODO notif with dedicated message, don't reset
        alert("Didn't work, please try again later");
      },
    });
  }

  submission.get_id = function get_id() {
    // TODO replace with actual submission id extraction from e.g. URL
    var parts = window.location ? window.location.hash.substr(1).split(",") : [];
    var id = null;
    $(parts).each(function(index) {
      var parts = this.split(":");
      if(parts[0] == "s") {
        id = parts[1];
      }
    });
    return id;
  };

  submission.submit = function submit() {
    post(collect());
  };

})(window.submission);
