var express = require('express');
var router = express.Router();

var sess = null;

/********************************************
 * Données pour le graphe des dépenses      *
 * du mois par rapport au solde             * 
 * URL : [/clearance]                   *
 ********************************************/
router.get('/clearance', function(req, res, next) {
    res.status(200).json({
            message: 'List of spend'
        });
        return;
});

module.exports = router;