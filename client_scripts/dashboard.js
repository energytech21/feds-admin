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
        relayout(data.x_data, data.y_data, data.z_data);
    });

    socket.on('alarm/smoke', (sensor_data) => {
        if (sensor_data.location == "AVR") {
            alert_smoke_avr();
        }
        if (sensor_data.location == "Faculty") {
            console.log(sensor_data);
            alert_smoke_fac();
        }
    });

    socket.on('alarm/temp', (sensor_data) => {
        if (sensor_data.location == "AVR") {
            alert_temp_avr();
        }
        if (sensor_data.location == "Faculty") {
            alert_temp_fac();
        }
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

function alert_temp_avr() {
    var coord = $('#avr_fire').attr('coords').split(',');

    if ($("#image").width() == undefined) {
        var x = document.createElement("IMG");

        x.setAttribute("src", "../images/fire.png");
        x.setAttribute("width", "50");
        x.setAttribute("height", "50");
        x.id = 'image';
        $('#img-container').append(x);

    }
    $('#image').css({
        position: "absolute",
        left: parseInt(coord[0]),
        top: parseInt(coord[1]),
        zIndex: 1
    });

    $('#image')
        .transition('set looping')
        .transition('bounce', '1000ms')
        ;
}
function alert_smoke_avr() {
    var coordy = $('#avr_smoke').attr('coords').split(',');
    if ($("#imagey").width() == undefined) {

        var y = document.createElement("IMG");
        y.setAttribute("src", "../images/smoke.png");
        y.setAttribute("width", "50");
        y.setAttribute("height", "50");
        y.id = 'imagey';
        $('#img-container').append(y);
    }


    $('#imagey').css({
        position: "absolute",
        left: parseInt(coordy[0]),
        top: parseInt(coordy[1]),
        zIndex: 1
    });

    $('#imagey')
    .transition('set looping')
    .transition('bounce', '1000ms')
    ;
}

function alert_temp_fac() {
    var coord = $('#fac_fire').attr('coords').split(',');

    if ($("#imagefx").width() == undefined) {
        var x = document.createElement("IMG");

        x.setAttribute("src", "../images/fire.png");
        x.setAttribute("width", "50");
        x.setAttribute("height", "50");
        x.id = 'imagefx';
        $('#img-container').append(x);

    }
    $('#imagefx').css({
        position: "absolute",
        left: parseInt(coord[0]),
        top: parseInt(coord[1]),
        zIndex: 1
    });
    $('#imagefx')
    .transition('set looping')
    .transition('bounce', '1000ms')
    ;

}
function alert_smoke_fac() {
    var coordy = $('#fac_smoke').attr('coords').split(',');
    if ($("#imagefy").width() == undefined) {
        var y = document.createElement("IMG");
        y.setAttribute("src", "../images/smoke.png");
        y.setAttribute("width", "50");
        y.setAttribute("height", "50");
        y.id = 'imagefy';
        $('#img-container').append(y);
    }



    $('#imagefy').css({
        position: "absolute",
        left: parseInt(coordy[0]),
        top: parseInt(coordy[1]),
        zIndex: 1
    });
    $('#imagefy')
    .transition('set looping')
    .transition('bounce', '1000ms')
    ;
}