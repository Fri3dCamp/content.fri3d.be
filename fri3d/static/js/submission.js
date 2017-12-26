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

  var meta = {
    'status' : 'PROPOSED',
  };

  function reset_form() {
    // clear form fields
    $("form")[0].reset();
    // clear collaborators
    collaborators.clear();
    // TODO check if this is enough?! e.g. toggles? default values?...
    // do a (re)init of the responsive behaviors
    responsive.initialize();
    meta = {
      'status' : 'PROPOSED',
    };
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
      var input = $('#cfp_form [name="'+x.name+'"]')[0];
      var d = null;
      if (!input) {
        console.log("WARNING; no input for "+x.name);
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
    // explicitly add audience levels if they're checked and open_for_all
    // is unchecked, remove them from the blob in any event
    for (var i in audience_types) {
      var n = audience_types[i];
      var k = 'audience_type_' + n;
      var e = 'LEVEL_' + n.toUpperCase();
      if (data.open_for_all == false && k in data && data[k] == true) {
        data.audience_level.push(e);
      }
      // backend don't care
      delete data[k];
    }

    // patch in any meta information we might carry (id, status)
    for (var key in meta) {
      data[key] = meta[key];
    }

    data.form_language = data.form_language ? 'en' : 'nl';

    return data;
  }

  function post(data) {
    console.log("posting", data);
    $.ajax({
      type : 'POST',
      url : fri3d_api_base + '/submissions',
      data : JSON.stringify(data),
      contentType : 'application/json; charset=utf-8',
      dataType : 'json',
      headers : window.auth.get_auth_headers(),
      success : function(ret) {
        console.log("MY ID IS "+ret._id);
        setTimeout(function() {
          // TODO only clear when it was a new submission, don't when update
          if(! get_id() ) {
            notifications.report_success("SAVED_DIALOG_CONTENTS");
            reset_form();
          } else {
            notifications.report_success("UPDATED_DIALOG_CONTENTS");            
          }
        }, 1000);
      },
      failure : function(ret) {
        // TODO notif with dedicated message, don't reset
        alert("Didn't work, please try again later");
      },
    });
  }

  function show(submission) {
    for (var key in submission) {
      // special cases need individual handling
      if (key === 'id' || key === 'status') {
        meta[key] = submission[key];
      } else if (key === 'type') {
        meta[key] = submission[key];
        $('#cfp_form div.category.'+submission[key].toLowerCase()).trigger('click');
      } else if (key === 'audience_level') {
        for (var i in submission[key]) {
          var what = submission[key][i].substring("LEVEL_".length).toLowerCase();
          $('#cfp_form input[name="audience_type_'+what+'"]').prop('checked', true);
        }
      } else if (key === 'form_language') {
          if ( 'en' === submission[key] ) {
              $( '#language' ).prop('checked', true);
          } else {
              $( '#language' ).prop('checked', false);
          }
        //$('#language').bootstrapToggle((submission[key] == 'en') ? 'on' : 'off');
      } else if (key === 'collaborators') {
        submission[key].forEach(function(c) {
          collaborators.add(c.name, c.email);
        });
      } else {
        // base case, unspecified form element
        var input = $('#cfp_form [name="'+key+'"]');
        if (input) {
          if (input[0].type === 'checkbox') {
            // checkboxes need prop(), not val()
            input.prop('checked', submission[key]);
            $(input).trigger("change");
          } else {
            input.val(submission[key]);
          }
        } else {
          console.log("couldn't find input for "+key);
        }
      }
    }
    $("#cfp_form").validator('validate');
  }

  submission.load = function(id) {
    $.ajax({
      type : 'GET',
      url : fri3d_api_base + '/submissions/'+id,
      dataType : 'json',
      success : function(ret) {
        show(ret);
      },
      failure : function(ret) {
        // XXX handle better
        alert("Didn't work, please try again later");
      },
    });
  }

  function get_id() {
    // pathname = '/cfp/submission_id'
    var path = window.location.pathname.split('/')
    var id = null;
    if (path.length > 2) {
      id = path[2];
    }
    return id;
  };

  submission.get_id = get_id;

  submission.set_type = function(type) {
    meta.type = type.toUpperCase();
  };

  submission.submit = function submit() {
    post(collect());
  };

})(window.submission);
