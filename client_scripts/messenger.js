var client = io.connect('http://' + document.domain + ':' + location.port);

client.on('reports',()=>{
    messageArrived();
})