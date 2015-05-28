var express = require('express');
var router = express.Router();

var sess = null;

/********************************************
 * Données pour le graphe des dépenses      *
 * du mois par rapport au solde             * 
 * URL : [/month_clearance]                   *
 ********************************************/
router.get('/month_clearance', function(req, res, next) {
    sess = req.session;
    var user = sess.user;
    if (user == null || user == undefined || user.id == null) {
        var json = {
                error: "User unknown",
                data: null
            }
        res.status(404).json(json);
        return;
    }
    
    var date = new Date();
    var day = date.getDate();
    var month = parseInt(date.getMonth()) + 1;
    var year = date.getFullYear();

    if (day < 10) day = "0" + day;
    if (month < 10) month = "0" + month;

    var start = year + "-" + month + "-01";
    var end = year + "-" + month + "-" + day;
    
    var clbk = function(err, rows)
    {
        var json = {};
        if(err)
        {
            json = {
                error: err,
                data: null
            }
        }
        else
        {
            json = {
                error: null,
                data: rows
            }
        }
        res.status(200).json(json);
        return;
    }
   DB_MGR.getMonthPaymentsAndClearance(user.id, start, end, clbk);
});

module.exports = router;