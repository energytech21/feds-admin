
var express = require('express'),
router = express.Router(),
conf_alarm = require('../controllers/config-alarm');


router.get('/', conf_alarm.render);
module.exports = router;