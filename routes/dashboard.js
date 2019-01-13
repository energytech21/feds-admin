
var express = require('express'),
 router = express.Router(),
 dash = require('../controllers/dashboard');


router.get('/', dash.dashboard_page);
module.exports = router;