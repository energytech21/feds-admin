
var express = require('express'),
router = express.Router(),
accmgt = require('../controllers/acc-mgt');


router.get('/', accmgt.page);
router.post('/update_status',accmgt.update_status);
module.exports = router;