
var express = require('express'),
router = express.Router(),
sensors_history = require('../controllers/sensors-history');


router.get('/', sensors_history.sensor_history_page);
module.exports = router;