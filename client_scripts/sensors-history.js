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
        loadGraph("EQChart2",response);
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
  const chartNames = {
    "EQChart": "Earthquake Vibration Chart",
    "EQChart2" : "Earthquake Magnitude Chart",
    "smokeChart": "Smoke PPM Chart",
    "tempChart":"Temperature Celcius Chart"
  }
  var lines;
  if(targetChart == "EQChart"){
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
    lines = [trace1,trace2];
  }
  else if(targetChart == "EQChart2"){
    var trace1 = {
      x: data.mv.time,
      y: data.mv.magnitude,
      type: 'line',
      name: 'Magnitude Scale'
    };
    lines = [trace1];
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
    title: chartNames[targetChart], 
    xaxis:{
      visible:false
    }
  }
  Plotly.newPlot(targetChart, lines,layout);

}
