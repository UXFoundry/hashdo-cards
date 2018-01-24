var __e4fraq = {

    requestaquote: {

        onReady: function (c, dc, loc) {
            $card = dc;
            card = c;
            locals = loc;
            importrequestaquote();
        }
    }
};

var $card;
var card;
var locals;

function importrequestaquote() {
    console.log('RAQ CodeBase Imported');
    if (locals) {
        if (locals.stateData) {
            if (locals.stateData.quoted) {
                if (locals.stateData.quoted == true) {
                    console.log(locals);

                    $card.find('.transferFeeValue').val(locals.stateData.transferFeeValue);
                    $card.find('.exchangeRateValue').val(locals.stateData.exchangeRateValue);
                    $card.find('.AmountValue').val(locals.stateData.amountValue);

                    $card.find('.quoteDetails').addClass('hidden');
                    $card.find('.quoteResults').removeClass('hidden');


                    $card.find('.payInCountryCurrencySelect').val(locals.stateData.sourceData);
                    $card.find('.payOutCountryCurrencySelect').val(locals.stateData.destinationData);
                    getCountryPayOutOptions();
                }
                else {
                    $card.find('.payInCountryCurrencySelect').val('30_GBP_GBR');
                    $card.find('.payInCountryCurrencySelect').change();
                    $card.find('.payOutCountryCurrencySelect').val('1_ZAR_ZAF');
                    getCountryPayOutOptions();
                    $card.find('.payOutCountryCurrencySelect').change();
                }
            }
            else {
                $card.find('.payInCountryCurrencySelect').val('30_GBP_GBR');
                $card.find('.payInCountryCurrencySelect').change();
                $card.find('.payOutCountryCurrencySelect').val('1_ZAR_ZAF');
                getCountryPayOutOptions();
                $card.find('.payOutCountryCurrencySelect').change();
            }
        }
        else {
            $card.find('.payInCountryCurrencySelect').val('30_GBP_GBR');
            $card.find('.payInCountryCurrencySelect').change();
            $card.find('.payOutCountryCurrencySelect').val('1_ZAR_ZAF');
            getCountryPayOutOptions();
            $card.find('.payOutCountryCurrencySelect').change();
        }
    }

    else {
        $card.find('.payInCountryCurrencySelect').val('30_GBP_GBR');
        $card.find('.payInCountryCurrencySelect').change();
        $card.find('.payOutCountryCurrencySelect').val('1_ZAR_ZAF');
        getCountryPayOutOptions();
        $card.find('.payOutCountryCurrencySelect').change();
    }



    var over = '<div id="overlay"><img id="loading" src="http://www.exchange4free.com/xandgo/images/loader.gif"></div>';

    function displayLoading() {
        $card.find('.hdc-content').append(over);
    }

    function hideLoading() {
        $('#overlay').remove();
    }


    $card.find('.payOutCountryCurrencySelect').on('change', function () {
        console.log('Fired');
        displayLoading();
        getCountryPayOutOptions();

    });

    $card.find('.getQuote').on('click', function () {
        displayLoading();

        locals.providedAmount = $card.find('.payValue').val();
        locals.quoted = true;

        getQuotationCalculator(function () {
            $card.find('.quoteDetails').addClass('hidden');
            $card.find('.quoteResults').removeClass('hidden');
            hideLoading();
           console.log(locals.quoteData.cashReward);      

            if ((locals.quoteData.cashReward) && (locals.quoteData.cashReward != '0.0')) {
                console.log(locals.quoteData.cashReward);             
                $card.find('.rewardsnotice').removeClass('hidden');

            }

            else {
                $card.find('.rewardsnotice').addClass('hidden');
              



            }

        });

        saveClientState();

    });

    $card.find('.reQuote').on('click', function () {
        locals.quoted = false;
        displayLoading();
        $card.find('.quoteDetails').removeClass('hidden');
        $card.find('.quoteResults').addClass('hidden');
        if (locals.providedAmount)
            $card.find('.payValue').val(locals.providedAmount);

        hideLoading();
        saveClientState();


    });

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


        console.log('RAQ: ' + text);

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



    function getQuotationCalculator(callback) {


        var destinationData = $card.find('.payOutCountryCurrencySelect').val().split('_');
        var destinationCountryCode = destinationData[2];
        var destinationCurrencyCode = destinationData[1];

        var sourceData = $card.find('.payInCountryCurrencySelect').val().split('_');

        var sourceCountryCode = sourceData[2];
        var sourceCurrencyCode = sourceData[1];

        var payinMethodValue = 1;
        var payoutMethodValue = $card.find('.paymethodOutSelect').val();
        var providedAmountOption = 0;
        var providedAmount = $card.find('.payValue').val();


        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/quotationCalculator/', { sourceCountryCode: sourceCountryCode, sourceCurrencyCode: sourceCurrencyCode, destinationCurrencyCode: destinationCurrencyCode, destinationCountryCode: destinationCountryCode, payinMethodValue: payinMethodValue, payoutMethodValue: payoutMethodValue, providedAmountOption: providedAmountOption, providedAmount: providedAmount }, function (err, response) {
            if (response) {
                if (!response.returnData) {
                    hideLoading();
                    console.log(response)
                    showError('An error occured whilst obtaining a quotation from Exchange 4 Free: ' + response.message);
                }
                else {

                    $quoteTimeStamp = response.returnData.TimeStamp;
                    locals.quoteTimeStamp = $quoteTimeStamp;
                    var transferFee = 0;
                    locals.quoteData = response.returnData;
                    if (isNaN(parseFloat(response.returnData.transferFee))) {
                        transferFee += 0;
                    }
                    else {
                        transferFee += parseFloat(response.returnData.transferFee);
                    }
                    if (isNaN(parseFloat(response.returnData.paymentMethodFee))) {
                        transferFee += 0;
                    }
                    else {
                        transferFee += parseFloat(response.returnData.paymentMethodFee);
                    }
                    if (isNaN(parseFloat(response.returnData.destinationBankReceivingFee))) {
                        transferFee += 0;
                    }
                    else {
                        transferFee += parseFloat(response.returnData.destinationBankReceivingFee);
                    }
                    transferFee = transferFee.toFixed(2);
                    var clientExchangeRate = parseFloat(response.returnData.clientExchangeRate).toFixed(4);
                    var amountValue = parseFloat(response.returnData.amount).toFixed(2);
                    locals.transferFeeValue = transferFee;
                    locals.exchangeRateValue = clientExchangeRate;
                    locals.amountValue = amountValue;
                    locals.destinationData = $card.find('.payOutCountryCurrencySelect').val();
                    locals.sourceData = $card.find('.payInCountryCurrencySelect').val();
                    $card.find('.transferFeeValue').val(transferFee);
                    $card.find('.exchangeRateValue').val(clientExchangeRate);
                    $card.find('.AmountValue').val(amountValue);
                    saveClientState();
                    hideLoading();
                    callback();


                }
            }
            else {
                showError('An error occured whilst obtaining a quotation from Exchange 4 Free: ' + err);
                hideLoading();
            }
        });
    }

    function getCountryPayOutOptions() {

        var destinationData = $card.find('.payOutCountryCurrencySelect').val().split('_');
        var destinationCountryCode = destinationData[2];
        var destinationCurrencyCode = destinationData[1];


        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayoutMethodList/', { destinationCountryCode: destinationCountryCode, destinationCurrencyCode: destinationCurrencyCode }, function (err, response) {
            if (response) {
                if (response.returnData) {
                    payOutMethod = $card.find('.paymethodOutSelect');
                    if (payOutMethod[0])
                        payOutMethod[0].options.length = 0;
                    payOutMethod.append($("<option />").val('Default').text('Select Pay Out Method'));
                    response.returnData.forEach(function (entry) {
                        if (entry.payoutMethodName != 'AirTime TopUp') {
                            payOutMethod = $card.find('.paymethodOutSelect');
                            payOutMethod.append($("<option />").val(entry.payoutMethodValue).text(entry.payoutMethodName));
                        }



                    });
                    payOutMethod[0].selectedIndex = 1;
                    payOutMethod.change();
                    $card.find('.payOption').change();

                }
                else {
                    showError('An error occured whilst attempting to obtain the country pay out options via the web service: ' + response.message);
                }
                hideLoading();


            }
            else {
                //showError('An error occured whilst attempting to obtain the country pay out options: ' + err);
                hideLoading();
            }
        });
    }

}

