
var express = require('express'),
router = express.Router(),
map = require('../controllers/map');


router.get('/', map.load_map);
module.exports = router;