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
    
    var clbk = function(err, rows)
    {
        var data = {};
        if(err)
        {
            data.error = true;
        }
        else
        {
            data.data = rows;
        }
        res.render('manager/files-index.html.twig', data); 
    }
    DB_MGR.getMonthList(req.session.user.id, clbk);
    
    
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
        var start = s + "-01";
        var end = s + "-31";
        
        var clbk = function(err, payments)
        {
            if(err) { res.status(500).json(); return; }
            var clbk2 = function(err, clearance)
            {
                if(err) { res.status(500).json(); return; }
                res.render('manager/files-month-content.html.twig', {month:s, payments:payments, clearance:clearance}); 
                return;    
            }
            DB_MGR.getMonthClearance(req.session.user.id, start, end, clbk2);
        }
        DB_MGR.getMonthPayments(req.session.user.id, start, end, clbk);
    }
    else if(s == "all")
    {
        var clbk = function(err, payments)
        {
            if(err) { res.status(500).json(); return; }
            var clbk2 = function(err, clearances)
            {
                if(err) { res.status(500).json(); return; }
                res.render('manager/files-all-content.html.twig', {payments:payments, clearances:clearances}); 
                return;
            }
            DB_MGR.getAllMonthsClearance(req.session.user.id, clbk2);
        }
        DB_MGR.getAllMonthPayments(req.session.user.id, clbk);
    }
    else
    {
        res.status(500).json({error: "BAD_PARAMETER"});
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