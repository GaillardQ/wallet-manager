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

    var str_date = year + "-" + month + "-" + day;
    var str_month = year + "-" + month;
    
    var str_end = year+"-"+month+"-"+day;
    date.setDate(1);
    
    var start_month = parseInt(parseInt(date.getMonth())+1);
    if(start_month < 10) start_month = "0"+start_month;
    var start_day = date.getDate();
    if(start_day < 10) start_day = "0"+start_day;
    var str_start = date.getFullYear()+"-"+start_month+"-"+start_day;
    
    var payments_total = 0;
    
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
        
        if(payments.length > 0)
        {
            for(var p in payments)
            {
                var price = payments[p].price;
                if(price)
                {
                    payments_total += price;
                }
            }
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
                if(o_clearance.hasOwnProperty('value'))
                {
                    total = parseFloat(o_clearance.value) - payments_total;
                    total = Math.round(total*100) / 100;
                }
            }
            
            var clbk3 = function(err, medias)
            {
                if(err)
                {
                    console.log(err);
                }
                res.render('index/index.html.twig', {
                    title: 'Wallet manager',
                    date: str_date,
                    month: str_month,
                    payments: payments,
                    clearance: total,
                    total: payments_total,
                    medias: medias
                });   
            }
            DB_MGR.getPaymentMedias(clbk3);
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
    
    var clbk = function(err)
    {
        if(err)
        {
            console.log(err);
            res.status(500).json({
                message: 'Une erreur est survenue'
            });
            return;
        }
        
        res.status(200).json({});
        return;
        
    }
    DB_MGR.savePayment(user.id, date, motive, media, amount, clbk);
    /*var date = new Date();
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
    });*/
});

module.exports = router;
