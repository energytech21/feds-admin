$(() => {
    $(".ui.calendar").calendar({
      type: 'date'
    });
    getLocations();
});
$('.ui.dropdown')
  .dropdown()
;
function generateResult(formID){
  $.ajax({
    type: "post",
    data: $(formID).serialize(),
    url: "../sensors/sensor_data",
    success: function(response) {
      if(response.sensor_type=="smoke"){
        loadGraph("smokeChart",response);
      }
      if(response.sensor_type=="earth"){
        loadGraph("EQChart",response);
      }
      if(response.sensor_type=="temp"){
        loadGraph("tempChart",response);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      messageFailure(textStatus);
    }
  });
}
function getLocations(){
  $.ajax({
    type: "get",
    url: "../utils/locations",
    success: function(response) {
      response.forEach((item)=>{
        $('select').append("<option value='"+item.location_id+"'>"+item.location+"</option>");
      })
    },
    error: function(jqXHR, textStatus, errorThrown) {
      messageFailure(textStatus);
    }
  });
}


function loadGraph(targetChart,data){
  var lines;
  console.log(data.time);
  if(targetChart=="EQChart"){
    var trace1 = {
      x: data.time,
      y: data.x_trace,
      type: 'line',
      name: 'Horizontal Movement'
    };
    var trace2 = {
      x: data.time,
      y: data.y_trace,
      type: 'line',
      name: 'Vertical Movement'
    };
    var trace3 = {
      x: data.time,
      y: data.z_trace,
      type: 'line',
      name: 'Diagonal Movement'
    };
    lines = [trace1,trace2,trace3];
  }
  else{
    var trace1 = {
      x: data.x,
      y: data.y,
      type: 'line',
      name: (data.sensor_type == "smoke" ? "Smoke Data" : "Temperature Data")
    };
  
    lines = [trace1];
  
  }
  var layout  = {
    xaxis:{
      visible:false
    }
  }
  Plotly.newPlot(targetChart, lines,layout);

}
