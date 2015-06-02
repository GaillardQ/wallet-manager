var express = require('express');
require('../models/manager.js')
var router = express.Router();

var sess = null;

/********************************************
 * Home : [/]                               *
 ********************************************/
router.get('/', function(req, res, next) {
    var l = is_logged(req);
    if(l == false)
    {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();
        return;
    }
    
    
    
    res.render('manager/index.html.twig', {}); 
});



/********************************************
 * Months list : [/files]                   *
 ********************************************/
router.get('/files', function(req, res, next) {
    var l = is_logged(req);
    if(l == false)
    {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();
        return;
    }
    
    res.render('manager/files-index.html.twig', {}); 
});



/********************************************
 * List of payments : [/file?month=]        *
 ********************************************/
router.get('/file', function(req, res, next) {
    var l = is_logged(req);
    if(l == false)
    {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();
        return;
    }
    
    var s = req.query.month;
    var re = new RegExp("^([0-9]{2,4}[-][0-9]{2,4})$");
    if(re.test(s))
    {
        res.render('manager/files-month-content.html.twig', {}); 
        return;
    }
    else if(s == "all")
    {
        res.render('manager/files-all-content.html.twig', {}); 
        return;
    }
    else
    {
        res.writeHead(302, {
            'Location': '/manager'
        });
        res.end();
        return;
    }
    
    
});



/********************************************
 * Params : [/params]                       *
 ********************************************/
router.get('/params', function(req, res, next) {
    var l = is_logged(req);
    if(l == false)
    {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();
        return;
    }
    
    var clbk = function (err, rows)
    {
        var error = null;
        if(err != null)
        {
            console.log(err);
            error = true;
        }
        
        var value = null;
        if(rows.length > 0)
        {
            value = rows[0].value;
        }
        res.render('manager/params.html.twig', {error: error, value:value, user:req.session.user.id});    
    }
    DB_MGR.getUserBudget(req.session.user.id, clbk);
});

module.exports = router;





function is_logged(req)
{
    var sess = req.session;
    var is_logged = sess.is_logged || false;
    var user = sess.user;
    if (!is_logged || user == null || user == undefined || user.id == null) {
        return false;
    }
    else
    {
        return true;
    }
}