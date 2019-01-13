
$(document).ready(() => {
  var client = io.connect('http://' + document.domain + ':' + location.port);

  client.on('reports', () => {
    messageArrived();
    $("#reports")
    .DataTable()
    .ajax.reload(null, false);
  })

  $('#bt-accset')
    .dropdown({
      useLabels: false
    });

  loadTables();
});


function toggle() {
  $(document).ready(() => {
    $("#sidebar").sidebar("toggle");
  });
}

function loadTables() {
   $("#reports").DataTable({
    serverSide: true,
    processing: true,
    ajax: {
      type: "POST",
      url: "/reportss"
    },
    columns: [
      { data: "createdBy" },
      { data: "location" },
      { data: "details" },
      { data: "createdOn" }
    ]
  });
}





