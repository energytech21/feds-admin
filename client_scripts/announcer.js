


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

    var data = {
        1:"09105454987",
        2: "THIS IS A SYSTEM MESSAGE FROM STIFEDS WE NEED YOUR ASSISTANCE AND COOPERATION GODSPEED!",
        3: "TR-KENTB454987_HFUMG"
    }
    $.post("https://www.itexmo.com/php_api/api.php", data, (err) => {
        console.log(err);
    })
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

