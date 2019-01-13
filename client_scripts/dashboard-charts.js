loadChart();
function loadChart() {

  var d = new Date();
  var x_axis = {
    name: "Horizontal Movement",
    x: [d.toLocaleString()],
    y: [0],
    mode: 'lines'
  };

  var y_axis = {
    name: "Vertical Movement",
    x: [d.toLocaleString()],
    y: [0],
    mode: 'lines'
  };

  var z_axis = {
    name: "Diagonal Movement",
    x: [d.toLocaleString()],
    y: [0],
    mode: 'lines'
  };

  var data = [x_axis, y_axis, z_axis];

  var layout = {
    title: 'Earthquake Vibration Data',
    xaxis: {
      title: 'Time',
      showgrid: false,
      zeroline: false,
      visible:false
    },
    yaxis: {
      title: "Sensor Data",
      showgrid: false,
      zeroline: false
    },

  };

  Plotly.newPlot('EQChart', data, layout);
}
var count = 0;
function relayout(x_data, y_data, z_data) {
  count++;
  var d = new Date().toLocaleString();
  Plotly.extendTraces('EQChart', {
    y: [[x_data], [y_data], [z_data]],
    x: [[d],[d],[d]]
  }, [0, 1,2]);

  /*if(count>=5 ){
    Plotly.relayout('EQChart',{
      xaxis:{
        range:[count-5,count]
      }
    });
  }*/
}