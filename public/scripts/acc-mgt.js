function update_status(user_id, status_id) {
  $.ajax({
    data: { user_id, status_id },
    type: "POST",
    url: "AccountsManagement/update_status",
    success: () => {
      $("#accounts")
        .DataTable()
        .ajax.reload(null, false);
      messageSucess("Successfully Updated");
    }
  });
}

function toggle() {
  $(document).ready(() => {
    $("#sidebar").sidebar("toggle");
  });
}

$(document).ready(function() {
  var tables = $("#accounts").DataTable({
    processing: true,
    serverSide: true,
    ajax: {
      type: "POST",
      url: "/lists"
    },
    columns: [
      { data: "user_fullname" },
      { data: "user_address" },
      { data: "dateCreated" },
      { data: "status" },
      {
        data: "users_id",
        render: (data, type, row, meta) => {
          var state = row.status;
          if (state == "On Approval") {
            return (data =
              `<div class='ui three buttons'>
                            <a class='ui animated fade green button' onClick='update_status(${data},1)'>
                                <div class='visible content'><i class='check circle icon'></i></div>
                                <div class='hidden content'>Approve</div> 
                            </a>
                            <a class='ui animated fade negative button' onClick='update_status(${data},4)'>
                                <div class='visible content'><i class='times circle outline icon'></i></div>
                                <div class='hidden content'>Reject</div> 
                            </a>
                            <a class="ui animated fade yellow button" onClick='editUser(${row.users_id})'>
                                <div class='visible content'><i class='pencil alternate icon'></i></div>
                                <div class='hidden content'>Edit</div>
                            </a>
                        </div>`);
          }
          if (state == "Active") {
            return (data =
              `<div class='ui three buttons'>
                            <a class='ui animated fade negative button'  onClick='update_status(${data},2)'>
                                <div class='visible content'><i class='times circle outline icon'></i></div>
                                <div class='hidden content'>Deactivate</div> 
                            </a>
                            <a class="ui animated fade yellow button" onClick= 'editUser(${row.users_id})'>
                                <div class='visible content'><i class='pencil alternate icon'></i></div>
                                <div class='hidden content'>Edit</div>
                            </a>
                        </div>`);
          }
          if (state == "Inactive") {
            return (data =
              `<div class='ui three buttons'>
                                <a class='ui animated fade green button' onClick='update_status(${data},1)'>
                                    <div class='visible content'><i class='check circle icon'></i></div>
                                    <div class='hidden content'>Activate</div> 
                                </a>
                                <a class="ui animated fade yellow button" onClick='editUser(${row.users_id})' >
                                    <div class='visible content'><i class='pencil alternate icon'></i></div>
                                    <div class='hidden content'>Edit</div>
                                </a>
                            </div>`);
          }
        }
      }
    ],
    rowCallback: (row, data) => {
      // Bold the grade for all 'A' grade browsers
      if (data.status == "On Approval") {
        $(row)
          .removeClass()
          .addClass("warning");
      }
      if (data.status == "Active") {
        $(row)
          .removeClass()
          .addClass("positive");
      }
      if (data.status == "Inactive") {
        $(row)
          .removeClass()
          .addClass("negative");
      }
    }
  });
  tables.on("xhr", () => {
    var json = tables.ajax.json();
    $("#usersCount").html("");
    $("#usersCount").append(
      ` 
        <div class="ui animated fade yellow button">
            <div class="visible content">On Approval</div>
            <div class="hidden content" id='onacu_count'>
            ` +
        $("#accounts")
          .DataTable()
          .ajax.json()
          .data.filter(x => {
            return x.status == "On Approval";
          }).length +
        ` Users
            </div>
        </div>
        <div class="ui animated fade green button">
            <div class="visible content">Active Users</div>
            <div class="hidden content" id='acu_count'>
            ` +
        $("#accounts")
          .DataTable()
          .ajax.json()
          .data.filter(x => {
            return x.status == "Active";
          }).length +
        ` Users
            </div>
        </div>
        <div class="ui animated fade red button">
            <div class="visible content">Inactive Users</div>
            <div class="hidden content" id='icu_count'>
                ` +
        $("#accounts")
          .DataTable()
          .ajax.json()
          .data.filter(x => {
            return x.status == "Inactive";
          }).length +
        ` Users
            </div>
        </div>`
    );
  });
  //$('#accounts').DataTable();
});
function editUser(row) {
  $(document).ready(function() {
    $.post("/search",{uid : users_id},(response,status,jqXHR)=>{
      console.log(response);
      $('#regform').form('set values',{
        fname:response.user_fname,
        lname:response.user_lname,
        mname:response.user_mname,
        address:response.address,
        uname:response.user_username,
        pword:response.user_password
    });
  });
    $("#registerModal")
      .modal({
        closable: false,
        onApprove: function() {
          setFormValidations(row);
          $("#regform").form("validate form");
          return false;
        },
        onDeny: function() {
          return false;
        }
      })
      .modal("show");
  });
}
function setFormValidations(row) {
  $("#regform").form({
    inline: true,
    on: "blur",
    revalidate: true,
    fields: {
      fname: {
        identifier: "fname",
        rules: [
          {
            type: "empty"
          }
        ]
      },
      lname: {
        identifier: "lname",
        rules: [
          {
            type: "empty"
          }
        ]
      },
      address: {
        identifier: "address",
        rules: [
          {
            type: "empty"
          }
        ]
      },
      bdate: {
        identifier: "bdate",
        rules: [
          {
            type: "empty"
          }
        ]
      },
      uname: {
        identifier: "uname",
        rules: [
          {
            type: "empty"
          }
        ]
      },
      pword: {
        identifier: "pword",
        rules: [
          {
            type: "empty"
          },
          {
            type: "minLength[6]"
          }
        ]
      }
    },
    onSuccess: function() {
      submitForm(row);
    }
  });
}
function submitForm(row) {
  $.ajax({
    type: "post",
    data: $('#regform').serialize() + '&uinfo_id=' + row.userinfo_id + '&user_id='+row.users_id,
    url: "../update",
    success: function(response) {
      if (response == "error") {
        messageFailure("Username or Name is already existing!");
      } else {
        messageSucess("Success");
        $("#accounts").DataTable().ajax.reload(null, false);
        $("#registerModal").modal("hide");
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      messageFailure(textStatus);
    }
  });
}
$(document).ready(()=>{
    $('#bt-accset')
    .dropdown({
        useLabels: false
    });
});
