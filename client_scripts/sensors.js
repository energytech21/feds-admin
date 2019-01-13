$(document).ready(function(){

    var socket = io.connect('https://' + document.domain + ':' + location.port);
    
    socket.on('fire/sensor/Faculty', function(data){
        console.log('Location :' + data.location);
        console.log('Value : '+data.data);
        console.log('Sensor Type : '+data.sensor_type);
    });

    socket.on('fire/sensor/301B', function(data){
        console.log('Location :' + data.location);
        console.log('Value : '+data.data);
        console.log('Sensor Type : '+data.sensor_type);
    });

    socket.on('smoke/sensor/Faculty', function(data){
        console.log('Location :' + data.location);
        console.log('Value : '+data.data);
        console.log('Sensor Type : '+data.sensor_type);
    });

    socket.on('smoke/sensor/301B', function(data){
        console.log('Location :' + data.location);
        console.log('Value : '+data.data);
        console.log('Sensor Type : '+data.sensor_type);
    });

    socket.on('earth/sensor', function(data){
        console.log('Location :' + data.location);
        console.log('Value : '+data.data);
        console.log('Sensor Type : '+data.sensor_type);
    });
});
