var express = require('express'),
 router = express.Router(),
 utils = require('../controllers/utils');


router.get('/locations',utils.get_locations);
router.get('/config_EQ',utils.get_EQ);
router.post('/config_EQ',utils.save_EQ);
router.post('/config_evac_message',utils.save_evac);
router.get('/config_evac_message',utils.get_evac);
module.exports = router;