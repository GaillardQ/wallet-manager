var express = require('express');
var md5 = require('MD5');
var router = express.Router();

var sess = null;

/********************************************
 * Sauvegarde la nouvelle valeur            *
 * du budget mensuel                        * 
 * URL : [/save_budget]                     *
 ********************************************/
router.get('/save_budget', function(req, res, next) {
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
    
    var clbk = function(err, rows)
    {
        if(err) 
        {
            res.status(500).json(err);
            return;
        }
        var clbk2 = function(err)
        {
            if(err) 
            {
                res.status(500).json(err);
                return;
            }
            else
            {
                res.status(200).json({res: 'ok'});  
            }
        }
        var b = req.query.budget;
        if(rows.length > 0)
        {
            DB_MGR.updateUserBudget(user.id, b, clbk2);
        }
        else
        {
            DB_MGR.insertUserBudget(user.id, b, clbk2);
        }
    }
    DB_MGR.getUserBudget(sess.user.id, clbk);
});


/********************************************
 * Met à jour le mot de passe utilisateur   * 
 * URL : [/update_pwd]                      *
 ********************************************/
router.post('/update_pwd', function(req, res, next) {
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
    
    var old_pwd = req.body.old_pwd;
    old_pwd = md5(md5(old_pwd) + md5(salt));
    
    var new_pwd = req.body.new_pwd;
    new_pwd = md5(md5(new_pwd) + md5(salt));
    
    var clbk = function(err, rows)
    {
        if(err) 
        {
            res.status(500).json(err);
            return;
        }
        
        if(rows.length == 0) 
        {
            res.status(500).json({type:'pass'});
            return;
        }
        
        var clbk2 = function(err)
        {
            if(err) 
            {
                res.status(500).json(err);
                return;
            }
            else
            {
                res.status(200).json({res: 'ok'});  
            }
        }
        DB_MGR.updateUserPwd(user.id, new_pwd, clbk2);
    }
    DB_MGR.checkLogin(old_pwd, clbk)
});

module.exports = router;