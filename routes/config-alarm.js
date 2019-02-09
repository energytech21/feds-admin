
var express = require('express'),
router = express.Router(),
conf_alarm = require('../controllers/config-alarm');


router.get('/', conf_alarm.render);
router.get('/config',conf_alarm.get_config);
router.post('/update_config',conf_alarm.post_config);
module.exports = router;