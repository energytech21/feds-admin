
var express = require('express'),
router = express.Router(),
sensors = require('../controllers/sensors');


router.post('/post_sensors', sensors.post_sensors);
router.post('/post_earthquake',sensors.post_earthquake);
router.post('/sensor_data',sensors.get_sensors_data);
router.get('/probability',sensors.get_probability);
router.get('/',sensors.test_page)
module.exports = router;