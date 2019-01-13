$(document).ready(()=>{
    $('#bt-accset')
    .dropdown({
        useLabels: false
    });
});

$('.top.menu .item').tab();


function showTempModal(){
    $(document).ready(()=>{
        $('#tempModal').modal('show');
    });
}



$(document).ready(function(){
    // Connect to our node/websockets server
    var socket = io.connect('http://' + document.domain + ':' + location.port);

    // New socket connected, display new count on page
    socket.on('users connected', function(data){
        console.log('Users connected: ' + data);
    })
 
});
