var __e4fsendAirtime = {

	sendAirtime: {

		onReady: function (c, dc, loc) {
			$card = dc;
			card = c;
			locals = loc;
			importAirtime();
		}
    }

};

var $card;
var card;
var locals;

function importAirtime() {



	var debug = true;

	//processCreditCardPayment();

	if (locals.stateData) {
		var currentTime = new Date().getTime();
		if (locals.stateData.lastSaveDateTimeStamp) {
			if (locals.stateData.completed) {
				//$card.find('.cardCompleted').removeClass('hidden');
				var preCard = locals.card;
				locals = locals.stateData;
				locals.card = preCard;
				populateCompletionForm();
				hideTransactionUI();
			}
			else if (((currentTime - locals.stateData.lastSaveDateTimeStamp) > 600000) && (!locals.stateData.completed)) {
				$card.find('.cardExpired').removeClass('hidden');
				hideTransactionUI();
			}
			else if ((currentTime - locals.stateData.lastSaveDateTimeStamp) < 600000) {
				$card.find('.payInCountryBlock').removeClass('hidden');
				if ((locals.stateData.acceptedQuote) && (!locals.stateData.completed)) {
					if ($card.find('.payInCountrySelect')[0])
						$card.find('.payInCountrySelect')[0].options.length = 0;
					$card.find('.payInCountrySelect').append($("<option />").val(locals.stateData.sourceCountryCode).text(locals.stateData.sourceCountryCodeText));;

					if ($card.find('.payInCurrencySelect')[0])
						$card.find('.payInCurrencySelect')[0].options.length = 0;
					$card.find('.payInCurrencyBlock').removeClass('hidden');
					$card.find('.payInCurrencySelect').append($("<option />").val(locals.stateData.sourceCurrencyCode).text(locals.stateData.sourceCurrencyCodeText));;

					if ($card.find('.paymethodInSelect')[0])
						$card.find('.paymethodInSelect')[0].options.length = 0;
					$card.find('.payInMethodBlock').removeClass('hidden');
					$card.find('.paymethodInSelect').append($("<option />").val(locals.stateData.payinMethodValue).text(locals.stateData.payinMethodValueText));;

					if ($card.find('.payOutCountrySelect')[0])
						$card.find('.payOutCountrySelect')[0].options.length = 0;
					$card.find('.payOutCountryBlock').removeClass('hidden');
					$card.find('.payOutCountrySelect').append($("<option />").val(locals.stateData.destinationCountryCode).text(locals.stateData.destinationCountryCodeText));;


			
					var preCard = locals.card;
					locals = locals.stateData;
					locals.card = preCard;
					getBeneficiaryListForUserAndCountry();
				}
			}
			else {
				$card.find('.payInCountryBlock').removeClass('hidden');
				saveClientState();
				getUserInformation(function () {
					$card.find('.payInCountrySelect').val(locals.userCountry);
					if ($card.find('.payInCountrySelect')[0]) {
						if ($card.find('.payInCountrySelect')[0].selectedIndex == -1) {
							$card.find('.payInCountrySelect')[0].selectedIndex = 0;
						}
					}

					else {
						$card.find('.payInCountrySelect').val(locals.userCountry).change();
					}

					$card.find('.payInCountrySelect').val(locals.userCountry).change();
					saveClientState();

				});
			}
		}

		else {
			$card.find('.payInCountryBlock').removeClass('hidden');
			saveClientState();
			getUserInformation(function () {
				if (locals.userCountry != 'ZAF')
					$card.find('.payInCountrySelect').val(locals.userCountry);
				if ($card.find('.payInCountrySelect')[0]) {
					if ($card.find('.payInCountrySelect')[0].selectedIndex == -1) {
						$card.find('.payInCountrySelect')[0].selectedIndex = 0;
					}
				}

				else {
					if (locals.userCountry != 'ZAF')
						$card.find('.payInCountrySelect').val(locals.userCountry).change();
				}
				if (locals.userCountry != 'ZAF')
					$card.find('.payInCountrySelect').val(locals.userCountry).change();
				saveClientState();

			});


		}
	}

	else {
		$card.find('.payInCountryBlock').removeClass('hidden');

		getUserInformation(function () {
			if (locals.userCountry == 'ZAF') {

			}
			else {
				$card.find('.payInCountrySelect').val(locals.userCountry);

			}

			if ($card.find('.payInCountrySelect')[0]) {
				if ($card.find('.payInCountrySelect')[0].selectedIndex == -1) {
					$card.find('.payInCountrySelect')[0].selectedIndex = 0;
				}
			}

			else {
				if (locals.userCountry != 'ZAF')
					$card.find('.payInCountrySelect').val(locals.userCountry).change();
			}
			if (locals.userCountry != 'ZAF')
				$card.find('.payInCountrySelect').val(locals.userCountry).change();
			saveClientState();

		});
	}

	var over = '<div id="overlay"><img id="loading" src="http://www.exchange4free.com/xandgo/images/loader.gif"></div>';

	prePopulateData();

	function hideTransactionUI() {
		$card.find('.payInCountryBlock').addClass('hidden');
		$card.find('.payInCurrencyBlock').addClass('hidden');
		$card.find('.payInMethodBlock').addClass('hidden');
		$card.find('.payOutCountryBlock').addClass('hidden');
	
		$card.find('.payOptionBlock').addClass('hidden');
		$card.find('.getQuoteBlock').addClass('hidden');
		$card.find('.quoteResults').addClass('hidden');
		$card.find('.acceptQuote').addClass('hidden');
		$card.find('.beneficiary').addClass('hidden');
		$card.find('.beneficiaryAccept').addClass('hidden');
		$card.find('.beneficiaryConfirmation').addClass('hidden');
		$card.find('.finalTransferReason').addClass('hidden');
		$card.find('.finalSourceofFunds').addClass('hidden');
		$card.find('.termsandConditions').addClass('hidden');
		$card.find('.paymentDetails').addClass('hidden');
		$card.find('.airtimeOptions').addClass('hidden');
		

		$card.find('.beneficiaryPayOutOptions').addClass('hidden');
		$card.find('.beneficiaryPayOutOptionsBank').addClass('hidden');

		$card.find('.beneficiaryPayOutOptionsCash').addClass('hidden');
		$card.find('.paymentDetails').addClass('hidden');


	}

	function removeNullsInObject(obj) {
        if (typeof obj === 'string') { return; }
        $.each(obj, function (key, value) {
            if (value === "" || value === null) {
                delete obj[key];
            } else if ($.isArray(value)) {
                if (value.length === 0) { delete obj[key]; return; }
                $.each(value, function (k, v) {
                    removeNullsInObject(v);
                });
            } else if (typeof value === 'object') {
                if (Object.keys(value).length === 0) {
                    delete obj[key]; return;
                }
                removeNullsInObject(value);
            }
        });
    }

	function postDebugMessage(message) {
		/*
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/postDebugMessage/', { message: message }, function (err, response) {
			if (response) {
			}
		});
*/

	}


	function saveClientState(progressState) {

		console.log('SavingClientState');
		//console.log(locals);

		if (locals) {
			//removeNullsInObject(locals);

			locals.lastSaveDateTimeStamp = new Date().getTime();
			card.state.save({
				localData: locals
			});


		}

	}

	function resetClientState() {
		locals = '';
		locals.lastSaveDateTimeStamp = new Date().getTime();
		card.state.save({
			localData: locals
		});
	}


	var allCountries;

	function sortAllCountriesbyName(x, y) {
		return ((x.countryName == y.countryName) ? 0 : ((x.countryName > y.countryName) ? 1 : -1));
	}


	$card.find('.beneficiaryFundsOwner').on('change', function () {
		displayLoading();

		if ($card.find('.beneficiaryFundsOwner').val() == 'no') {
			$card.find('.beneficiaryFundsOwnerInformation').removeClass('hidden');
			locals.fundsOwner = false;
		}
		else {

			$card.find('.beneficiaryFundsOwnerInformation').addClass('hidden');
			locals.fundsOwner = true;
		}

		hideLoading();

		saveClientState();



	});


	function prePopulateData() {
		getUserInformation(function () { });
		//getAllCountryListing();

	}

	var allCountryList;
	function getAllCountryList(callback) {
        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getAllCountryList/', {}, function (err, response) {
            if (response) {
                if (response.returnData) {
                    allCountryList = response.returnData;
                    callback();
                }
                else {
                    callback();
                }

            }
            else {
                callback();

            }
        });

    }

	function updateSelectedCountryInformation() {
        getAllCountryList(function () {
            var selectedContryCode = $card.find('.beneficiarycountrySelect').val();

            allCountryList.forEach(function (entry) {
                if (entry.countryCode == selectedContryCode) {
                    console.log(entry);
                    selectedCountryInformation = entry;
                    $card.find('.telephoneintltxt').val('Dialling Code: +' + entry.dialingCode);
                    console.log($card.find('.telephoneintltxt').val());
                }
            });

        })
    }




	$card.find('.payInCountrySelect').on('change', function () {

		displayLoading();
		getClientIP();
		if ($card.find('.payInCountrySelect').val()) {
			if ($card.find('.payInCountrySelect').val() != 'Default') {
				getCountryPayInCurrency($card.find('.payInCountrySelect').val());
				locals.sourceCountryCode = $card.find('.payInCountrySelect').val();
				var selectedIndex = $card.find('.payInCountrySelect')[0].options.selectedIndex;
				locals.sourceCountryCodeText = $card.find('.payInCountrySelect')[0][selectedIndex].text;
				saveClientState();
				$card.find('.payInCurrencyBlock').removeClass('hidden');
			}
			else {
				hideLoading();
			}
		}
		else {
			hideLoading();
		}



	});
	//paymethodInSelect
	$card.find('.paymethodInSelect').on('change', function () {
		displayLoading();
		locals.payinMethodValue = $card.find('.paymethodInSelect').val();
		$card.find('.payOutCountryBlock').removeClass('hidden');
		var selectedIndex = $card.find('.paymethodInSelect')[0].options.selectedIndex;
		locals.payinMethodValueText = $card.find('.paymethodInSelect')[0][selectedIndex].text;
		hideLoading();
		saveClientState();


	});
	//payOption





	$card.find('.telephonetxt').on('keyup', function () {
		var mobileNumber = '+' + selectedCountryInformation.dialingCode;
		mobileNumber += $card.find('.telephonetxt').val();
		$card.find('.telephoneMSISDN').val(mobileNumber);



	});

	$card.find('.getAirtimeOptions').on('click', function () {
		console.log('Getting Airtime Options');
		displayLoading();

		var requestData = {

			destinationMsisdn: $card.find('.telephoneMSISDN').val(),
			sourceCurrencyCode: locals.sourceCurrencyCode,
			sourceCountryCode: locals.sourceCountryCode,
			payinMethodValue: locals.payinMethodValue,
			clientIpAddress: locals.clientIPAddr
		}

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getAirtimeVoucherDetails/', requestData, function (err, response) {
			if (response) {

				if (response.returnData) {
					locals.timeStamp = response.TimeStamp;
					locals.airtimeOptions = response.returnData;
					console.log(response.returnData);

					if ($card.find('.airtimeOptionsSelect')[0])
						$card.find('.airtimeOptionsSelect')[0].options.length = 0;

					airtimeOptionsSelect = $card.find('.airtimeOptionsSelect');
					airtimeOptionsSelect.append($("<option />").val('Default').text('Select Airtime Value'));
					response.returnData.forEach(function (entry) {
						var payInValue = parseFloat(entry.sourceCurrencyPrice);
						var text = entry.destinationAirtimeValue + ' ' + entry.destinationCurrencyCode + ': ' + payInValue.toFixed(2) + ' ' + entry.sourceCurrencyCode
						airtimeOptionsSelect = $card.find('.airtimeOptionsSelect');
						airtimeOptionsSelect.append($("<option />").val(entry.destinationAirtimeValue).text(text));
					})

					$card.find('.airtimeOptions').removeClass('hidden');

					hideLoading();

				}
				else {
					hideLoading();
					showError('An error has occured attempting to obtain the airtime options, please contact us.');
					console.log(response);
				}

			}
			else {
				hideLoading();
				showError('An error has occured attempting to obtain the airtime options, please contact us.');
			}

			
		});

		



	});





	$card.find('.airtimeOptionsSelect').on('change', function () {
		var selectedIndex = $card.find('.airtimeOptionsSelect')[0].options.selectedIndex - 1;
		console.log(locals.airtimeOptions[selectedIndex]);
		locals.selectedAirTimeOption = locals.airtimeOptions[selectedIndex];
		$card.find('.beneficiaryConfirmation').removeClass('hidden');


		locals.beneficiaryFirstName = $card.find('.firstNametxt').val();
		locals.beneficiaryLastName = $card.find('.lastNametxt').val();
		locals.msisdn = $card.find('.telephoneMSISDN').val();
		locals.amountToBePaid = locals.selectedAirTimeOption.sourceCurrencyPrice;
		locals.airtimeVoucher = locals.selectedAirTimeOption.destinationAirtimeValue;

		$card.find('.beneficiaryFirstName').val(locals.beneficiaryFirstName);
		$card.find('.beneficiaryLastName').val(locals.beneficiaryLastName);
		$card.find('.beneficiaryMSISDN').val(locals.msisdn);
		$card.find('.amounttobepaid').val(locals.amountToBePaid);
		$card.find('.airtimeVoucher').val(locals.airtimeVoucher);

		$card.find('.beneficiaryAccept').removeClass('hidden');




	});

	$card.find('.confirmOrder').on('click', function () {
		console.log('Wrapping up Transcation');
		console.log('Setting final local variables');




		/*
    [entityType] => 1
    [type] => 15
    [isPaymentRequest] => 0
    [isBeneficiarySameAsUser] => 0
    [userId] => 6050
    [paymentRequestOption] => 0
    [beneficiaryFirstName] => Bruce
    [beneficiarySurname] => KWK
    [beneficiaryTelephone] => +27731551110
    [beneficiaryCountryCode] => ZAF
    [beneficiaryCurrencyCode] => ZAR */

		locals.benEntityType = '1';
		locals.benType = '15';

		saveClientState();

		createAirTimeTransaction(function () {
			console.log('Transaction Complete');

		})
	})




	function createAirTimeTransaction(callback) {


		createAirTimeTransactions_QuoteAcceptance0(function (err) {
			console.log('Completed Quote Acceptance - Phase 0');
			console.log(err);
			createAirTimeTransactions_QuoteAcceptance1(function (err) {
				console.log('Completed Quote Acceptance - Phase 1');
				console.log(err);
				createAirTimeTransactions_createBeneficiary(function (err) {
					console.log('Completed Beneficiary Creation');
					console.log(err);
					createAirTimeTransactions_createTransaction(function (err) {
						console.log('Completed Transaction Creation');
						console.log(err);

					})
				})
			})


		})





	}

	function getCountryPayOutCurrency(countryCode) {
		//https://code.jquery.com/jquery-2.2.3.min.js

		var srccountryCode = $card.find('.payInCountrySelect').val();
		var srcCurrencyCode = $card.find('.payInCurrencySelect').val();



		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayoutCurrencyList/', { sourceCountryCode: srccountryCode, sourceCurrencyCode: srcCurrencyCode, destinationCountryCode: countryCode }, function (err, response) {
			if (response) {
				if (response.returnData) {
					locals.selectedDestinationCurrency = response.returnData[0];
					console.log('Selected Destination Currency:  ' + locals.selectedDestinationCurrency)
					saveClientState();

				}
				else {
					showError('An error occured whilst obtaining the currency options for the pay out country: ' + response.message);
				}
				hideLoading();


			}
			else {
				showError('An error occured whilst obtaining the currency options for the pay out country: ' + err);
				hideLoading();
			}
		});



	}




	function createAirTimeTransactions_QuoteAcceptance0(callback) {

		var sourceCurrencyCode = locals.sourceCurrencyCode;
		var destinationCurrencyCode = locals.selectedDestinationCurrency.destinationCurrencyCode;
		var timeStamp = locals.timeStamp;
		var providedAmount = locals.selectedAirTimeOption.sourceCurrencyPrice;
		var clientExchangeRate = locals.selectedAirTimeOption.clientExchangeRate;

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/quoteAcceptance/', {
			sourceCurrencyCode: sourceCurrencyCode,
			destinationCurrencyCode: destinationCurrencyCode,
			timeStamp: timeStamp,
			providedAmount: providedAmount,
			clientExchangeRate: clientExchangeRate,
			quoteState: 0

		}, function (err, response) {
			if (response) {
				console.log('acceptQuote0');
				console.log(response);
				if (response.returnData) {
					locals.quoteTimeStamp = response.returnData[0].timeStamp;
					saveClientState();
					callback('');

				}

				else {
					showError('An Error has occured during quote acceptance (Phase 0): ' + response.message);
					callback('An Error has occured during quote acceptance (Phase 0): ' + response.message);

				}


			}
			else {
				showError('An Error has occured during quote acceptance (phase 0): ' + err);
				callback('An Error has occured during quote acceptance: (phase 0)' + err)
				hideLoading();
			}
		});

	}

	function createAirTimeTransactions_QuoteAcceptance1(callback) {
		var sourceCurrencyCode = locals.sourceCurrencyCode;
		var destinationCurrencyCode = locals.selectedDestinationCurrency.destinationCurrencyCode;
		var timeStamp = locals.timeStamp;
		var providedAmount = locals.selectedAirTimeOption.sourceCurrencyPrice;
		var clientExchangeRate = locals.selectedAirTimeOption.clientExchangeRate;

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/quoteAcceptance/', {
			sourceCurrencyCode: sourceCurrencyCode,
			destinationCurrencyCode: destinationCurrencyCode,
			timeStamp: timeStamp,
			providedAmount: providedAmount,
			clientExchangeRate: clientExchangeRate,
			quoteState: 1


		}, function (err, response) {
			if (response) {
				hideLoading();
				locals.acceptedQuote = true;
				saveClientState();
				callback('');
			}
			else {
				showError('An Error has occured during quote acceptance: ' + err);
				hideLoading();
				callback('An Error has occured during quote acceptance: ' + err)
			}
		});

	}

	function createAirTimeTransactions_createBeneficiary(callback) {
		var createBeneficiaryRequest = {

            entityType: locals.benEntityType,
            beneficiaryFirstName: locals.beneficiaryFirstName,
            beneficiarySurname: locals.beneficiaryLastName,
			isPaymentRequest: false,
			isBeneficiarySameAsUser: false,
            beneficiaryCurrencyCode: locals.selectedDestinationCurrency.destinationCurrencyCode,
            beneficiaryCountryCode: locals.destinationCountryCode,
            type: locals.benType,
            beneficiaryTelephone: locals.msisdn,

        }

        removeNullsInObject(createBeneficiaryRequest);
        console.dir(createBeneficiaryRequest);

		displayLoading();
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/createBeneficiary/', { createBeneficiaryRequest: createBeneficiaryRequest }, function (err, response) {

			if (response) {

				if (response.returnData) {
					//Beneficiary Successfully Created
					console.log(response.returnData);
					locals.beneficiary = response.returnData;
					locals.beneficiaryId = response.returnData.beneficiaryId;
					callback('');

				}

				else {
					hideLoading();
					showError('An error occured creating the beneficiary: ' + response.message);
					callback('An error occured creating the beneficiary: ' + response.message);

				}

			}

			else {

				hideLoading();
			}
		});
	}

	function createBeneficiary() {


    }


	function createAirTimeTransactions_createTransaction(callback) {
		

		var payoutLocationInformation = {
			wholesalePrice: locals.selectedAirTimeOption.wholesalePrice,
			wholesalePriceCurrencyCode: locals.selectedAirTimeOption.wholesalePriceCurrencyCode


		}



		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/createTransaction/',
			{
				sourceCountryCode: locals.selectedAirTimeOption.sourceCountryCode, //
				sourceCurrencyCode: locals.selectedAirTimeOption.sourceCurrencyCode, //
				destinationCountryCode: locals.selectedAirTimeOption.destinationCountryCode, //
				destinationCurrencyCode: locals.selectedAirTimeOption.destinationCurrencyCode, //
				providedAmountOption: '0', //
				providedAmount: locals.selectedAirTimeOption.sourceCurrencyPrice, //
				payinMethodValue: locals.payinMethodValue, //
				transactionReference: "xandgo_airtime", //
				netPayOutAmount: locals.selectedAirTimeOption.destinationAirtimeValue, //
				clientExchangeRate: locals.selectedAirTimeOption.clientExchangeRate, //
				transferFee: '0', //
				beneficiaryId: locals.beneficiaryId, //			
				reasonsForTransferId: '6', //
				sourceOfFunds: 'Bank Account Savings', //
				transactionType: locals.benType, //
				exchangeRateOption: 1, //
				clientIpAddress: locals.clientIPAddr, //
				referenceToAppear: 'Sending Airtime', //
				fundsOwner: true, //
				timeStamp: locals.quoteTimeStamp, //
				payoutLocationInformation: payoutLocationInformation, //
				entityType: locals.benEntityType //			

			}, function (err, response) {
				if (response) {

					hideLoading();
					console.log(response);
					if (response.returnData) {

						locals.transactionId = response.returnData.transactionId;
						locals.transactionReference = response.returnData.transactionReference;
						locals.creationDate = response.returnData.creationDate;
						locals.completed = true;
						saveClientState();
						if ((locals.payinMethodValue == '3') || (locals.payinMethodValue == '22')) {
							//Credit Card Payment
							processCreditCardPayment();
						}
						else {

							populateCompletionForm();
							hideTransactionUI();
						}

						callback('');


					}
					else {
						showError('An error has occured commiting the transaction: ' + response.message);
						callback('An error has occured commiting the transaction: ' + response.message)
					}
				}
				else {
					showError('An error has occured commiting the transaction: ' + err);
					hideLoading();
					callback('An error has occured commiting the transaction: ' + err);
				}
			});



	}






	$card.find('.payInCurrencySelect').on('change', function () {
		displayLoading();
		getCountryPayInOptions();
		locals.sourceCurrencyCode = $card.find('.payInCurrencySelect').val();
		$card.find('.payInMethodBlock').removeClass('hidden');
		var selectedIndex = $card.find('.payInCurrencySelect')[0].options.selectedIndex;
		locals.sourceCurrencyCodeText = $card.find('.payInCurrencySelect')[0][selectedIndex].text;
		saveClientState();
	});

	$card.find('.payOutCountrySelect').on('change', function () {
		displayLoading();
		locals.destinationCountryCode = $card.find('.payOutCountrySelect').val();
		var selectedIndex = $card.find('.payOutCountrySelect')[0].options.selectedIndex;
		locals.destinationCountryCodeText = $card.find('.payOutCountrySelect')[0][selectedIndex].text;
		$card.find('.beneficiaryPayOutOptions').removeClass('hidden');
		updateSelectedCountryInformation();
		saveClientState();
		hideLoading();

	});



	function getClientIP() {

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getClientIPDetails/', {}, function (err, response) {
			if (response) {
				locals.clientIPAddr = response.ipaddr;
				saveClientState();
			}
			else {
				showError('An error has occured during client data validation');
			}
		});
	}




	function validateVariables() {
		if (isNaN(locals.transferFee)) {
			locals.transferFee = 0;
		}
	}



	function removeNullsInObject(obj) {
		if (typeof obj === 'string') { return; }
		$.each(obj, function (key, value) {
			if (value === "" || value === null) {
				delete obj[key];
			} else if ($.isArray(value)) {
				if (value.length === 0) { delete obj[key]; return; }
				$.each(value, function (k, v) {
					removeNullsInObject(v);
				});
			} else if (typeof value === 'object') {
				if (Object.keys(value).length === 0) {
					delete obj[key]; return;
				}
				removeNullsInObject(value);
			}
		});
	}

	function createTransaction() {




	}








	$card.find('.getQuote').on('click', function () {
		console.log('Getting Quote');
		displayLoading();

		locals.providedAmount = $card.find('.payValue').val();

		getQuotationCalculator(function () {
			$card.find('.quoteResults').removeClass('hidden');
			$card.find('.acceptQuote').removeClass('hidden');

			$card.find('.payValue').readOnly = true;
			console.log('Received Quote');
			hideLoading();


		});


		saveClientState();



	});

	function hideError() {
		$card.find('.statusLogText').val('');
	}

	var $modal;

	function showError(text) {

		console.log(text);

		if (text.includes('obtain the country pay out options:')) {

		}
		else if (text.includes('DEFAULT')) {

		}
		else {
			$modal = card.modal.open('<br><div class="hdc-error-text">' + text + '</div>' + '<div class="hdc-errormodal-footer"><br><div class="hdc-errormodal-done" style="display: block;"><button type="button">OK</button></div></div>');

			$ok = $modal.find('.hdc-errormodal-done');
			$ok.on('click', function () {
				card.modal.close();

			});
		}

	}


	function getAllCountryList(callback) {
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getAllCountryList/', {}, function (err, response) {
			if (response) {
				if (response.returnData) {
					allCountryList = response.returnData;
					callback();
				}
				else {
					callback();
				}

			}
			else {
				callback();

			}
		});

	}

	var selectedCountryInformation;


	function updateSelectedCountryInformation() {
		var selectedCountryCode = locals.destinationCountryCode;
		var selectedCurrencyCode = locals.destinationCurrencyCode;

		getAllCountryList(function () {
			allCountryList.forEach(function (entry) {
				if (entry.countryCode == selectedCountryCode) {
					selectedCountryInformation = entry;
					console.log(selectedCountryInformation);
					$card.find('.telephoneintltxt').val('Dialling Code: +' + entry.dialingCode);
					console.log($card.find('.telephoneintltxt').val());
				}
			});


		})
		getCountryPayOutCurrency($card.find('.payOutCountrySelect').val());

	}




	function displayLoading() {
		$card.find('.hdc-content').append(over);
	}

	function hideLoading() {
		$('#overlay').remove();
	}

	function getCountryPayInCurrency(countryCode) {

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayinCurrencyList/', { sourceCountryCode: countryCode }, function (err, response) {
			if (response) {
				payInSelect = $card.find('.payInCurrencySelect');
				if (payInSelect[0])
					payInSelect[0].options.length = 0;
				payInSelect.append($("<option />").val("Default").text("Select Pay In Currency"));
				if (response.returnData) {
					response.returnData.forEach(function (entry) {
						payInSelect = $card.find('.payInCurrencySelect');
						payInSelect.append($("<option />").val(entry.sourceCurrencyCode).text(entry.sourceCurrencyName));
					});
					payInSelect[0].selectedIndex = 1;
					payInSelect.change();

				}
				else {
					showError('An error occured whilst obtaining the currencies for the country selected: ' + response.message);
				}
				hideLoading();
			}
			else {
				showError('An error occured whilst obtaining the currencies for the country selected: ' + err)
				hideLoading();
			}
		});
	}

	function getUserInformation(callback) {
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getUser/', {}, function (err, response) {

			if (response) {
				if (response.returnData) {

					locals.getUser = response.returnData[0];
					locals.memberID = response.returnData[0].memberId;
					locals.userCountry = response.returnData[0].country;
					saveClientState();
					callback();
				}

				else {
					showError('An error occured whilst attempting to obtain the User Information: ' + response.message);
				}
				hideLoading();


			}
			else {
				showError('An error occured whilst attempting to obtain the User Information: ' + err);
				hideLoading();
			}
		});
	}



	function getCountryPayInOptions() {
		//https://code.jquery.com/jquery-2.2.3.min.js
		var sourceCountryCode = $card.find('.payInCountrySelect').val();
		var sourceCurrencyCode = $card.find('.payInCurrencySelect').val();


		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayinMethodList/', { sourceCountryCode: sourceCountryCode, sourceCurrencyCode: sourceCurrencyCode }, function (err, response) {
			if (response) {
				if (response.returnData) {
					payInMethod = $card.find('.paymethodInSelect');

					if (payInMethod[0])
						payInMethod[0].options.length = 0;
					payInMethod.append($("<option />").val('Default').text('Select Pay In Method'));

					var ccIndex = 0;
					var index = 0;

					response.returnData.forEach(function (entry) {

						if ((entry.payinMethodName == 'Barclays Pingit')) {
							//payInMethod = $card.find('.paymethodInSelect');
							//payInMethod.append($("<option />").val(entry.payinMethodValue).text(entry.payinMethodName));
						} else if ((entry.payinMethodName == 'Credit Card') || (entry.payinMethodName == 'Debit Card')) {
							if (locals.getUser) {
								if ((locals.getUser.creditCardPermitted == 1) && (locals.getUser.creditCardPaymentsDisabled == 0)) {
									index++;
									ccIndex = index;
									payInMethod.append($("<option />").val(entry.payinMethodValue).text(entry.payinMethodName));
								}
							}


						}
						else {
							payInMethod = $card.find('.paymethodInSelect');
							if (entry.payinMethodName == 'Electronic Funds Transfer (EFT)') {

							}
							else {

							}

						}

					});
					console.log(ccIndex);
					if (ccIndex > 0) {
						payInMethod = $card.find('.paymethodInSelect');
						console.log(payInMethod);
						payInMethod[0].selectedIndex = ccIndex;
					}

					else {
						payInMethod[0].selectedIndex = 1;
					}

					payInMethod.change();

				}

				else {
					showError('An error occured whilst attempting to obtain the country pay in options: ' + response.message);
				}
				hideLoading();


			}
			else {
				showError('An error occured whilst attempting to obtain the country pay in options: ' + err);
				hideLoading();
			}
		});



	}

	var payOutOptionsEnabled;

	function getCountryPayOutOptions() {
		//https://code.jquery.com/jquery-2.2.3.min.js

		var destinationCountryCode = $card.find('.payOutCountrySelect').val();
		var destinationCurrencyCode = $card.find('.payOutCurrencySelect').val();


		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayoutMethodList/', { destinationCountryCode: destinationCountryCode, destinationCurrencyCode: destinationCurrencyCode }, function (err, response) {
			if (response) {
				if (response.returnData) {
					payOutOptionsEnabled = new Array();
					console.log(response.returnData);
					payOutMethod = $card.find('.paymethodOutSelect');

					if (payOutMethod[0])
						payOutMethod[0].options.length = 0;
					payOutMethod.append($("<option />").val('Default').text('Select Pay Out Method'));
					response.returnData.forEach(function (entry) {
						console.log(entry.payoutMethodName);
						if ((entry.payoutMethodName != 'AirTime TopUp') && (entry.payoutMethodName != 'Credit Card') && (entry.payoutMethodName != 'Barclays Pingit')) {
							if (entry.payoutOption) {
								payOutOptionsEnabled[entry.payoutMethodValue] = entry.payoutServices;
							}
							if (entry.payoutMethodName == 'Cash Collection Transaction')
								payOutMethod.append($("<option />").val(entry.payoutMethodValue).text('Cash Collection'));
							else
								payOutMethod.append($("<option />").val(entry.payoutMethodValue).text(entry.payoutMethodName));
						}



					});

					console.log(payOutOptionsEnabled);

					locals.payOutOptionsEnabled = payOutOptionsEnabled;

					payOutMethod[0].selectedIndex = 1;
					payOutMethod.change();
					$card.find('.payOption')[0].selectedIndex = 1;
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

	function populateCompletionForm() {
		hideTransactionUI();
		console.log('Completion Form');
		$card.find('.sendMoneyConfirmed').removeClass('hidden');
		$card.find('.sendMoneyMainTitle').addClass('hidden');


		if (locals.getUser.kycReceived != 1) {
			$card.find('.cardCompletedKYC').removeClass('hidden');

		}

		if ((locals.payinMethodValue == '3') || (locals.payinMethodValue == '22')) { // Credit Card

			$card.find('.cardCompletedCC').removeClass('hidden');
			$card.find('.CCReference').val(locals.transactionId);


		}
		else {
			getProviderBankAccount(function () {

				if (!locals.sentMessages) {
					locals.sentMessages = true;
					saveClientState();
					sendCompletionMessages();
				}

				$card.find('.DRreference').val(locals.DRdepositReferenceToUse);
				$card.find('.DRaccountName').val(locals.DRaccountName);
				$card.find('.DRcurrency').val(locals.DRCurrency);
				$card.find('.DRbank').val(locals.DRBank);
				$card.find('.DRaccountNumber').val(locals.DRAccountNumber);
				$card.find('.DRbankCountry').val(locals.DRBankCountry);
				if (locals.DRSwiftCode)
					$card.find('.DRswiftCode').val(locals.DRSwiftCode);
				if (locals.DRBankCode)
					$card.find('.DRbankCode').val(locals.DRBankCode);
				if (locals.DRBranchCode)
					$card.find('.DRBranchCode').val(locals.DRBranchCode);
				if (locals.DRBankAddress)
					$card.find('.DRbankAddress').val(locals.DRBankAddress);
				if (locals.providedAmountOption == 0) {
					$card.find('.DRdepositAmount').val(locals.providedAmount);
				}
				else {
					$card.find('.DRdepositAmount').val(locals.netPayOutAmount);
				}

				$card.find('.cardCompletedEFT').removeClass('hidden');

			});

		}


	}

	function sendCompletionMessages() {
		var getProviderBankAccount = locals.getProviderBankAccount;
		var amounttoPay = 0;
		if (locals.providedAmountOption == 0) {
			amounttoPay = (locals.providedAmount);
		}
		else {
			amounttoPay = (locals.netPayOutAmount);
		}

		var amountPaidOut = 0;

		if (locals.providedAmountOption == 0) {
			amountPaidOut = (locals.netPayOutAmount);
		}
		else {
			amountPaidOut = (locals.providedAmount);
		}




		console.log('Sending Completion Messages');

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/sendTransactionPendingSMSToMember/', { getUser: locals.getUser, getProviderBankAccount: locals.getProviderBankAccount, amounttoPay: amounttoPay }, function (err, response) {
			if (response) {

			}
		});

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/sendPaymentBankDetailsEmailToMember/', { transactionId: locals.transactionId, getUser: locals.getUser, getProviderBankAccount: locals.getProviderBankAccount, amounttoPay: amounttoPay }, function (err, response) {
			if (response) {

			}



		});

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/sendTransactionsDetailsEmailToMember/', { destinationCurrencyCode: locals.destinationCurrencyCode, amountPaidOut: amountPaidOut, transactionId: locals.transactionId, getUser: locals.getUser, getProviderBankAccount: locals.getProviderBankAccount, amounttoPay: amounttoPay, beneficiaryDetails: locals.beneficiaryDetails, exchangeRate: locals.clientExchangeRate, transferFee: locals.transferFee, destinationCountryCode: locals.destinationCountryCode }, function (err, response) {

			if (response) {

			}
		});

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/sendTransactionPendingEmailToBeneficiary/', { destinationCurrencyCode: locals.destinationCurrencyCode, amountPaidOut: amountPaidOut, transactionId: locals.transactionId, getUser: locals.getUser, getProviderBankAccount: locals.getProviderBankAccount, amounttoPay: amounttoPay, beneficiaryDetails: locals.beneficiaryDetails }, function (err, response) {
			if (response) {

			}
		});



		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/sendTransactionPendingSMSToBeneficiary/', { destinationCurrencyCode: locals.destinationCurrencyCode, amountPaidOut: locals.netPayOutAmount, transactionId: locals.transactionId, getUser: locals.getUser, getProviderBankAccount: locals.getProviderBankAccount, amounttoPay: amounttoPay, beneficiaryDetails: locals.beneficiaryDetails }, function (err, response) {
			if (response) {
			}
		});

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/sendNewTransactionDetailsSMStoMember/', { destinationCurrencyCode: locals.destinationCurrencyCode, amountPaidOut: amountPaidOut, transactionId: locals.transactionId, getUser: locals.getUser, getProviderBankAccount: locals.getProviderBankAccount, amounttoPay: amounttoPay, beneficiaryDetails: locals.beneficiaryDetails, exchangeRate: locals.clientExchangeRate, transferFee: locals.transferFee, destinationCountryCode: locals.destinationCountryCode }, function (err, response) {

			if (response) {

			}
		});





	}



	function updatePayInMethodValue(callback) {
		var args = {
			payinMethodValue: locals.payinMethodValue,
			transactionId: locals.transactionId
		};


		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/updateTransactionPayinMethod/', args, function (err, response) {
			if (response) {

				if (response.returnData) {

					callback();
				}

				else {
					callback();
				}
			}

			else {
				callback();
			}
		});


	}



	function processCreditCardPayment() {
		locals.attemptedCreditCardPayment = true;
		saveClientState();
		var args = {
			transaction_id: locals.transactionId,
			payin_method_value: locals.payinMethodValue
		}

		if (!locals.creditCardProcessed) {

			//$modal = card.modal.open('<div>Your Credit Card transaction will be opened up in via your on-device browser. Please complete this transaction and return to the Exchange4free Chat Application. <br>Chat. Send. Save</div>' + response.smartPayForm + '<div class="hdc-creditcard-done" style="display: block;"></div>');
			var link = '<a href="http://guinness.exchange4free.com:3000/e4f/getSmartPayDetailsGet?transaction_id=' + locals.transactionId + '&payin_method_value=' + locals.payinMethodValue + '" target="_blank" class="hdc-link external"><img src="http://www.exchange4free.com/xandgo/images/Credit-Card-PaymentsS.png" alt="Pay Now" style=" top: 0px;  display: inline-block;  width: 150px;  height: 180px;  margin-left: 20px;  content: "";  background: transparent url(\"https://www.exchange4free.com/xandgo/images/Credit-Card-PaymentsS.png\") no-repeat scroll 0% 0% / 100% auto;  text-decoration: none;  border: none;"></a>';

			$card.find('.hdc-content').append(link);
			locals.creditCardProcessed = true;
			saveClientState();

			updatePayInMethodValue(function () {


			});

		}

		populateCompletionForm();




	}

}