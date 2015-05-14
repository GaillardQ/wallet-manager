var express = require('express');
var router = express.Router();
var md5 = require('MD5');
var salt = "";
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
    
    var clbk = function(err, rows)
    {
        if(rows != null && rows.length > 0)
        {
            var user = rows[0];
            sess = req.session;
            if (sess != null && sess != undefined) {
                req.session.is_logged = true;
                req.session.user = user;
            }
            res.writeHead(302, {
                'Location': '/'
            });
            res.end();
            
        } else {
            if(err)
            {
                console.log(err);
                res.writeHead(302, {
                    'Location': '/login?error=error'
                });
                res.end();
            }  
            else {
                res.writeHead(302, {
                    'Location': '/login?error=login'
                });
                res.end();
            }
        }
    }
    
    DB_MGR.checkLogin(hashed_login, clbk);
});

module.exports = router;
