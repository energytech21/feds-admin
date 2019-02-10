var express = require('express'),
 router = express.Router(),
 utils = require('../controllers/utils');


router.get('/locations',utils.get_locations);
router.post('/locations',utils.get_table_locations);
router.post('/locations/update',utils.update_location);
router.post('/locations/add',utils.add_location);
router.post('/config_evac_message',utils.save_evac);
router.get('/config_evac_message',utils.get_evac);
module.exports = router;