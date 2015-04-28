$(document).ready(function() {
    initIndex();
});

var m_clearance = null;
var m_payments = [];
var m_found = false;
var m_date = null;
var m_year = null;
var m_month = null;
var m_id = 0;
var m_cpt_search = 0;

function initIndex() {
    getMonthData(1, initIHM);
}

function getMonthData(_id, _callback) {
    var today = new Date();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();

    if (month < 10) {
        month = "0" + month;
    }

    m_date = month + "-" + year;

    getData(_id, year, month, initIHM, initIHM);
}

function initIHM() {
    $("#div-no-file").addClass("hidden");
    $("#div-zero-file").addClass("hidden");

    if (m_found == true) {
        $("#btn-add-payment").removeClass("hidden");
        initClearance();
    } else {
        $("#btn-add-payment").addClass("hidden");
    }
    initTable();
}

function initClearance() {
    $("#clearance-good").addClass('hidden');
    $("#clearance-error").addClass('hidden');
    $("#clearance-bad").addClass('hidden');

    if (m_clearance === null) {
        $("#clearance-error").html('ERREUR');
        $("#clearance-error").removeClass('hidden');
    }
    else if (m_clearance >= 0) {
        $("#clearance-good").html(m_clearance + " €");
        $("#clearance-good").removeClass('hidden');
    }
    else {
        $("#clearance-bad").html(m_clearance + " €");
        $("#clearance-bad").removeClass('hidden');
    }
}

function initTable() {
    if (m_found == true) {
        if (m_payments.length == 0) {
            var html = "Aucune transaction trouvée pour le mois de <b>" + m_date + "</b>.";
            $("#div-no-payments").html(html);
            $("#div-no-payments").removeClass("hidden");
        }
        else {
            buildPaymentsTable();
            $("#div-no-file").addClass("hidden");
            $("#div-no-payments").addClass("hidden");
        }
    }
    else {
        var html = 'Aucune donnée trouvée pour le mois de <b>' + m_date + '</b>.<br /><br />';
        html += 'Voulez vous afficher les données pour le mois précédent ?';
        $("#div-no-file-text").html(html);
        $("#div-no-file").removeClass("hidden");
    }
}

function buildPaymentsTable() {
    var html = "";
    var total = 0;
    for (var i in m_payments) {
        var p = m_payments[i];

        total += parseFloat(p.price);

        html += "<tr>";
        html += "<td class='align-center'>" + p.date + "</td>";
        html += "<td class='table-motive'>" + p.motive + "</td>";
        html += "<td class='hidden-xs align-center'>" + p.type + "</td>";
        html += "<td class='align-center'>" + p.price + " €</td>";

        html += "</tr>";
    }

    total += " €";

    $("#payments-body").html(html);
    $("#payments-total").html(total);

    $("#payments-table").removeClass("hidden");
}

function launchSearchOld(_id) {
    $("#div-no-file").addClass("hidden");

    var today = new Date();
    var month = parseInt(m_month);
    var year = parseInt(m_year);

    if (month < 10) {
        month = "0" + month;
    }

    m_date = month + "-" + year;

    m_cpt_search = 1;

    getData(_id, year, month, initIHM, searchOlder);

}

function searchOlder() {
    var month = parseInt(m_month) - 1;
    var year = m_year;

    if (month == 0) {
        month = 12;
        year = parseInt(year) - 1;
    }
    else if (month < 10) {
        month = "0" + month;
    }

    m_date = month + "-" + year;

    m_cpt_search++;

    if (m_cpt_search < 6) {
        getData(m_id, year, month, initIHM, searchOlder);
    }
    else {
        $("#div-zero-file").removeClass('hidden');
    }
}

function getData(_id, _year, _month, _success_cbk, _fail_cbk) {
    m_id = _id;
    m_month = _month;
    m_year = _year;

    var url = "files/" + _id + "/" + _year + "-" + _month + ".json";
    $.getJSON(url, function(data) {
            m_found = true;

            if (data.clearance) {
                m_clearance = data.clearance;
            }

            if (data.payments && data.payments.length > 0) {
                m_payments = data.payments;
            }

            _success_cbk();
        })
        .fail(function() {
            _fail_cbk();
        });
}

function createFile(_id) {
    $.ajax({
        type: "GET",
        dataType: 'json',
        async: false,
        url: 'create_file',
        data: {
            id: _id
        },
        success: function() {
            initIndex();
        },
        failure: function() {
            alert("Une erreur est survenue...");
        }
    });
}

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
        dataType: 'json',
        async: false,
        url: 'add_payment',
        data: {
            date: date,
            motive: motive,
            media: media,
            amount: parseFloat(amount),
            id: _id
        },
        success: function() {
            var date = new Date();
            var day = date.getDate();
            var month = parseInt(date.getMonth()) + 1;
            var year = date.getFullYear();

            if (month < 10) month = "0" + month;

            var str_date = day + "-" + month + "-" + year;

            $('#paymentModal').modal('toggle');
            $("#add-date").val('');
            $("#add-motive").val('');
            $("#add-media").val('none');
            $("#add-amount").val(str_date);
            initIndex();
        },
        failure: function() {
            alert("Une erreur est survenue...");
        }
    });
}