function messageSucess(message) {
  $.uiAlert({
    textHead: "Success",
    text: message,
    bgcolor: "#19c3aa",
    textcolor: "#fff",
    position: "top-left",
    icon: "checkmark box",
    time: 1
  });
}

function messageFailure(message) {
  $.uiAlert({
    textHead: "Error",
    text: message,
    bgcolor: "#DB2828",
    textcolor: "#fff",
    position: "top-left",
    icon: "remove circle",
    time: 1
  });
}

function messageWarning(message) {
  $.uiAlert({
    textHead: "Warning", // header
    text: message, // Text
    bgcolor: "#F2711C", // background-color
    textcolor: "#fff", // color
    position: "top-left", // position . top And bottom ||  left / center / right
    icon: "warning sign", // icon in semantic-UI
    time: 1 // time
  });
}


function messageArrived() {
  $.uiAlert({
    textHead: "New Report",
    text: "You 1 Report Arrived",
    bgcolor: "#18c340",
    textcolor: "#fff",
    position: "top-left",
    icon: "envelope open outline box",
    time: 1
  });
}