var express = require('express');
var router = express.Router();
var sess;

/* GET home page. */
router.get('/', function(req, res, next) {
    sess = req.session;

    var is_logged = sess.is_logged || false;
    if (!is_logged) {
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
    
        if (month < 10) month = "0" + month;
    
        var str_date = day + "-" + month + "-" + year;
    
        res.render('index/index.html.twig', {
            title: 'Wallet manager',
            date: str_date
        });
    
});

router.get('/create_file', function(req, res, next) {
    var id = req.query.id;
    if (id == "" || id == undefined || id == null) {
        res.status(404).json({
            error: 'User is null'
        });
        return;
    }

    var date = new Date();
    var month = parseInt(date.getMonth()) + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;

    var file = year + "-" + month + ".json";

    var content = new Object();
    content.clearance = 300;
    content.payments = [];

    var fs = require('fs');
    fs.writeFile("../public/files/" + id + "/" + file, JSON.stringify(content), function(err) {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.end(JSON.stringify(content));
    });
});

router.get('/add_payment', function(req, res, next) {
    var id = req.query.id;

    var date = req.query.date;
    var motive = req.query.motive;
    var media = req.query.media;
    var amount = req.query.amount;

    var object = {
        "date": date,
        "motive": motive,
        "type": media,
        "price": amount
    }

    var date = new Date();
    var month = parseInt(date.getMonth()) + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;

    var file = year + "-" + month + ".json";

    var fs = require('fs');
    fs.readFile("../public/files/" + id + "/" + file, {
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

        fs.writeFile("../public/files/" + id + "/" + file, JSON.stringify(json), function(err2) {
            if (err2) {
                res.status(500).json(err2);
                return;
            }
            res.end(JSON.stringify(json));
        });
    });
});

module.exports = router;
