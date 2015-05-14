var express = require('express');
var utils = require('utils');

var router = express.Router();

var sess;
var path = null;

/* GET home page. */
router.get('/', function(req, res, next) {
    sess = req.session;

    var is_logged = sess.is_logged || false;
    var user = sess.user;
    if (!is_logged || user == null || user == undefined || user.id == null) {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();
        return;
    }
    
    var date = new Date();
    var day = date.getDate();
    var month = parseInt(date.getMonth()) + 1;
    var year = date.getFullYear();

    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;

    var str_date = day + "-" + month + "-" + year;
    var str_month = month + "-" + year;
    
    var str_end = year+"-"+month+"-"+day;
    var d_start = date.setDate(1);
    var str_start = date.getFullYear()+"-"+parseInt(parseInt(date.getMonth())+1)+"-"+date.getDate();
    
    var clbk = function(err, payments)
    {
        if(err)
        {
            console.log(err);
        }
        
        if(payments == undefined)
        {
            payments = null;
        }
        
        var clbk2 = function(err2, clearance)
        {
            if(err)
            {
                console.log(err);
            }
            
            if(clearance == undefined)
            {
                clearance = null;
            }
            
            var total = null;
            if(clearance != null && clearance.length > 0)
            {
                var o_clearance = clearance[0];
                if(o_clearance.hasOwnProperty('value') && o_clearance.hasOwnProperty('total'))
                {
                    console.log("Budget : "+parseFloat(o_clearance.value));
                    console.log("Dépenses : "+parseFloat(o_clearance.total));
                    total = parseFloat(o_clearance.value) - parseFloat(o_clearance.total);
                    total = Math.round(total*100) / 100;
                    console.log("Total : "+total);
                }
            }
            
            res.render('index/index.html.twig', {
                title: 'Wallet manager',
                date: str_date,
                month: str_month,
                payments: payments,
                clearance: total
            });
        }
        
        DB_MGR.getMonthClearance(user.id, str_start, str_end, clbk2);
    }
    DB_MGR.getMonthPayments(user.id, str_start, str_end, clbk);

});

router.get('/add_payment', function(req, res, next) {
    var id = req.query.id;

    var date = req.query.date;
    var motive = req.query.motive;
    var media = req.query.media;
    var amount = req.query.amount;
    
    sess = req.session;

    var is_logged = sess.is_logged || false;
    var user = sess.user;
    if (!is_logged || user == null || user == undefined || user.id == null) {
        res.status(500).json({
            message: 'Une erreur est survenue'
        });
        return;
    }
    

    var date = new Date();
    var month = parseInt(date.getMonth()) + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;

    var file = year + "-" + month + ".json";

    var fs = require('fs');
    fs.readFile(path + "/" + id + "/" + file, {
        encoding: 'utf-8'
    }, function(err, data) {
        if (err) {
            res.status(500).json(err);
            return;
        }

        var json = JSON.parse(data);
        if (json.payments == null || json.payments == undefined) {
            res.status(500).json({
                message: 'Une erreur est survenue'
            });
            return;
        }

        json.payments.push(object);
        var clearance = parseFloat(json.clearance) - parseFloat(amount);
        json.clearance = clearance;

        fs.writeFile(path + "/" + id + "/" + file, JSON.stringify(json), function(err2) {
            if (err2) {
                res.status(500).json(err2);
                return;
            }
            res.end(JSON.stringify(json));
        });
    });
});

module.exports = router;
