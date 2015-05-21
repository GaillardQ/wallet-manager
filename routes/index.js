var express = require('express');
var utils = require('utils');

var router = express.Router();

var sess;

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
    
    var clbk = function(_err, _payments, _total, _payments_total, _medias)
    {
        if(_err)
        {
            console.log(_err);
        }
        res.render('index/index.html.twig', {
                    title: 'Wallet manager',
                    date: str_date,
                    month: str_month,
                    payments: _payments,
                    clearance: _total,
                    total: _payments_total,
                    medias: _medias
        }); 
    }
    getMonthPayment(user.id, str_start, str_end, clbk);

});

function getMonthPayment(user_id, str_start, str_end, _clbk)
{
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
                _clbk(err, payments, total, payments_total, medias);
            }
            DB_MGR.getPaymentMedias(clbk3);
        }
        DB_MGR.getMonthClearance(user_id, str_start, str_end, clbk2);
    }
    DB_MGR.getMonthPayments(user_id, str_start, str_end, clbk);
}

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
    
        var clbk = function(_err, _payments, _total, _payments_total, _medias)
        {
            if(_err)
            {
                console.log(_err);
                res.status(500).json({
                    message: 'Une erreur est survenue'
                });
                return;
            }
            
            res.render('index/payments.html.twig', {
                        month: str_month,
                        payments: _payments,
                        clearance: _total,
                        total: _payments_total
            }); 
            
        }
        getMonthPayment(user.id, str_start, str_end, clbk);
        
       
        
    }
    DB_MGR.savePayment(user.id, date, motive, media, amount, clbk);
});

module.exports = router;
