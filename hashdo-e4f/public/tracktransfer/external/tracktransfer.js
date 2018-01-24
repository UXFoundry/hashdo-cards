var __e4ftracktransfer = {

    tracktransfer: {

        onReady: function (c, dc, loc) {
            $card = dc;
            card = c;
            locals = loc;
            importtracktransfer();
        }
    }
};

var $card;
var card;
var locals;

function importtracktransfer() {
    console.log('Query Transaction Imported');
    console.log($card);
    if (locals.stateData) {
        console.log("State Data Found");
        console.log(locals);
        var preCard = locals.card;       
        locals = locals.stateData;
        locals.card = preCard;
    }

    var over = '<div id="overlay"><img id="loading" src="http://www.exchange4free.com/xandgo/images/loader.gif"></div>';

    function displayLoading() {
        $card.find('.hdc-content').append(over);
    }

    function hideLoading() {
        $('#overlay').remove();
    }


    //refreshTransaction

    $card.find('.refreshTransaction').on('click', function () {
        displayLoading();

        locals.transactionID = locals.transactionDetails.transactionID;
        getTransactionDetails(function (result) {
            if (result) {
                $card.find('.queryTransactionForm').addClass('hidden');
                $card.find('.transactiondetails').removeClass('hidden');
                populateTransactionDetails();
            }


        })

        saveClientState();

    });

    $card.find('.queryTransactionbtn').on('click', function () {
        displayLoading();
        console.log($card);
        console.log(locals.card);
        locals.transactionID = $card.find('.transactionid').val().replace(/\D/g, '');
        getTransactionDetails(function (result) {
            if (result) {
                $card.find('.queryTransactionForm').addClass('hidden');
                $card.find('.transactiondetails').removeClass('hidden');
                populateTransactionDetails();
            }
        })

        saveClientState();

    });

    function round(value, decimals) {
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals).toFixed(decimals);
    }

    function populateTransactionDetails() {
        $card.find('.transactionreference').val(locals.transactionDetails.transactionReference);

        if (locals.transactionDetails.transactionDate.length > 10)
            $card.find('.transactiondate').val(locals.transactionDetails.transactionDate.substring(0, 10));
        else
            $card.find('.transactiondate').val(locals.transactionDetails.transactionDate);
        $card.find('.payincurrency').val(locals.transactionDetails.sourceCurrencyName);
        $card.find('.payinamount').val(round(locals.transactionDetails.amountPaidIn, 2));
        $card.find('.beneficiaryName').val(locals.transactionDetails.beneficiaryName);

        $card.find('.beneficiaryCurrency').val(locals.transactionDetails.destinationCurrencyName);
        $card.find('.amountPaidOut').val(round(locals.transactionDetails.amountPaidOutToBeneficiary, 2));
        if (locals.transactionDetails.transactionTypeName == 'AirTime TopUp')
            $card.find('.exchangerate').val('Not Applicable');
        else
            $card.find('.exchangerate').val(locals.transactionDetails.clientExchangeRate);

        $card.find('.transactionFee').val(round(locals.transactionDetails.transferFee, 2));

        var transactionStatus = locals.transactionDetails.transactionStatus;
        if (transactionStatus == 'PENDING') {
            $card.find('.transactionPending').removeClass('hidden');
            $card.find('.transactionReceived').addClass('hidden');
            $card.find('.transactionCancelled').addClass('hidden');
            $card.find('.transactionComplete').addClass('hidden');
        }

        if (transactionStatus == 'RECEIVED') {
            $card.find('.transactionPending').addClass('hidden');
            $card.find('.transactionReceived').removeClass('hidden');
            $card.find('.transactionCancelled').addClass('hidden');
            $card.find('.transactionComplete').addClass('hidden');
        }

        if (transactionStatus == 'CANCELLED') {
            $card.find('.transactionPending').addClass('hidden');
            $card.find('.transactionReceived').addClass('hidden');
            $card.find('.transactionCancelled').removeClass('hidden');
            $card.find('.transactionComplete').addClass('hidden');
        }

        if (transactionStatus == 'COMPLETE') {
            $card.find('.transactionPending').addClass('hidden');
            $card.find('.transactionReceived').addClass('hidden');
            $card.find('.transactionCancelled').addClass('hidden');
            $card.find('.transactionComplete').removeClass('hidden');
        }

    }

    function getTransactionDetails(callback) {


        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getUserTransactionDetails/', { transactionID: locals.transactionID }, function (err, response) {
            if (response) {
                if (response.returnData) {

                    if (response.returnData[0]) {
                        locals.transactionDetails = response.returnData[0];
                        saveClientState();
                    }
                    callback(true);
                }
                else {
                    showError('An error occured whilst attempting to obtain the transaction details: ' + response.message);
                    callback(false);
                }
                hideLoading();


            }
            else {
                //showError('An error occured whilst attempting to obtain the country pay out options: ' + err);
                hideLoading();
                callback(false);
            }
        });

    }


    function saveClientState(progressState) {

        locals.lastSaveDateTimeStamp = new Date().getTime();
        card.state.save({
            localData: locals
        });


    }

    function hideError() {
        $card.find('.statusLogText').val('');
    }

    var $modal;

    function showError(text) {


        console.log('TrackTransfer: ' + text);

        if (text.includes('obtain the country pay out options')) {

        }
        else {
            $modal = card.modal.open('<br><div class="hdc-error-text">' + text + '</div>' + '<div class="hdc-errormodal-footer"><br><div class="hdc-errormodal-done" style="display: block;"><button type="button">OK</button></div></div>');

            $ok = $modal.find('.hdc-errormodal-done');
            $ok.on('click', function () {
                card.modal.close();

            });

        }



    }





}