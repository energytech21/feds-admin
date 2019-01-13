var express = require('express'),
 router = express.Router(),
 users = require('../controllers/user');


router.get('/', users.route_landing);
router.post('/register', users.add);
router.post('/lists',users.list);
router.post('/reportss',users.getReports);
router.post('/login',users.login)
router.post('/search',users.search);
router.get('/logout',users.logout);
router.post('/update',users.update);
router.post('/report',users.report);
router.get('/report',users.render_reports);
module.exports = router;