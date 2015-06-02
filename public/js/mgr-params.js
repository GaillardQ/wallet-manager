function addOrUpdateUserBudget()
{
    $("#success-budget").addClass("hidden");
    $("#error-budget").addClass("hidden");
    
    var budget = $("#month-budget").val();
    budget = parseFloat(budget.replace(',', '.'));
    budget = Math.round(budget*100)/100;
    $("#month-budget").val(budget);
    
    if(isNaN(budget))
    {
        $("#error-budget").removeClass("hidden");
        $("#error-budget").html("Le budget doit être un nombre.");
        return;
    }
    
    $.ajax({
        type: "GET",
        async: true,
        dataType: "json",
        cache: false,
        url: '/manager/params/save_budget',
        data: {
            budget: budget
        }
    })
    .done(function(res) {
        clbk_addOrUpdateUserBudget({action:true});
    })
    .fail(function() {
        clbk_addOrUpdateUserBudget({action:false});
    });
}

function clbk_addOrUpdateUserBudget(_res)
{
    $("#success-budget").addClass("hidden");
    $("#error-budget").addClass("hidden");
    
    if(_res.action)
    {
        $("#success-budget").removeClass("hidden");
        $("#success-budget").html("Le budget a été mis à jour.");
    }
    else
    {
        $("#error-budget").removeClass("hidden");
        $("#error-budget").html("Une erreur est survenue lors de la modification du budget.");
    }
}

function updatePwd()
{
    $("#success-pwd").addClass("hidden");
    $("#error-pwd").addClass("hidden");
    
    var old_pwd = $("#old-password").val();
    var new_pwd = $("#new-password").val();
    
    $.ajax({
        type: "POST",
        async: true,
        dataType: "json",
        cache: false,
        url: '/manager/params/update_pwd',
        data: {
            old_pwd: old_pwd,
            new_pwd: new_pwd
        }
    })
    .done(function(res) {
        clbk_updatePwd({action:true});
    })
    .fail(function(res) {
        res.action = false;
        clbk_updatePwd(res);
    });
}

function clbk_updatePwd(_res)
{
    $("#success-pwd").addClass("hidden");
    $("#error-pwd").addClass("hidden");
    
    if(_res.action)
    {
        $("#success-pwd").removeClass("hidden");
        $("#success-pwd").html("Le mot de passe a été mis à jour.");
    }
    else
    {
        $("#error-pwd").removeClass("hidden");
        if(_res.responseJSON.type == 'pass')
        {
            $("#error-pwd").html("L'ancien mot de passe n'est pas correct.");
        }
        else
        {
            $("#error-pwd").html("Une erreur est survenue lors de la modification du mot de passe.");   
        }
    }
}