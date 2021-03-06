function submitAddForm(_id) {
    var date = $("#add-date").val();
    var motive = $("#add-motive").val();
    var media = $("#add-media").val();
    var amount = $("#add-amount").val();

    var error = false;
    var err_message = "Merci de renseigner correctement les champs suivants : <br /><ul>";

    if (date == "" || date == null || date == undefined) {
        error = true;
        err_message += "<li>date</li>";
    }

    if (motive == "" || motive == null || motive == undefined) {
        error = true;
        err_message += "<li>motif</li>";
    }

    if (media == "" || media == null || media == undefined || media == "none") {
        error = true;
        err_message += "<li>moyen de paiement</li>";
    }

    if (amount == "" || amount == null || amount == undefined || isNaN(parseFloat(amount))) {
        error = true;
        err_message += "<li>montant</li>";
    }
    else {
        amount = amount.replace(',', '.');
    }

    err_message += "</ul>";

    if (error == true) {
        $("#div-error").html(err_message);
        $("#div-error").removeClass('hidden');
        return;
    }

    $("#div-error").html("");
    $("#div-error").addClass('hidden');

    $.ajax({
        type: "GET",
        async: false,
        url: 'add_payment',
        data: {
            date: date,
            motive: motive,
            media: media,
            amount: parseFloat(amount),
            id: _id
        }
    })
    .done(function(res) {
        var date = new Date();
        var day = date.getDate();
        var month = parseInt(date.getMonth()) + 1;
        var year = date.getFullYear();

        if (month < 10) month = "0" + month;
        if (day < 10)   day = "0" + day;

        var str_date = year + "-" + month + "-" + day;

        $('#paymentModal').modal('toggle');
        $("#add-date").val(str_date);
        $("#add-motive").val('');
        $("#add-media").val('none');
        $("#add-amount").val('');
        
        $("#payments-div").html(res);
    })
    .fail(function() {
        alert("Une erreur est survenue...");
    });
}