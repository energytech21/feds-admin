

$('.ui.dropdown')
  .dropdown()
  ;


var recieve_data = false;
var sumx;
var sumy;
var sumz;
var count;
$(document).ready(() => {
  $.ajax({
    type: "get",
    url: '../utils/config_evac_message',
    success: function (response) {
      $('#evacNotice').val(response[0].message);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      messageFailure(textStatus);
    }
  });


  loadConfig();

});

function loadConfig() {
  $.get('../config_alarm/config', (response) => {
    var smoke_data = response.filter((x) => { return x.sensor_type == "smoke" });
    var temp_data = response.filter((x) => { return x.sensor_type == "temp" });
    var earth_data = response.filter((x) => { return x.sensor_type == "earth" });
    var forms = $("form");
    $.each(forms, (key, value) => {
      var form_id = $(value).attr('id');

      console.log(form_id);
      if (form_id == "smokeThres") {
        var inputs = $("#" + form_id + " input");
        $.each(inputs, (key, value) => {
          var id = $(value).attr('id');

          if (id == "lvl1") $(value).val(smoke_data[0].level1_threshold);
          if (id == "lvl2") $(value).val(smoke_data[0].level2_threshold);
          if (id == "lvl3") $(value).val(smoke_data[0].level3_threshold);
        });
      }

      if (form_id == "tempThres") {
        var inputs = $("#" + form_id + " input");
        $.each(inputs, (key, value) => {
          var id = $(value).attr('id');

          if (id == "lvl1") $(value).val(temp_data[0].level1_threshold);
          if (id == "lvl2") $(value).val(temp_data[0].level2_threshold);
          if (id == "lvl3") $(value).val(temp_data[0].level3_threshold);
        });
      }

      if (form_id == "earthThres") {
        $(value).form('set values',{
          lvl1 : earth_data[0].level1_threshold,
          lvl2: earth_data[0].level2_threshold,
          lvl3: earth_data[0].level3_threshold
        })
      }
    });
  });
}
function saveThreshold(type) {

  if (type === "smoke") {
    var data = {
      type: type,
      lvl1: $('#smokeThres #lvl1').val(),
      lvl2: $('#smokeThres #lvl2').val(),
      lvl3: $('#smokeThres #lvl3').val()
    }
    $.post('./config_alarm/update_config', data, (response) => {
      if (response == "success") {
        messageSucess("Successfully Saved");
      }
      else {
        messageFailure(response);
      }
    })
  }

  if (type === "temp") {
    var data = {
      type: type,
      lvl1: $('#tempThres #lvl1').val(),
      lvl2: $('#tempThres #lvl2').val(),
      lvl3: $('#tempThres #lvl3').val()
    }
    $.post('./config_alarm/update_config', data, (response) => {
      if (response == "success") {
        messageSucess("Successfully Saved");
      }
      else {
        messageFailure(response);
      }
    })
  }

  if (type === "earth") {
    validateFields();
  }

  
}

function saveEvacNotice() {
  $.ajax({
    type: "post",
    data: $('#noticeForm').serialize(),
    url: '../utils/config_evac_message',
    success: function (response) {
      messageSucess('Evacuation Message Saved');
    },
    error: function (jqXHR, textStatus, errorThrown) {
      messageFailure(textStatus);
    }
  });
}


function validateFields() {

  $.fn.form.settings.rules.greaterThan = function (inputValue, validationValue) {
    return parseInt(inputValue) > parseInt(validationValue);
  }
  $.fn.form.settings.rules.lessThan = function (inputValue, validationValue) {
    return parseInt(inputValue) < parseInt(validationValue);
  }
  $('#earthThres').form({
    inline: true,
    on: 'blur',
    revalidate: true,
    fields: {
      lvl1: {
        identifier: 'lvl1',
        rules: [
          {
            type: `lessThan[${($('#earthThres').form('get value', 'lvl2') == "" ? 0 : $('#earthThres').form('get value', 'lvl2'))}]`,
            prompt: "Value must be less than Level 2"
          },
          {
            type: `lessThan[${($('#earthThres').form('get value', 'lvl3') == "" ? 0 : $('#earthThres').form('get value', 'lvl3'))}]`,
            prompt: "Value must be less than Level 3"
          }
        ]
      },
      lvl2: {
        identifier: 'lvl2',
        rules: [
          {
            type: `greaterThan[${($('#earthThres').form('get value', 'lvl1') == "" ? 0 : $('#earthThres').form('get value', 'lvl1'))}]`,
            prompt: "Value must be greater than Level 1"
          },
          {
            type: `lessThan[${($('#earthThres').form('get value', 'lvl3') == "" ? 0 : $('#earthThres').form('get value', 'lvl3'))}]`,
            prompt: "Value must be less than Level 3"
          }
        ]
      },
      lvl3: {
        identifier: 'lvl3',
        rules: [
          {
            type: `greaterThan[${($('#earthThres').form('get value', 'lvl2') == "" ? 0 : $('#earthThres').form('get value', 'lvl2'))}]`,
            prompt: "Value must be greater than Level 2"
          },
          {
            type: `greaterThan[${($('#earthThres').form('get value', 'lvl1') == "" ? 0 : $('#earthThres').form('get value', 'lvl1'))}]`,
            prompt: "Value must be greater than Level 1"
          }
        ]
      }
    },
    onSuccess: function () {
      var data = {
        type: "earth",
        lvl1: $('#earthThres').form('get value', 'lvl1') ,
        lvl2: $('#earthThres').form('get value', 'lvl2') ,
        lvl3: $('#earthThres').form('get value', 'lvl3') 
      }
      $.post('./config_alarm/update_config', data, (response) => {
        if (response == "success") {
          messageSucess("Successfully Saved");
        }
        else {
          messageFailure(response);
        }
      })
    }

  }).form('validate form');
}