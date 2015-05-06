var express = require('express');
var router = express.Router();
var md5 = require('MD5');
var salt = "";
var l = "";
var sess;

/* GET login page. */
router.get('/', function(req, res, next) {
    sess = req.session;
    var error = req.query.error;
    res.render('common/login.html.twig', {error: error});
});

router.post('/check', function(req, res, next) {
    var login = req.body.login;
    var hashed_login = md5(md5(login) + md5(salt));
    var comp_login = md5(md5(l) + md5(salt));

    if (hashed_login === comp_login) {
        sess = req.session;
        if (sess != null && sess != undefined) {
            req.session.is_logged = true;
        }
        res.writeHead(302, {
            'Location': '/'
        });
        res.end();
    }
    else {
        res.writeHead(302, {
            'Location': '/login?error=login'
        });
        res.end();
    }
});

module.exports = router;
