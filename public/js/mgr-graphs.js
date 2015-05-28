$(document).ready(function() {
    createMonthClearanceGraph();
});

function createMonthClearanceGraph()
{
    $.ajax({
        type: "GET",
        async: true,
        dataType: "json",
        cache: false,
        url: '/manager/graph/month_clearance',
        data: {
        }
    })
    .done(function(res) {
        if(res.error != null)
        {
            $("#error-month-clearance").removeClass("hidden");
            $("#error-month-clearance").html("Une erreur est survenue : "+res.error);
        }
        else
        {
            var d = res.data[0];
            var clearance = d.clearance;
            var payments = d.payments;
            
            if(payments == null || payments == undefined)
            {
                payments = 0;    
            }
            
            if(clearance == null || clearance == undefined || clearance == 0)
            {
                clearance = 0;
            }
            
            Morris.Donut({
                element: 'graph-month-clearance',
                data: [{
                    label: "Dépenses",
                    value: payments
                }, {
                    label: "Solde",
                    value: clearance
                }],
                colors:['#ff9800', '#4caf50'],
                resize: true
            });
            
        }
    })
    .fail(function() {
        $("#error-month-clearance").removeClass("hidden");
        $("#error-month-clearance").html("Une erreur est survenue.");
    });
}