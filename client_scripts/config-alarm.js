$('.ui.dropdown')
  .dropdown()
  ;


var recieve_data = false;
var sumx;
var sumy;
var sumz;
var count;
$(document).ready(() => {
  var socket = io.connect('http://' + document.domain + ':' + location.port);

  $.ajax({
    type: "GET",
    url: '../utils/config_EQ',
    success: function (response) {
      $('#x').val(response[0].level1_threshold);
      $('#y').val(response[0].level2_threshold);
      $('#z').val(response[0].level3_threshold);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      messageFailure(textStatus);
    }
  });

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
  socket.on('earth/sensor', function (data) {
    if (recieve_data) {
      count++;
      sumx = sumx + Math.abs(data.x_data);
      sumy = sumy + Math.abs(data.y_data);
      sumz = sumz + Math.abs(data.z_data);
      var curLog = $('#calLog').val();
      var log = `Horizontal Movement: ` + data.x_data + `\nVertical Movement: ` + data.y_data + `\nDiagonal Movement: ` + data.z_data + `\n\n`
      $('#calLog').val(curLog + log);
    }
  });



})

function calibrate() {

  sumx = 0;
  sumy = 0;
  sumz = 0;
  count = 0;
  recieve_data = true;
  var curLog = $('#calLog').val();
  var log = ` ---------------------------------- \n STARTING CALIBRATION\n ---------------------------------- \n`;
  $('#calLog').val(curLog + log);
  setTimeout(() => {
    recieve_data = false;
    if (count == 0) {
      messageFailure('No Data Recieved');
      curLog = $('#calLog').val();
      log = ` ---------------------------------- \n ERROR NO DATA RECIEVED \n ---------------------------------- \n`;
      $('#calLog').val(curLog + log);
    }
    else {
      $('#x').val(sumx/count);
      $('#y').val(sumy/count);
      $('#z').val(sumz/count);
      curLog = $('#calLog').val();
      log = `\n ---------------------------------- \n CALIBRATION FINISHED \n ---------------------------------- \n`;
      $('#calLog').val(curLog + log);
    }
  }, 5000);

}
function saveCalibration() {
  $.ajax({
    type: "post",
    data: $('#calibForm').serialize(),
    url: '../utils/config_EQ',
    success: function (response) {
      messageSucess('Earthquake Configuration Saved');
    },
    error: function (jqXHR, textStatus, errorThrown) {
      messageFailure(textStatus);
    }
  });
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