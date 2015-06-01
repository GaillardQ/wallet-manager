$(document).ready(function() {
    getGraphsData();
});

function getGraphsData()
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
        createMonthClearanceGraph(res);
    })
    .fail(function() {
        createMonthClearanceGraph({data: null, error:true});
    });
    
    $.ajax({
        type: "GET",
        async: true,
        dataType: "json",
        cache: false,
        url: '/manager/graph/month_payments_byday',
        data: {
        }
    })
    .done(function(res) {
        createMonthPaymentAmountGraph(res);
    })
    .fail(function() {
        createMonthPaymentAmountGraph({data: null, error:true});
    });
}

function createMonthClearanceGraph(res)
{
    
    if(res.error != null)
    {
        $("#error-month-clearance").removeClass("hidden");
        $("#error-month-clearance").html("Une erreur est survenue.");
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
        
        var colors, data;
        
        var solde = clearance - payments;
        if(solde < 0)
        {
            colors = ['#e51c23'];
            data = [{ label: "Dépenses", value: payments }];
        }
        else
        {
            colors = ['#ff9800', '#4caf50']
            data = [
                { label: "Dépenses",value: payments }, 
                { label: "Solde", value: solde }
            ];
        }
        
        Morris.Donut({
            element: 'graph-month-clearance',
            data: data,
            colors:colors,
            resize: true
        });
    }
}

function createMonthPaymentAmountGraph(res)
{
    if(res.error != null)
    {
        $("#error-payments-amount").removeClass("hidden");
        $("#error-payments-amount").html("Une erreur est survenue.");
        
        $("#error-payments-number").removeClass("hidden");
        $("#error-payments-number").html("Une erreur est survenue.");
        
        $("#error-payments-others").removeClass("hidden");
        $("#error-payments-others").html("Une erreur est survenue.");
    }
    else
    {
        var data = new Array();
        
        var avg_total = 0;
        var nb_total = 0;
        var sum_total = 0;
        for(var i in res.data)
        {
            var d = res.data[i];
            
            var date = d.date;
            var sum = d.sum;
            var nb = d.nb;
            var avg = 0;
            
            nb_total += nb;
            sum_total += sum;
            
            if(nb != 0)
            {
                avg = Math.round(sum/nb*100)/100;
            }
            var o = {
                date: date,
                sum: sum,
                avg: avg,
                nb: nb
            };
            data.push(o);
        }
        
        if(nb_total != 0)
        {
            avg_total = Math.round(sum_total/nb_total*100)/100;
        }
        
        Morris.Line({
            // ID of the element in which to draw the chart.
            element: 'graph-payments-amount',
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            data: data,
            // The name of the data record attribute that contains x-visitss.
            xkey: 'date',
            // A list of names of data record attributes that contain y-visitss.
            ykeys: ['sum', 'avg'],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            labels: ['Somme (€)', 'Moyenne (€)'],
            // Disables line smoothing
            smooth: false,
            resize: true
        });
        
        Morris.Bar({
            // ID of the element in which to draw the chart.
            element: 'graph-payments-number',
            // Chart data records -- each entry in this array corresponds to a point on
            // the chart.
            data: data,
            // The name of the data record attribute that contains x-visitss.
            xkey: 'date',
            // A list of names of data record attributes that contain y-visitss.
            ykeys: ['nb'],
            // Labels for the ykeys -- will be displayed when you hover over the
            // chart.
            labels: ['Nombre d\'achats'],
            barRatio: 0.4,
            xLabelAngle: 35,
            hideHover: 'auto',
            resize: true
        });
        
        $("#avg_payments").html(avg_total+" €");
        $("#nb_payments").html(nb_total+" €");
    }
}