window.collaborators = {};

(function(collaborators) {
  
  var members = {};
  
  function render_collaborator(name, email) {
    $("#collaborators").append('\
      <div class="row">\
        <div class="form-group col-xs-5">\
          <span>' + name + '</span>\
        </div>\
        <div class="form-group col-xs-5">\
          <span>' + email + '</span>\
        </div>\
        <div class="form-group col-xs-2">\
          <span role="button" onclick="collaborators.show_remove_dialog(\'' + name + '\'); return false;"><i class="fa fa-fw fa-trash action-icon"></i></span>\
        </div>\
      </div>'
    );
  }
  
  function render_collaborators() {
    $("#collaborators").html("");
    $.each(members, function(name, email) {
      render_collaborator(name, email);
    });
  }

  function add(name, email) {
    members[name] = email;
    render_collaborators();
  }
  
  function remove(name) {
    delete members[name];
    render_collaborators();
  }

  collaborators.show_add_dialog = function show_add_collaborator_dialog() {
    var message = $('<div></div>');
    message.append('<div class="form-group">\
      <label for="collaborator-name">' + i18n.get("NAME") + '</label>\
      <input class="form-control fri3d-input" id="collaborator-name">\
    </div>\
    <div class="form-group">\
      <label for="collaborator-email">' + i18n.get("EMAIL") + '</label>\
      <input type="email" class="form-control fri3d-input" id="collaborator-email">\
    </div>');

    BootstrapDialog.show({
      title: i18n.get( "COLLABORATORS" ),
      message: message,
      buttons: [
        {
          label: i18n.get( "COLLABORATORS_DIALOG_ADD_CANCEL" ),
          action: function(dialog) {
            dialog.close();
          }
        },{
          label: i18n.get( "COLLABORATORS_DIALOG_ADD_CONFIRM" ),
          cssClass: 'btn-primary',
          hotkey: 13,
          action: function(dialog) {
            add($("#collaborator-name").val(), $("#collaborator-email").val());
            dialog.close();
          }
        }
      ],
      onshown: function(dialog){
        $("#collaborator-name").focus();
      },
    });
  };

  collaborators.show_remove_dialog = function show_remove_collaborator_dialog(name) {
    BootstrapDialog.show({
      title: i18n.get( "COLLABORATORS_DIALOG_REMOVE_HEADER" ),
      message: i18n.get( "COLLABORATORS_DIALOG_REMOVE_CONTENTS" )
                   .replace( "{{collab_name}}", name ),
      buttons: [
        {
          label: i18n.get( "COLLABORATORS_DIALOG_REMOVE_CANCEL" ),
          action: function(dialog) {
            dialog.close();
          }
        },{
          label: i18n.get( "COLLABORATORS_DIALOG_REMOVE_CONFIRM" ),
          cssClass: 'btn-primary',
          hotkey: 13,
          action: function(dialog) {
            remove(name);
            dialog.close();
          }
        }
      ]
    });
  };

})(window.collaborators);
