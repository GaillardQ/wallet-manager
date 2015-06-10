function getPaymentsMonth()
{
    $("#error-payments").addClass("hidden");
    
    var month = $("#month-select").val();
    if(month == "none") return;
    
    $.ajax({
        type: "GET",
        async: true,
        cache: false,
        url: '/manager/file',
        data: {
            month: month
        }
    })
    .done(function(res) {
        displayFileContent(res);
    })
    .fail(function(res) {
        displayFileContentError();
    });
}

function displayFileContent(_content)
{
    $("#payments-list").html(_content);
}

function displayFileContentError()
{
    $("#error-payments").removeClass("hidden");
}

function updateBudget(month)
{
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
        url: '/manager/file/update_budget',
        data: {
            budget: budget,
            month: month
        }
    })
    .done(function(res) {
        clbk_addOrUpdateUserBudget({action:true});
    })
    .fail(function() {
        clbk_addOrUpdateUserBudget({action:false});
    });
}