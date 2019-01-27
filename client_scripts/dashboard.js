$(document).ready(() => {
    $('#bt-accset')
        .dropdown({
            useLabels: false
        });
});

$('.top.menu .item').tab();


function showTempModal() {
    $(document).ready(() => {
        $('#tempModal').modal('show');
    });
};

$(document).ready(function () {

    
    $('#map_container').load('../map');
    setInterval(()=>{
        $.get('sensors/probability');
    },1000);
    // Connect to our node/websockets server
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    // New socket connected, display new count on page
    socket.on('users connected', function (data) {
        console.log('Users connected: ' + data);
    });

    socket.on('smoke/sensor/Faculty', function (data) {
        $("#smoke_sensor_data_FAC").html(data.data);
        var d = new Date();
        $("#smoke_sensor_time_FAC").html(d.toLocaleString());
    });

    socket.on('smoke/sensor/AVR', function (data) {
        $("#smoke_sensor_data_AVR").html(data.data);
        var d = new Date();
        $("#smoke_sensor_time_AVR").html(d.toLocaleString());
    });

    socket.on('fire/sensor/AVR', function (data) {
        $("#fire_sensor_data_AVR").html(data.data);
        var d = new Date();
        $("#fire_sensor_time_AVR").html(d.toLocaleString());
    });

    socket.on('fire/sensor/Faculty', function (data) {
        $("#fire_sensor_data_FAC").html(data.data);
        var d = new Date();
        $("#fire_sensor_time_FAC").html(d.toLocaleString());
    });

    socket.on('earth/sensor', function (data) {
        relayout(data.x_data, data.y_data);
    });

    socket.on('earth/probability',(data)=>{
        $("#eq_stat").html(data);
    })
    socket.on('alarm/smoke', (sensor_data) => {
        
    });

    socket.on('alarm/temp', (sensor_data) => {
     
    });
});

$.ajax({
    type: "GET",
    url: "../utils/locations",
    success: function (response) {
        response.forEach(element => {
            var location = element.location;
            var loc_code = element.loc_code;
            $('#tSmoke').append(`<tr>` +
                `<td>` + location + `</td>` +
                `<td id='smoke_sensor_data_` + loc_code + `'></td>` +
                `<td id='smoke_sensor_time_` + loc_code + `'></td>` +
                `</tr>`);

            $('#tTemp').append(`<tr>` +
                `<td>` + location + `</td>` +
                `<td id='fire_sensor_data_` + loc_code + `'></td>` +
                `<td id='fire_sensor_time_` + loc_code + `'></td>` +
                `</tr>`);
        });

    },
    error: function (jqXHR, textStatus, errorThrown) {
        messageFailure(textStatus);
    }
});

