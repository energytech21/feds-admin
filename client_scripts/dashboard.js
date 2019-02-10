$(document).ready(() => {
    $('#bt-accset')
        .dropdown({
            useLabels: false
        });
    $('.ui.sticky')
        .sticky({
            context: '#stickyDiv'
        })
        ;
});

$('.top.menu .item').tab();


function showTempModal() {
    $(document).ready(() => {
        $('#tempModal').modal('show');
    });
};

$(document).ready(function () {
    loadLevels();
    setInterval(() => {
        $.get('sensors/probability');
    }, 1000);

    var socket = io.connect('http://' + document.domain + ':' + location.port);

    /* socket.on('smoke/sensor/Faculty', function (data) {
         $("#smoke_sensor_data_Faculty").html(data.data);
         var d = new Date();
         $("#smoke_sensor_time_Faculty").html(d.toLocaleString());
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
         $("#fire_sensor_data_Faculty").html(data.data);
         var d = new Date();
         $("#fire_sensor_time_Faculty").html(d.toLocaleString());
     });
     */

    socket.on('smoke/sensor', function (data) {
        console.log(data.location);
        $("#smoke_sensor_data_"+data.location).html(data.data);
        var d = new Date();
        $("#smoke_sensor_time_"+data.location).html(d.toLocaleString());
    });


    socket.on('fire/sensor', function (data) {
        console.log(data.location);
        $("#fire_sensor_data_"+data.location).html(data.data);
        var d = new Date();
        $("#fire_sensor_time_"+data.location).html(d.toLocaleString());
    });

    socket.on('earth/sensor', function (data) {
        relayout(data.x_data, data.y_data);
    });

    socket.on('earth/probability', (data) => {
        $("#eq_stat").html(data);
    })

    var removedPaths = [];
    // Variables for wayfinding
    var MAPS = [
        { 'path': '../images/map-images/firstfloor.svg', 'id': 'floor1' },
        { 'path': '../images/map-images/secondfloor.svg', 'id': 'floor2' },
        { 'path': '../images/map-images/thirdfloor.svg', 'id': 'floor3' },
        { 'path': '../images/map-images/cc.svg', 'id': 'floor4' }
    ];

    var DEFAULT_MAP = 'floor3';

    //Setup options for wayfinding
    $(document).ready(function () {
        'use strict';
        $('#myMaps').wayfinding({
            'maps': MAPS,
            'path': {
                width: 5,
                color: 'red',
                radius: 20,
                speed: 3
            },
            'defaultMap': DEFAULT_MAP
        });

        $("#floorButtons button").on('click', (e) => {
            var id = $(e.target).attr('id');
            $("#myMaps").wayfinding('currentMap', id);
        })



        socket.on('alarm/smoke', (sensor_data) => {
            if (!removedPaths.includes(sensor_data.location)) {
                removedPaths.push(sensor_data.location);
                $('#myMaps').wayfinding('removepath', removedPaths);
                notice("Route Updated");
            }
        });

        socket.on('alarm/temp', (sensor_data) => {
            if (!removedPaths.includes(sensor_data.location)) {
                removedPaths.push(sensor_data.location);
                $('#myMaps').wayfinding('removepath', removedPaths);
                notice("Route Updated");
            }
        });

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
                `<td id='smoke_sensor_data_` + location + `'></td>` +
                `<td id='smoke_sensor_time_` + location + `'></td>` +
                `</tr>`);

            $('#tTemp').append(`<tr>` +
                `<td>` + location + `</td>` +
                `<td id='fire_sensor_data_` + location + `'></td>` +
                `<td id='fire_sensor_time_` + location + `'></td>` +
                `</tr>`);

        });

    },
    error: function (jqXHR, textStatus, errorThrown) {
        messageFailure(textStatus);
    }
});

function loadLevels() {
    $.get('../config_alarm/config', (response) => {
        var smoke_data = response.filter((x) => { return x.sensor_type == "smoke" });
        var temp_data = response.filter((x) => { return x.sensor_type == "temp" });
        var earth_data = response.filter((x) => { return x.sensor_type == "earth" });
        var tables = $("table");

        var values = {
            "1": "I",
            "2": "II",
            "3": "III",
            "4": "IV",
            "5": "V",
            "6": "VI",
            "7": "VII",
            "8": "VIII",
            "9": "IX",
            "10": "X"
        }
        $.each(tables, (key, value) => {
            var table_id = $(value).attr('id');

            if (table_id == "tblSmoke") {
                var td = $("#" + table_id + " input");
                $.each(td, (key, value) => {
                    var id = $(value).attr('id');

                    if (id == "lvl1") $(value).html(`>= ${smoke_data[0].level1_threshold}`);
                    if (id == "lvl2") $(value).html(`>= ${smoke_data[0].level2_threshold}`);
                    if (id == "lvl3") $(value).html(`>= ${smoke_data[0].level3_threshold}`);
                });
            }

            if (table_id == "tblTemp") {
                var td = $("#" + table_id + " td");
                $.each(td, (key, value) => {
                    var id = $(value).attr('id');

                    if (id == "lvl1") $(value).html(`>= ${temp_data[0].level1_threshold}`);
                    if (id == "lvl2") $(value).html(`>= ${temp_data[0].level2_threshold}`);
                    if (id == "lvl3") $(value).html(`>= ${temp_data[0].level3_threshold}`);
                });
            }

            if (table_id == "tblEarth") {
                var td = $("#" + table_id + " td");
                $.each(td, (key, value) => {
                    var id = $(value).attr('id');

                    if (id == "lvl1") $(value).html(`>= ${values[`${earth_data[0].level1_threshold}`]}`);
                    if (id == "lvl2") $(value).html(`>= ${values[`${earth_data[0].level2_threshold}`]}`);
                    if (id == "lvl3") $(value).html(`>= ${values[`${earth_data[0].level3_threshold}`]}`);
                });
            }
        });
    });
}