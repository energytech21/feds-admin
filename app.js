const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const validator = require('express-validator');
var favicon = require('serve-favicon');
var moment = require('moment');
var moment_tz = require('moment-timezone');
var howl = require('howler');
const mysql = require('mysql'),
    connection = require('express-myconnection'),
    config = {
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'fedsdb',
        debug: false
    };

var config_prod = {
    host: "148.66.136.55",
    user: "fedsadmin",
    password: "admin123",
    database: "fedsdb",
    debug: false
};
const session = require('express-session');
//routes
var user_route = require('./routes/user');
var dash_route = require('./routes/dashboard');
var acc_mgt_route = require('./routes/acc-mgt');
var sensors_route = require('./routes/sensors');
var sensors_history_route = require('./routes/sensors-history');
var utils_route = require('./routes/utils');
var conf_alarm = require('./routes/config-alarm');
var map_route = require('./routes/map');
//app config
var app = express();
const https = require('http').Server(app);
var io = require('socket.io')(https);

var socketCount = 0

app.use(connection(mysql, config_prod, 'request'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(validator());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'client_scripts')));
app.use('/node_scripts', express.static(__dirname + '/node_modules/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var MemoryStore = session.MemoryStore;
app.use(session({
    name: 'app.sid',
    secret: "1234567890FEDS",
    resave: true,
    store: new MemoryStore(),
    saveUninitialized: true
}));
https.listen(process.env.PORT || 5000)
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(function (req, res, next) {
    req.io = io;
    req.moment = moment;
    req.moment.tz = moment_tz;
    next();
});

app.use('/', user_route);
app.use('/dashboard', dash_route);
app.use('/AccountsManagement', acc_mgt_route);
app.use('/device_history', sensors_history_route);
app.use('/sensors', sensors_route);
app.use('/utils', utils_route);
app.use('/config_alarm', conf_alarm);
app.use('/map',map_route);