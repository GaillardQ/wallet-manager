var express = require('express');
var router = express.Router();

var sess = null;
var path = null;

function initPath(_host)
{
    if( _host === "wallet-manager-quenting.c9.io:80" )
    {
        path = "../public/files";
    }
    else if( _host == "wallet-mgr.quentin.gaillard.fr" )
    {
        path = "public/files";
    }
}

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
    
    if(path == null)
    {
        initPath(req.headers.host);
    }
    
    var id = 1;
    
    var date = new Date();
    var month = parseInt(date.getMonth()) + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;

    var file = year + "-" + month + ".json";

    var clbk_ok = function(_data)
    {
        res.render('manager/index.html.twig', {
            data: _data
        });
    }
    
    var clbk_err = function(_err)
    {
        res.render('manager/index.html.twig', {
            error: _err
        });
    }
    
    readFile(path + "/" + id + "/" + file, clbk_ok, clbk_err);
    
});

function readFile(_name, _callback_ok, _callback_err)
{
    
    var fs = require('fs');
    fs.readFile(_name, function(err, data) {
        if (err) {
            _callback_err(err);
        }
        else
        {
            _callback_ok(data);
        }
    });
}

router.get('/file', function(req, res, next) {
    sess = req.session;

    var is_logged = sess.is_logged || false;
    if (!is_logged) {
        res.writeHead(302, {
            'Location': '/login'
        });
        res.end();
        return;
    }
    
    if(path == null)
    {
        initPath(ENV);
    }
    
    var id = 1;
    
    var date = new Date();
    var month = parseInt(date.getMonth()) + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;

    var file = year + "-" + month + ".json";

    var fs = require('fs');
    fs.readFile(path + "/" + id + "/" + file, function(err, data) {
        var error = "";
        if (err) {
            error = "Aucun fichier n'est disponible pour <b>"+month+"-"+year+"</b>.";
        }
        
        res.render('manager/file_content.html.twig', {
            error: error,
            data: data
        });
    });
    
});

module.exports = router;