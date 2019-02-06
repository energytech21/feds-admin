


var idleTime = 0;
var monitor_flag = false;
var speaking = false;
var sms_flag = false;
var playing = false;


var player = new talkify.Html5Player()

//var client = require('socket.io-client')('https://feds-admin.herokuapp.com:' + process.env.PORT);
var client = io.connect('http://' + document.domain + ':' + location.port);
client.on('alarm/smoke', (sensor_data) => {

    idleTime = 0;
    if (!monitor_flag) {
        monitor_flag = true;
        startMonitor();
    }
    if (!sms_flag) {
        sms_flag = true;
        sendSMS();
    }
    if (!speaking) {
        speaking = true;
        player.playText('A ' + sensor_data.level + ' Smoke Detected at ' + sensor_data.location);
        setTimeout(()=>{
            speaking=false;
            console.log("falsed");
        },2800);
    }
    if (!playing) {
        playing = true;
        if (sensor_data.level == "Level 1") {
            playLevel1();
        }
        else if (sensor_data.level == "Level 2") {
            playLevel2();
        }
        else if (sensor_data.level == "Level 3") {

            playLevel3();
        }

    }

});



client.on('alarm/temp', (sensor_data) => {
    idleTime = 0;
    if (!monitor_flag) {
        monitor_flag = true;
        startMonitor();
    }
    if (!sms_flag) {
        sms_flag = true;
        sendSMS();
    }
    if (!speaking) {
        speaking = true;
        player.playText('A ' + sensor_data.level + ' Fire Detected at ' + sensor_data.location);
        setTimeout(()=>{
            speaking=false;
        },2000);
    }
    if (!playing) {
        playing = true;
        if (sensor_data.level == "Level 1") {
            playLevel1();
        }
        else if (sensor_data.level == "Level 2") {
            playLevel2();
        }
        else if (sensor_data.level == "Level 3") {

            playLevel3();
        }

    }
});

client.on('alarm/earth', (sensor_data) => {
    idleTime = 0;

    if (!monitor_flag) {
        monitor_flag = true;
        startMonitor();
    }
    if (sensor_data.level != "Level 1") {
        if (!sms_flag) {
            sms_flag = true;
            sendSMS();
        }
    }
    if (!speaking) {
        speaking = true;
        player.playText('A ' + sensor_data.level + 'Earthquake Detected');
        setTimeout(()=>{
            speaking=false;
            console.log("falsed");
        },2800);
    }

    if (!playing) {
        playing = true;
        if (sensor_data.level == "Level 1") {
            console.log("level 1");
            playLevel1();
        }
        else if (sensor_data.level == "Level 2") {
            console.log("level 2");
            playLevel2();
        }
        else if (sensor_data.level == "Level 3") {
            console.log("level 3");
            playLevel3();
        }

    }
});


function startMonitor() {

    var timer = setInterval(() => {
        idleTime++;
        if (idleTime == 10) {
            clearInterval(timer);
            announce();
            monitor_flag = false;
            sms_flag = false;
        }
    }, 1000)
}

function announce() {

    $.get("../utils/config_evac_message", (data) => {
        player.playText(data[0].message);
    });


}

function sendSMS() {

    var oneway_api = {
        username:"APIXVZL6L0QVX",
        password:"APIXVZL6L0QVXQSBZ6",
        to: "639308057643",
        id: "STI FEDS-ADMIN",
        lang_type: 1,
        message: "THIS IS A SYSTEM MESSAGE FROM STIFEDS WE NEED YOUR ASSISTANCE AND COOPERATION GODSPEED!"
    }
    var nexmo_api = {
        key:"895ccb85",
        secret:"Tc0km7kKcI3ja6mU",
        to: "639308057643",
        id: "STI FEDS-ADMIN",
        message: "THIS IS A SYSTEM MESSAGE FROM STIFEDS WE NEED YOUR ASSISTANCE AND COOPERATION GODSPEED!"
    }
    /*$.post(`http://gateway80.onewaysms.ph/api2.aspx?apiusername=${oneway_api.username}&apipassword=${oneway_api.password}&mobileno=${oneway_api.to}&senderid=${oneway_api.id}&languagetype=${oneway_api.lang_type}&message=${oneway_api.message}`, (response) => {
        console.log(response);
    });
    */

    $.post(`https://rest.nexmo.com/sms/json?api_key=${nexmo_api.key}&api_secret=${nexmo_api.secret}&to=${nexmo_api.to}&from=${nexmo_api.id}&text=${nexmo_api.message}`, (response) => {
        console.log(response);
    });
  
  
}

function playLevel1() {
    var sound = new Howl({
        src: ['/sounds/level1.mp3']
    });

    sound.play();
    sound.on('end', function () {
        playing = false;
        sound = null;
    });

}

function playLevel2() {
    var sound = new Howl({
        src: ['/sounds/level2.wav']
    });

    sound.play();
    sound.on('end', function () {
        playing = false;
        sound = null;
    });
}

function playLevel3() {
    var sound = new Howl({
        src: ['/sounds/level3.mp3']
    });

    sound.play();
    sound.on('end', function () {
        playing = false;
        sound = null;
    });


}

