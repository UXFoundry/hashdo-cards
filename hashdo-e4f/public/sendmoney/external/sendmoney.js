var __e4f = {

	sendMoney: {

		onReady: function (c, dc, loc) {
			$card = dc;
			card = c;
			locals = loc;
			importSendMoney();
		}
	}

};

var $card;
var card;
var locals;

function importSendMoney() {

	console.log($);


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

					if ($card.find('.payOutCurrencySelect')[0])
						$card.find('.payOutCurrencySelect')[0].options.length = 0;
					$card.find('.payOutCurrencyBlock').removeClass('hidden');
					$card.find('.payOutCurrencySelect').append($("<option />").val(locals.stateData.destinationCurrencyCode).text(locals.stateData.destinationCurrencyCodeText));;

					if ($card.find('.paymethodOutSelect')[0])
						$card.find('.paymethodOutSelect')[0].options.length = 0;
					$card.find('.payOutMethodBlock').removeClass('hidden');
					$card.find('.paymethodOutSelect').append($("<option />").val(locals.stateData.transactionType).text(locals.stateData.transactionTypeText));;

					if ($card.find('.payOption')[0])
						$card.find('.payOption')[0].options.length = 0;
					$card.find('.payOptionBlock').removeClass('hidden');
					$card.find('.payOption').append($("<option />").val(locals.stateData.providedAmountOption).text(locals.stateData.providedAmountOptionText));;

					$card.find('.quoteResults').removeClass('hidden');
					$card.find('.transferFeeValue').val(locals.stateData.transferFee);
					$card.find('.exchangeRateValue').val(locals.stateData.clientExchangeRate);
					$card.find('.AmountValue').val(locals.stateData.netPayOutAmount);
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
		$card.find('.payOutCurrencyBlock').addClass('hidden');
		$card.find('.payOutMethodBlock').addClass('hidden');
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

		$card.find('.beneficiaryPayOutOptions').addClass('hidden');
		$card.find('.beneficiaryPayOutOptionsBank').addClass('hidden');

		$card.find('.beneficiaryPayOutOptionsCash').addClass('hidden');
		$card.find('.paymentDetails').addClass('hidden');
		$card.find('.paymentDetails').addClass('hidden');
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

	function getAllCountryListing() {
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getAllCountryList/', {}, function (err, response) {
			if (response) {


				allCountries = response.returnData;
				allCountries.sort(sortAllCountriesbyName);


				beneficiaryFundsOwnerInformationCountry = $card.find('.beneficiaryFundsOwnerInformationCountry');

				if (beneficiaryFundsOwnerInformationCountry[0])
					beneficiaryFundsOwnerInformationCountry[0].options.length = 0;
				beneficiaryFundsOwnerInformationCountry.append($("<option />").val("Default").text("Owner Country"));

				if (response.returnData) {
					allCountries.forEach(function (entry) {
						beneficiaryFundsOwnerInformationCountry = $card.find('.beneficiaryFundsOwnerInformationCountry');
						beneficiaryFundsOwnerInformationCountry.append($("<option />").val(entry.countryCode).text(entry.countryName));

					});
				}

				else {
					showError('Error during Exchange4Free Data Collection: ' + response.message);

				}
				hideLoading();

			}
			else {
				showError('Error during Exchange4Free Data Collection: ' + err);
				hideLoading();
			}
		});
	}

	//entityType
	$card.find('.entityType').on('change', function () {
		displayLoading();
		if ($card.find('.entityType').val() == '2') {
			locals.entityType = $card.find('.entityType').val();
			$card.find('.benCompany').removeClass('hidden');
		}
		else {
			locals.entityType = $card.find('.entityType').val();
			$card.find('.benCompany').addClass('hidden');
		}


		saveClientState();
		hideLoading();

	});

	$card.find('.beneficiaryOwnerConfirm').on('change', function () {
		displayLoading();

		locals.beneficiaryFundsOwnerInformationCountry = $card.find('.beneficiaryFundsOwnerInformationCountry').val();
		locals.beneficiaryFundsOwnerInformationAddress = $card.find('.beneficiaryFundsOwnerInformationAddress').val();
		locals.beneficiaryFundsOwnerInformationName = $card.find('.beneficiaryFundsOwnerInformationName').val();
		locals.beneficiaryFundsOwnerInformationSurname = $card.find('.beneficiaryFundsOwnerInformationSurname').val();
		locals.beneficiaryFundsOwnerInformationdob = $card.find('.beneficiaryFundsOwnerInformationdob').val();
		locals.beneficiaryFundsOwnerInformationemail = $card.find('.beneficiaryFundsOwnerInformationemail').val();
		locals.beneficiaryFundsOwnerInformationregNo = $card.find('.beneficiaryFundsOwnerInformationregNo').val();
		locals.beneficiaryFundsOwnerInformationcantact = $card.find('.beneficiaryFundsOwnerInformationcantact').val();

		saveClientState();


	});

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
	$card.find('.payOption').on('change', function () {
		displayLoading();
		locals.providedAmountOption = $card.find('.payOption').val();
		$card.find('.getQuoteBlock').removeClass('hidden');
		var selectedIndex = $card.find('.payOption')[0].options.selectedIndex;
		locals.providedAmountOptionText = $card.find('.payOption')[0][selectedIndex].text;
		hideLoading();
		saveClientState();


	});


	$card.find('.beneficiaryPayOutOptionsCashStateSelect').on('change', function () {

		displayLoading();

		locals.countryState = $card.find('.beneficiaryPayOutOptionsCashStateSelect').val();
		saveClientState();

		var requestData = {
			destinationCountryCode: locals.destinationCountryCode,
			destinationCurrencyCode: locals.destinationCurrencyCode,
			paymentMethodValue: locals.transactionType,
			countryState: locals.countryState

		}

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayoutLocationCityList/', requestData, function (err, response) {
			if (response) {
				console.log(response);
				if (response.returnData) {
					if ($card.find('.beneficiaryPayOutOptionsCashCitySelect')[0])
						$card.find('.beneficiaryPayOutOptionsCashCitySelect')[0].options.length = 0;
					beneficiaryPayOutOptionsCashCitySelect = $card.find('.beneficiaryPayOutOptionsCashCitySelect');
					beneficiaryPayOutOptionsCashCitySelect.append($("<option />").val('Default').text('Select City'));
					response.returnData.forEach(function (entry) {
						//stateName
						beneficiaryPayOutOptionsCashCitySelect = $card.find('.beneficiaryPayOutOptionsCashCitySelect');
						beneficiaryPayOutOptionsCashCitySelect.append($("<option />").val(entry.cityName).text(entry.cityName));

					});
					hideLoading();
				}
				else {
					hideLoading();
				}
			}
			else {
				showError('An error has occured during client data validation - PayoutLocation Services - City');
				hideLoading();
			}
		});

	});

	$card.find('.beneficiaryPayOutOptionsCashAddressSelect').on('change', function () {
		locals.locationID = $card.find('.beneficiaryPayOutOptionsCashAddressSelect').val();
		var selectedIndex = $card.find('.beneficiaryPayOutOptionsCashAddressSelect')[0].options.selectedIndex;
		var locationAddress = $card.find('.beneficiaryPayOutOptionsCashAddressSelect')[0][selectedIndex].text;

		locals.cashPayoutAddress = locationAddress;
		$card.find('.beneficiaryAccept').removeClass('hidden');
	});

	$card.find('.beneficiaryPayOutOptionsCashCitySelect').on('change', function () {
		displayLoading();



		locals.cityName = $card.find('.beneficiaryPayOutOptionsCashCitySelect').val();
		saveClientState();

		var requestData = {
			destinationCountryCode: locals.destinationCountryCode,
			destinationCurrencyCode: locals.destinationCurrencyCode,
			paymentMethodValue: locals.transactionType,
			countryState: locals.countryState,
			cityName: locals.cityName

		}

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayoutLocationAddress/', requestData, function (err, response) {
			if (response) {
				console.log(response);
				if (response.returnData) {
					if ($card.find('.beneficiaryPayOutOptionsCashAddressSelect')[0])
						$card.find('.beneficiaryPayOutOptionsCashAddressSelect')[0].options.length = 0;
					beneficiaryPayOutOptionsCashAddressSelect = $card.find('.beneficiaryPayOutOptionsCashAddressSelect');
					beneficiaryPayOutOptionsCashAddressSelect.append($("<option />").val('Default').text('Select Address'));
					response.returnData.forEach(function (entry) {
						//stateName
						beneficiaryPayOutOptionsCashAddressSelect = $card.find('.beneficiaryPayOutOptionsCashAddressSelect');
						beneficiaryPayOutOptionsCashAddressSelect.append($("<option />").val(entry.locationID).text(entry.address));

					});
					hideLoading();
				}
				else {
					hideLoading();
				}
			}
			else {
				showError('An error has occured during client data validation - PayoutLocation Services - Address');
				hideLoading();
			}
		});

		$card.find('.beneficiaryPayOutOptionsCashAddress').removeClass('hidden');

	});

	function initiatedCashCollectionDetails(callback) {

		if (locals.transactionType == '3') {
			//Cash Tranasction - No Bank Details Needed, display cash payoutoptions
			$card.find('.beneficiaryPayOutOptionsCash').removeClass('hidden');
			$card.find('.beneficiaryPayOutOptionsCashState').removeClass('hidden');



			var requestData = {
				destinationCountryCode: locals.destinationCountryCode,
				destinationCurrencyCode: locals.destinationCurrencyCode,
				paymentMethodValue: locals.transactionType

			}

			console.log(requestData);

			card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayoutLocationStateList/', requestData, function (err, response) {
				if (response) {
					console.log(response);
					if (response.returnData) {
						if ($card.find('.beneficiaryPayOutOptionsCashStateSelect')[0])
							$card.find('.beneficiaryPayOutOptionsCashStateSelect')[0].options.length = 0;
						beneficiaryPayOutOptionsCashStateSelect = $card.find('.beneficiaryPayOutOptionsCashStateSelect');
						beneficiaryPayOutOptionsCashStateSelect.append($("<option />").val('Default').text('Select State/Province'));
						response.returnData.forEach(function (entry) {
							//stateName
							beneficiaryPayOutOptionsCashStateSelect = $card.find('.beneficiaryPayOutOptionsCashStateSelect');
							beneficiaryPayOutOptionsCashStateSelect.append($("<option />").val(entry.stateName).text(entry.stateName));

						});
						hideLoading();
						callback();
					}
					else {
						hideLoading();
						callback();
					}
				}
				else {
					showError('An error has occured during client data validation - PayoutLocation Services - State');
					hideLoading();
					callback();
				}
			});
		}


	}

	//beneficiaryOption
	$card.find('.beneficiaryOption').on('change', function () {
		displayLoading();
		console.log(locals.transactionType);

		if (locals.transactionType == '3') {
			initiatedCashCollectionDetails(function () {

			});



		}

		else {

			if (locals.transactionType == '7') {
				//Wallet  
				$card.find('.beneficiaryAccept').removeClass('hidden');
				hideLoading();
			}
			else {
				getBeneficiaryBankDetailsById(function () {
					console.log('here');
					hideLoading();
					$card.find('.beneficiaryConfirmation').removeClass('hidden');
					$card.find('.beneficiaryAccept').removeClass('hidden');

				});

			}



		}










	});



	$card.find('.paymethodOutSelect').on('change', function () {
		displayLoading();
		$card.find('.payOptionBlock').removeClass('hidden');
		locals.transactionType = $card.find('.paymethodOutSelect').val();
		var selectedIndex = $card.find('.paymethodOutSelect')[0].options.selectedIndex;
		locals.transactionTypeText = $card.find('.paymethodOutSelect')[0][selectedIndex].text;
		hideLoading();
		saveClientState();
		console.log(locals.transactionType);


	});



	$card.find('.beneficiaryPayOutOptionsCashStateSelect').on('change', function () {
		displayLoading();
		locals.countryState = $card.find('.beneficiaryPayOutOptionsCashStateSelect').val();
		saveClientState();

		var requestData = {
			destinationCountryCode: locals.destinationCountryCode,
			destinationCurrencyCode: locals.destinationCurrencyCode,
			paymentMethodValue: locals.transactionType,
			countryState: locals.countryState

		}

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayoutLocationCityList/', requestData, function (err, response) {
			if (response) {
				console.log(response);
			}
			else {
				showError('An error has occured during client data validation');
			}
		});

		hideLoading();
		$card.find('.beneficiaryPayOutOptionsCashCity').removeClass('hidden');


	});


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

		getCountryPayOutCurrency($card.find('.payOutCountrySelect').val());
		locals.destinationCountryCode = $card.find('.payOutCountrySelect').val();
		$card.find('.payOutCurrencyBlock').removeClass('hidden');
		var selectedIndex = $card.find('.payOutCountrySelect')[0].options.selectedIndex;
		locals.destinationCountryCodeText = $card.find('.payOutCountrySelect')[0][selectedIndex].text;
		saveClientState();

	});

	$card.find('.payOutCurrencySelect').on('change', function () {
		displayLoading();
		//payOutMethodBlock
		getCountryPayOutOptions();
		locals.destinationCurrencyCode = $card.find('.payOutCurrencySelect').val();
		var selectedIndex = $card.find('.payOutCurrencySelect')[0].options.selectedIndex;
		locals.destinationCurrencyCodeText = $card.find('.payOutCurrencySelect')[0][selectedIndex].text;
		$card.find('.payOutMethodBlock').removeClass('hidden');
		saveClientState();

	});

	$card.find('.finalTransferReasonSelect').on('change', function () {
		displayLoading();
		//payOutMethodBlock
		locals.reasonsForTransferId = $card.find('.finalTransferReasonSelect').val();
		saveClientState();
		hideLoading();

	});

	$card.find('.finalSourceofFundsSelect').on('change', function () {
		displayLoading();
		//payOutMethodBlock
		locals.sourceOfFunds = $card.find('.finalSourceofFundsSelect').val();
		saveClientState();
		hideLoading();

	});

	$card.find('.confirmFinal').on('click', function () {
		displayLoading();
		//Check Details

		createTransaction();
		/*
				if ($card.find('.pdReferenceToAppear')[0].value == '') {
					showError('The payment reference has not been entered. Please complete a payment reference to finalise the transaction.');
					hideLoading();
				}
				else {
					
				}*/


		/*
		 {
			locals.completed = true;
			saveClientState();
	
		});*/

	});


	$card.find('.acceptQuoteButton').on('click', function () {
		displayLoading();

		var d = new Date();
		var n = d.getTime();
		locals.transactionReference = 'xandgo' + n;

		locals.transferFee = $card.find('.transferFeeValue').val();
		locals.clientExchangeRate = $card.find('.exchangeRateValue').val();
		locals.netPayOutAmount = $card.find('.AmountValue').val();
		locals.paymentRequestOption = false;
		locals.exchangeRateOption = $card.find('.payOption').val();
		if (locals.exchangeRateOption == 0) {
			locals.payInAmount = $card.find('.payValue').val();
		}
		else {
			locals.payInAmount = $card.find('.AmountValue').val();
		}
		acceptQuote_0();
		saveClientState();
		getBeneficiaryListForUserAndCountry();


		console.log(locals.payOutOptionsEnabled);
		console.log($card.find('.paymethodOutSelect').val());
		//Dev12345




	});

	function acceptQuote_0() {

		var sourceCurrencyCode = locals.sourceCurrencyCode;
		var destinationCurrencyCode = locals.destinationCurrencyCode;
		var timeStamp = locals.quoteTimeStamp;
		var providedAmount = locals.providedAmount;
		var clientExchangeRate = locals.clientExchangeRate;


		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/quoteAcceptance/', {
			sourceCurrencyCode: sourceCurrencyCode,
			destinationCurrencyCode: destinationCurrencyCode,
			timeStamp: timeStamp,
			providedAmount: providedAmount,
			clientExchangeRate: clientExchangeRate,
			quoteState: 0


		}, function (err, response) {
			if (response) {
				if (response.returnData) {
					locals.quoteTimeStamp = response.returnData[0].timeStamp;
					acceptQuote_1();
					saveClientState();

				}

				else {
					showError('An Error has occured during quote acceptance (Phase 1): ' + response.message);

				}


			}
			else {
				showError('An Error has occured during quote acceptance: ' + err);
				hideLoading();
			}
		});

	};

	function acceptQuote_1() {
		var sourceCurrencyCode = locals.sourceCurrencyCode;
		var destinationCurrencyCode = locals.destinationCurrencyCode;
		var timeStamp = locals.quoteTimeStamp;
		var providedAmount = locals.providedAmount;
		var clientExchangeRate = locals.clientExchangeRate;

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
			}
			else {
				showError('An Error has occured during quote acceptance: ' + err);
				hideLoading();
			}
		});

	};



	function getClientIP() {

		$.post('http://guinness.exchange4free.com:3000/e4f/getClientIPDetails/', {}, function (response, status) {
			if (response) {
				//console.log(response);
				locals.clientIPAddr = response.ipaddr;
				saveClientState();
			}
			else {
				showError('An error has occured during client data validation');
			}
		});

		/* Alan - REMOVE Proxy Posting
 
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getClientIPDetails/', {}, function (err, response) {
			if (response) {
				locals.clientIPAddr = response.ipaddr;
				saveClientState();
			}
			else {
				showError('An error has occured during client data validation');
			}
		}); */
	}


	$card.find('.acceptBeneficiary').on('click', function () {
		displayLoading();

		$card.find('.finalTransferReason').removeClass('hidden');
		//$card.find('.finalSourceofFunds').removeClass('hidden');

		getTransferReasons(function () {

		});

		updatePaymentDetails(function () {

		});

		$card.find('.termsandConditions').removeClass('hidden');

		$card.find('.paymentDetails').removeClass('hidden');

		locals.beneficiaryId = $card.find('.beneficiaryOption').val();
		locals.acceptedBeneficiary = true;

		if (locals.payOutOptionsEnabled) {
			if (locals.payOutOptionsEnabled[$card.find('.paymethodOutSelect').val()]) {
				createPayOutBeneficiary();

			}


		}

		saveClientState();

	});

	function validateVariables() {
		if (isNaN(locals.transferFee)) {
			locals.transferFee = 0;
		}
	}

	function createPayOutBeneficiary() {
		var selectedIndex = 0;
		var bankNameText = '';
		if ($card.find('.bankNameSelect')[0].options.selectedIndex) {
			var selectedIndex = $card.find('.bankNameSelect')[0].options.selectedIndex;
			if ($card.find('.bankNameSelect')[0][selectedIndex]) {
				if ($card.find('.bankNameSelect')[0][selectedIndex].text) {
					var bankNameText = $card.find('.bankNameSelect')[0][selectedIndex].text;

				}
			}



		}


		var cashCollectionTransactionInformation = '';

		if ($card.find('.paymethodOutSelect').val() == '3') {
			//populateCashPayoutInformation

			cashCollectionTransactionInformation = {
				passportNumber: $card.find('.idNumbertxt').val()
			}
		}




		var mobile = $card.find('.telephoneintltxt').val() + $card.find('.telephonetxt').val();
		mobile = mobile.replace('Dialling Code: ', "");

		var name = $card.find('.firstNametxt').val() + ' ' + $card.find('.lastNametxt').val();


		var createBeneficiaryRequest = {

			entityType: '1', //Person Only
			beneficiaryFirstName: $card.find('.firstNametxt').val(),
			beneficiarySurname: $card.find('.lastNametxt').val(),
			idNumber: $card.find('.idNumbertxt').val(),
			beneficiaryEmail: '',

			gender: '',
			beneficiaryCurrencyCode: $card.find('.payOutCurrencySelect').val(),
			beneficiaryCountryCode: $card.find('.payOutCountrySelect').val(),
			type: $card.find('.paymethodOutSelect').val(), //getPayoutMethodList
			beneficiaryTelephone: mobile,
			transferReasonId: '',
			identificationType: $card.find('.idtypeSelect').val(), //idtypeSelect
			bankingInformation: {
				bankName: bankNameText,
				branchName: $card.find('.branchtxt').val(),
				bankCity: $card.find('.bankcitytxt').val(),
				accountHolderName: name,
				accountType: 'Current',
				accountNumber: $card.find('.bankcbutxt').val(),
				bankCPF: $card.find('.bankcuittxt').val(),
				correspondentBankDetails: '',
				registrationNumber: '',
				companyName: '',
				referenceToAppear: 'E4F Money Transfers',
				earthportVanNumber: '',
				swiftCode: '',
				sortCode: '',
				branchCode: $card.find('.branchtxt').val(),
				address: '',
				ibanNumber: '',
				bicCode: '',
				abaRouting: '',
				bsbNumber: '',
				bankCode: '',
				prefix: '',
				bankAgencyNumber: '',
				clabeNumber: '',
				clearingCode: '',
				cpfOrCnpjNumber: '',
				giroNumber: '',
				holdingBranch: '',
				ifscCode: '',
				suffix: '',
				transitNumber: '',
				nibNumber: '',
				additionalRsaBeneficiary: '',
				contactFirstName: '',
				contactLastName: '',
				companyType: '',
				companyActivity: '',
			},
			cashCollectionTransactionInformation: cashCollectionTransactionInformation
		}

		createBeneficiaryRequest.beneficiaryAddress = $card.find('.addresstxt').val();


		createBeneficiaryRequest.beneficiaryCity = $card.find('.citytxt').val();


		removeNullsInObject(createBeneficiaryRequest);

		console.log(createBeneficiaryRequest);


		if (!locals.payOutBeneficiaryCreated) {
			card.proxy.post('http://guinness.exchange4free.com:3000/e4f/createBeneficiary/', { createBeneficiaryRequest: createBeneficiaryRequest }, function (err, response) {

				if (response) {

					if (response.returnData) {
						console.log(response.returnData);
						locals.beneficiaryId = response.returnData.beneficiaryId;
						locals.payOutBeneficiaryCreated = true;
						locals.createBeneficiaryRequest = createBeneficiaryRequest;
						saveClientState();
					}
				}
			});

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
		validateVariables();
		var payoutLocationInformation = '';
		if (locals.payOutOptionsEnabled) {
			if (locals.payOutOptionsEnabled[$card.find('.paymethodOutSelect').val()]) {
				payoutLocationInformation = {
					sessionID: '',
					agentAddress: '',
					beneficiaryIDNumber: $card.find('.idNumbertxt').val(),
					beneficiaryIDType: $card.find('.idtypeSelect').val(),
					bankSwiftCode: '',
					payoutCompanyBranch: '',
					city: $card.find('.citytxt').val(),
					locationID: $card.find('.bankNameSelect').val(),
					destinationCountryState: '',
					kashmartOfficeID: '',
					moneyTransferCompany: '',
					wholesalePriceCurrencyCode: '',
					wholesalePrice: '',
					agentName: ''
				}

				locals.payoutLocationInformation = payoutLocationInformation;
			}

		}


		if ((locals.locationID) && (locals.transactionType == '3')) {
			//Cash Transaction and Payout Information Known
			payoutLocationInformation = {
				sessionID: '',
				agentAddress: locals.cashPayoutAddress,
				beneficiaryIDNumber: locals.beneficiaryIDorPassportNumber,
				beneficiaryIDType: '',
				bankSwiftCode: '',
				payoutCompanyBranch: '',
				city: locals.cityName,
				locationID: locals.locationID,
				destinationCountryState: '',
				kashmartOfficeID: '',
				moneyTransferCompany: '',
				wholesalePriceCurrencyCode: '',
				wholesalePrice: '',
				agentName: ''
			}

			if ($card.find('.idtypeSelect').val()) {
				payoutLocationInformation.beneficiaryIDType = $card.find('.idtypeSelect').val();
			}

			locals.payoutLocationInformation = payoutLocationInformation;



		}




		locals.referenceToAppear = 'E4F/' + locals.memberID;


		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/createTransaction/',
			{
				sourceCountryCode: locals.sourceCountryCode,
				sourceCurrencyCode: locals.sourceCurrencyCode,
				destinationCountryCode: locals.destinationCountryCode,
				destinationCurrencyCode: locals.destinationCurrencyCode,
				providedAmountOption: locals.providedAmountOption,
				providedAmount: locals.providedAmount,
				payinMethodValue: locals.payinMethodValue,
				transactionReference: locals.transactionReference,
				netPayOutAmount: locals.netPayOutAmount,
				clientExchangeRate: locals.clientExchangeRate,
				transferFee: locals.transferFee,
				beneficiaryId: locals.beneficiaryId, //84149
				electronicSignature: 'test/test',
				reasonsForTransferId: locals.reasonsForTransferId,
				sourceOfFunds: 'Other',
				transactionType: locals.transactionType,
				exchangeRateOption: 1,
				clientIpAddress: locals.clientIPAddr,
				referenceToAppear: locals.referenceToAppear,
				fundsOwner: true,
				timeStamp: locals.quoteTimeStamp,
				payoutLocationInformation: payoutLocationInformation
				/*			
				entityType: locals.entityType,
				countryCode: locals.beneficiaryFundsOwnerInformationCountry,
				address: locals.beneficiaryFundsOwnerInformationAddress,
				ownersName: locals.beneficiaryFundsOwnerInformationName,
				'dateOfBirth-Incorporation': locals.beneficiaryFundsOwnerInformationdob,
				contactEmail: locals.beneficiaryFundsOwnerInformationemail,
				surname: locals.beneficiaryFundsOwnerInformationSurname,
				registrationNumber: locals.beneficiaryFundsOwnerInformationregNo,
				contactPerson: locals.beneficiaryFundsOwnerInformationcantact*/

			}, function (err, response) {
				if (response) {

					hideLoading();

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


					}
					else {
						showError('An error has occured commiting the transaction: ' + response.message);
					}
				}
				else {
					showError('An error has occured commiting the transaction: ' + err);
					hideLoading();
				}
			});


	}

	function getIDTypeList() {
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getIdTypeOptionList/', {}, function (err, response) {
			if (response) {
				if (response.returnData) {
					//idtypeSelect



					console.log(response.returnData);
					idtypeSelect = $card.find('.idtypeSelect');
					idtypeSelect.append($("<option />").val('DEFAULT').text('Type of Identification'));

					response.returnData.forEach(function (entry) {
						idtypeSelect = $card.find('.idtypeSelect');
						idtypeSelect.append($("<option />").val(entry.idTypeValue).text(entry.idTypeName));

					});
					hideLoading();

				}
				else {
					//showError('An error has occured updating the payment details' + response.message);
					hideLoading();
				}



			}
			else {
				//showError('An error has occured updating the payment details' + err);
				hideLoading();
			}
		});


	}

	function getBeneficiaryTypeList() {

		///destinationCountryCode
		//payoutMethodValue

		var selectedCountryCode = locals.destinationCountryCode
		var selectedCurrencyCode = locals.destinationCurrencyCode
		var payOutMethod = locals.transactionType;

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getBeneficiaryTypeList/', { destinationCountryCode: selectedCountryCode, payoutMethodValue: payOutMethod }, function (err, response) {
			if (response) {
				if (response.returnData) {

					console.log(response.returnData);
					hideLoading();

				}
				else {
					//showError('An error has occured updating the payment details' + response.message);
					hideLoading();
				}



			}
			else {
				//showError('An error has occured updating the payment details' + err);
				hideLoading();
			}
		});

	}

	function updatePaymentDetails(callback) {
		var beneficiaryID = $card.find('.beneficiaryOption').val();
		var callAPI = false;

		if (locals.payOutOptionsEnabled) {
			if (locals.payOutOptionsEnabled[$card.find('.paymethodOutSelect').val()]) {

				if ($card.find('.payOutCountrySelect').val() == 'NGA') {
					callAPI = true;
				}

				else {
					console.log('Beneficiary on the Fly Payout Options Enabled - Updating Payment Details');

					var firstName = $card.find('.firstNametxt').val();
					var lastName = $card.find('.lastNametxt').val();
					var mobile = $card.find('.telephonetxt').val();

					$card.find('.pdBeneficiaryName').val(firstName + ' ' + lastName);
					$card.find('.pdPhoneNumber').val(selectedCountryInformation.dialingCode + mobile);
				}


			}
			else {
				callAPI = true;
			}
		}
		else {
			callAPI = true;
		}

		if (callAPI) {
			card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getBeneficiaryById/', { beneficiaryId: beneficiaryID }, function (err, response) {
				if (response) {
					if (response.returnData) {
						console.log(response.returnData);

						locals.beneficiaryDetails = response.returnData;
						$card.find('.pdBeneficiaryName').val(response.returnData.firstName + ' ' + response.returnData.surname);
						$card.find('.pdPhoneNumber').val(response.returnData.telephone);
						hideLoading();
						console.log(locals.beneficiaryDetails);

					}
					else {
						showError('An error has occured updating the payment details' + response.message);
						hideLoading();
					}



				}
				else {
					showError('An error has occured updating the payment details' + err);
					hideLoading();
				}
			});

		}

		var payotionvalud = $card.find('.payOption').val();

		if (payotionvalud == 0) { //Sending Amount
			$card.find('.pdAmounttoTransfer').val(locals.payInAmount);
			$card.find('.pdCurrencyPaidOut').val(locals.destinationCurrencyCodeText);
			$card.find('.pdTotalPaidOut').val($card.find('.AmountValue').val());
		}
		else {
			$card.find('.pdAmounttoTransfer').val(locals.payInAmount);
			$card.find('.pdCurrencyPaidOut').val(locals.destinationCurrencyCodeText);
			$card.find('.pdTotalPaidOut').val($card.find('.payValue').val());

		}




		$card.find('.pdCurrencySending').val(locals.sourceCurrencyCodeText);
		$card.find('.pdExchangeRate').val($card.find('.exchangeRateValue').val());
		$card.find('.pdTransferFee').val($card.find('.transferFeeValue').val());



	}

	function getTransferReasons(callback) {
		//https://code.jquery.com/jquery-2.2.3.min.js

		var destinationCountryCode = $card.find('.payOutCountrySelect').val();


		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getTransferReasonList/', { destinationCountryCode: destinationCountryCode }, function (err, response) {
			if (response) {
				if (response.returnData) {
					if ($card.find('.finalTransferReasonSelect')[0])
						$card.find('.finalTransferReasonSelect')[0].options.length = 0;
					$card.find('.finalTransferReasonSelect').append($("<option />").val('Default').text('Select Transfer Reason'));

					response.returnData.forEach(function (entry) {
						finalTransferReasonSelect = $card.find('.finalTransferReasonSelect');
						finalTransferReasonSelect.append($("<option />").val(entry.transferReasonID).text(entry.transferReason));

					});

				}
				else {
					showError('An error has occured obtaining the transfer reasons: ' + response.message);
				}

				hideLoading();


			}
			else {
				showError('An error has occured obtaining the transfer reasons: ' + err);
				hideLoading();
			}
		});



	}

	var $beneficiaryReference;

	function getSourceOfFunds(callback) {
		//https://code.jquery.com/jquery-2.2.3.min.js


		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getSourceOfFundList/', {}, function (err, response) {
			if (response) {
				if (response.returnData) {
					if ($card.find('.finalSourceofFundsSelect')[0])
						$card.find('.finalSourceofFundsSelect')[0].options.length = 0;
					$card.find('.finalSourceofFundsSelect').append($("<option />").val('Default').text('Select Source of Funds'));


					response.returnData.forEach(function (entry) {
						finalSourceofFundsSelect = $card.find('.finalSourceofFundsSelect');
						finalSourceofFundsSelect.append($("<option />").val(entry.sourceOfFund).text(entry.sourceOfFund));

					});

				}
				else {
					showError('An error occured whilst obtaining the source of funds:' + response.message);
				}
				hideLoading();



			}
			else {
				showError('An error occured whilst obtaining the source of funds:' + err);
				hideLoading();
			}
		});



	}

	function getBeneficiaryBankDetailsById(callback) {
		//https://code.jquery.com/jquery-2.2.3.min.js

		var beneficiaryID = $card.find('.beneficiaryOption').val();

		console.log(beneficiaryID);



		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getBeneficiaryBankDetailsById/', { beneficiaryId: beneficiaryID }, function (err, response) {
			if (response) {

				if (response.returnData) {
					if (response.returnData.bankName)
						$card.find('.beneficiaryBankName').val(response.returnData.bankName);
					if (response.returnData.accountNumber)
						$card.find('.beneficiaryAccountNumber').val(response.returnData.accountNumber);
					/*if (response.returnData.branchOrSortCode)
						$card.find('.beneficiaryBranchCode').val(response.returnData.branchOrSortCode);*/
					if (response.returnData.bankCountry)
						$card.find('.beneficiaryBankCountry').val(response.returnData.bankCountry);
					$beneficiaryReference = response.returnData.referenceToAppear;
					callback()

				}
				else {
					showError('An error occured obtaining the beneficiaries bank details' + response.message);
					callback();

				}
				hideLoading();




			}
			else {
				showError('An error occured obtaining the beneficiaries bank details' + err);
				hideLoading();
				callback();
			}
		});



	}



	$card.find('.getQuote').on('click', function () {
		console.log('Getting Quote');
		displayLoading();

		locals.providedAmount = $card.find('.payValue').val();

		getQuotationCalculator(function () {
			$card.find('.quoteResults').removeClass('hidden');
			$card.find('.acceptQuote').removeClass('hidden');

			if ((locals.quoteData.cashReward) && (locals.quoteData.cashReward != '0.0')) {
				console.log(locals.quoteData.cashReward);
				var cashrewardvalue = '+' + ' ' + $card.find('.payOutCurrencySelect').val() + ' ' + locals.quoteData.cashReward + ' Extra in Cash Rewards and Savings'
				console.log($card.find('.cashrewardsvalue'));
				$card.find('.cashrewardsvalue').text(cashrewardvalue);
				$card.find('.cashrewardsheader').removeClass('hidden');
				$card.find('.cashrewardsvaluerow').removeClass('hidden');


			}

			else {
				$card.find('.cashrewardsvaluerow').addClass('hidden');
				$card.find('.cashrewardsheader').addClass('hidden');
				$card.find('.cashrewardsvaluerow').addClass('hidden');



			}

			if ((locals.quoteData.signUpBonus) && (locals.quoteData.signUpBonus != "0.0")) {
				console.log(locals.quoteData.signUpBonus);
				var destinationCurrencyCode = $('.payOutCurrencySelect').val();
				var signUpBonus = 'USD 5 added to your transfer ' + destinationCurrencyCode + ' ' + locals.quoteData.signUpBonus;

				$('.signonfeevalue').text(signUpBonus);
				$('.signonfeeheaderrow').removeClass('hidden');
				$('.signonfeevaluerow').removeClass('hidden');
			}

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

	var $quoteTimeStamp;

	function getQuotationCalculator(callback) {
		//https://code.jquery.com/jquery-2.2.3.min.js
		var sourceCountryCode = $card.find('.payInCountrySelect').val();
		var sourceCurrencyCode = $card.find('.payInCurrencySelect').val();
		var destinationCurrencyCode = $card.find('.payOutCurrencySelect').val();
		var destinationCountryCode = $card.find('.payOutCountrySelect').val();
		var payinMethodValue = $card.find('.paymethodInSelect').val();
		var payoutMethodValue = $card.find('.paymethodOutSelect').val();
		var providedAmountOption = $card.find('.payOption').val();
		var providedAmount = $card.find('.payValue').val();


		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/quotationCalculator/', { sourceCountryCode: sourceCountryCode, sourceCurrencyCode: sourceCurrencyCode, destinationCurrencyCode: destinationCurrencyCode, destinationCountryCode: destinationCountryCode, payinMethodValue: payinMethodValue, payoutMethodValue: payoutMethodValue, providedAmountOption: providedAmountOption, providedAmount: providedAmount }, function (err, response) {
			if (response) {

				if (!response.returnData) {
					hideLoading();
					showError('An error occured whilst obtaining a quotation from Exchange 4 Free: ' + response.message);
				}
				else {
					console.log(response.returnData);
					locals.quoteData = response.returnData;
					$quoteTimeStamp = response.returnData.TimeStamp;
					locals.quoteTimeStamp = $quoteTimeStamp;
					var transferFee = 0;
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

	$card.find('.refreshBeneficiaries').on('click', function () {
		getBeneficiaryForUserAndCountryRemote();

	});

	function getBeneficiaryForUserAndCountryRemote() {

		var destinationCurrencyCode = $card.find('.payOutCurrencySelect').val();
		var destinationCountryCode = $card.find('.payOutCountrySelect').val();
		var payoutMethodValue = $card.find('.paymethodOutSelect').val();

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getBeneficiaryListForUserAndCountry/', { destinationCurrencyCode: destinationCurrencyCode, destinationCountryCode: destinationCountryCode, payoutMethodValue: payoutMethodValue }, function (err, response) {
			if (response) {
				if (response.returnData) {
					beneficiaryOption = $card.find('.beneficiaryOption');
					if (beneficiaryOption[0])
						beneficiaryOption[0].options.length = 0;
					beneficiaryOption.append($("<option />").val('Default').text('Select Beneficiary'));
					response.returnData.forEach(function (entry) {
						beneficiaryOption = $card.find('.beneficiaryOption');
						var $str = entry.firstName + ' ' + entry.surname;
						beneficiaryOption.append($("<option />").val(entry.beneficiaryId).text($str));
					});
					$card.find('.beneficiary').removeClass('hidden');
					$card.find('.noBeneficiariesAvailable').addClass('hidden');
				}
				else {

					if (response.message.indexOf("has no beneficiary for") >= 0) {
						$card.find('.noBeneficiariesAvailable').removeClass('hidden');
						$card.find('.beneficiaryOption').addClass('hidden');

					}
					else {
						showError('An error occured whilst obtaining the beneficiary list for the country selected' + response.message);
					}

				}
				hideLoading();


			}
			else {
				showError('An error occured whilst obtaining the beneficiary list for the country selected' + err);
				hideLoading();
			}
		});
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
		var selectedCountryCode = locals.destinationCountryCode
		var selectedCurrencyCode = locals.destinationCurrencyCode
		var payOutMethod = locals.transactionType;

		console.log(payOutMethod);

		getAllCountryList(function () {
			allCountryList.forEach(function (entry) {
				if (entry.countryCode == selectedCountryCode) {
					selectedCountryInformation = entry;
					$card.find('.telephoneintltxt').val('Dialling Code: +' + entry.dialingCode);
					console.log($card.find('.telephoneintltxt').val());
				}
			});


		})

		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayoutLocationAddress/', { destinationCountryCode: selectedCountryCode, destinationCurrencyCode: selectedCurrencyCode, paymentMethodValue: payOutMethod }, function (err, response) {
			if (response) {
				if (response.returnData) {

					bankNameSelect = $card.find('.bankNameSelect');
					if (bankNameSelect.options)
						bankNameSelect.options.length = 0;

					bankNameSelect.append($("<option />").val("Default").text("Select Bank"));
					response.returnData.forEach(function (entry) {
						bankNameSelect = $card.find('.bankNameSelect');
						bankNameSelect.append($("<option />").val(entry.locationID).text(entry.branchName));
					});

				}
				console.log(response);
			}
			else {
				showError('An error occured whilst obtaining the currencies for the country selected: ' + err)
				hideLoading();
			}
		});

		$card.find('.beneficiaryAccept').removeClass('hidden');

	}


	function getBeneficiaryListForUserAndCountry() {
		console.log(locals.payOutOptionsEnabled);
		console.log($card.find('.paymethodOutSelect').val());
		console.log($card.find('.payOutCountrySelect').val());

		if (locals.payOutOptionsEnabled) {
			if (locals.payOutOptionsEnabled[$card.find('.paymethodOutSelect').val()]) {
				if ($card.find('.payOutCountrySelect').val() == 'NGA') {
					$card.find('.beneficiary').removeClass('hidden');
					getBeneficiaryForUserAndCountryRemote();
				}

				else {
					console.log('Payout Options Enabled');
					updateSelectedCountryInformation();
					getIDTypeList();
					$card.find('.beneficiaryPayOutOptions').removeClass('hidden');
					initiatedCashCollectionDetails(function () {

					});

					getBeneficiaryTypeList();

					if ($card.find('.paymethodOutSelect').val() == '1') { //Bank to Bank
						$card.find('.beneficiaryPayOutOptionsBank').removeClass('hidden');
						//Check on Country Required Information - NON BENEFICIARY TRANSACTIONS
						console.log($card.find('.payOutCountrySelect').val());
						if ($card.find('.payOutCountrySelect').val() == 'ARG') {
							$card.find('.beneficiaryPayOutOptionsBankName').removeClass('hidden');
							$card.find('.beneficiaryPayOutOptionsBranch').removeClass('hidden');
							$card.find('.beneficiaryPayOutOptionsBankCity').removeClass('hidden');
							$card.find('.beneficiaryPayOutOptionsBankCBU').removeClass('hidden');
							$card.find('.beneficiaryPayOutOptionsBankName').removeClass('hidden');
							$card.find('.beneficiaryPayOutOptionsBankCUIT').removeClass('hidden');
						}
					}
				}


			}
			else {
				$card.find('.beneficiary').removeClass('hidden');
				getBeneficiaryForUserAndCountryRemote();
			}
		}
		else {
			$card.find('.beneficiary').removeClass('hidden');
			getBeneficiaryForUserAndCountryRemote();

		}







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

					var eftIndex = 0;
					var index = 0;

					response.returnData.forEach(function (entry) {

						if ((entry.payinMethodName == 'Barclays Pingit')) {
							//payInMethod = $card.find('.paymethodInSelect');
							//payInMethod.append($("<option />").val(entry.payinMethodValue).text(entry.payinMethodName));
						} else if ((entry.payinMethodName == 'Credit Card') || (entry.payinMethodName == 'Debit Card')) {
							if (locals.getUser) {
								if ((locals.getUser.creditCardPermitted == 1) && (locals.getUser.creditCardPaymentsDisabled == 0)) {
									index++;
									payInMethod.append($("<option />").val(entry.payinMethodValue).text(entry.payinMethodName));
								}
							}


						}
						else {
							payInMethod = $card.find('.paymethodInSelect');
							if (entry.payinMethodName == 'Electronic Funds Transfer (EFT)') {
								index++;
								payInMethod.append($("<option />").val(entry.payinMethodValue).text('Bank Transfer'));
								eftIndex = index;
								payInMethod[0].selectedIndex = eftIndex;
							}
							else {
								index++;
								payInMethod.append($("<option />").val(entry.payinMethodValue).text(entry.payinMethodName));
							}

						}

					});
					console.log(eftIndex);
					if (eftIndex > 0) {
						payInMethod = $card.find('.paymethodInSelect');
						console.log(payInMethod);
						payInMethod[0].selectedIndex = eftIndex;
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

	function getCountryPayOutCurrency(countryCode) {
		//https://code.jquery.com/jquery-2.2.3.min.js

		var srccountryCode = $card.find('.payInCountrySelect').val();
		var srcCurrencyCode = $card.find('.payInCurrencySelect').val();


		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayoutCurrencyList/', { sourceCountryCode: srccountryCode, sourceCurrencyCode: srcCurrencyCode, destinationCountryCode: countryCode }, function (err, response) {
			if (response) {

				payOutSelect = $card.find('.payOutCurrencySelect');
				if (payOutSelect[0])
					payOutSelect[0].options.length = 0;
				payOutSelect.append($("<option />").val("Default").text("Select Pay Out Currency"));
				if (response.returnData) {
					response.returnData.forEach(function (entry) {

						payOutSelect = $card.find('.payOutCurrencySelect');
						payOutSelect.append($("<option />").val(entry.destinationCurrencyCode).text(entry.destinationCurrencyName));

					});

					payOutSelect[0].selectedIndex = 1;
					payOutSelect.change();

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

	function getProviderBankAccount(callback) {


		if (!locals.receivedproviderBankAccount) {
			updatePayInMethodValue(function () {

				var args = {
					transactionId: locals.transactionId
				};


				card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getProviderBankAccount/', args, function (err, response) {
					if (response) {
						console.log(response);

						if (Object.prototype.toString.call(response.returnData) === '[object Array]') {
							if (response.returnData[0]) {
								locals.getProviderBankAccount = response.returnData[0];
								if (!response.returnData[0].depositReference) {
									locals.DRdepositReferenceToUse = locals.memberID;

								}
								else {
									locals.DRdepositReferenceToUse = response.returnData[0].depositReference;
								}
								locals.DRaccountName = response.returnData[0].accountName;
								if (response.returnData[0].currencyName)
									locals.DRCurrency = response.returnData[0].currencyName;
								else
									locals.DRCurrency = ' ';
								locals.DRBank = response.returnData[0].bankName;
								locals.DRAccountNumber = response.returnData[0].accountNumber;
								if (response.returnData[0].countryName)
									locals.DRBankCountry = response.returnData[0].countryName;
								else
									locals.DRBankCountry = ' ';
								if (response.returnData[0].branchName)
									locals.DRBranchName = response.returnData[0].branchName;
								locals.DRSwiftCode = response.returnData[0].swiftCode;
								locals.DRBankCode = response.returnData[0].ibanNumber;
								if (response.returnData[0].branchCode)
									locals.DRBranchCode = response.returnData[0].branchCode;
								if (response.returnData[0].sortCode)
									locals.DRBranchCode = response.returnData[0].sortCode;
								if (response.returnData[0].bsbNumber)
									locals.DRBranchCode = response.returnData[0].bsbNumber;
								locals.DRBankAddress = response.returnData[0].bankAddress;
								locals.DRSpecialInstructions = response.returnData[0].instructions;
								locals.receivedproviderBankAccount = true;

								saveClientState();
								callback();
							}

						}
						else if (response.returnData) {
							locals.getProviderBankAccount = response.returnData;

							if (!response.returnData.depositReference) {
								locals.DRdepositReferenceToUse = locals.memberID;

							}
							else {
								locals.DRdepositReferenceToUse = response.returnData.depositReference;
							}
							locals.DRaccountName = response.returnData.accountName;
							locals.DRCurrency = response.returnData.currencyName;
							locals.DRBank = response.returnData.bankName;
							locals.DRAccountNumber = response.returnData.accountNumber;
							locals.DRBankCountry = response.returnData.countryName;
							if (response.returnData.branchName)
								locals.DRBranchName = response.returnData.branchName;
							locals.DRSwiftCode = response.returnData.swiftCode;
							locals.DRBankCode = response.returnData.ibanNumber;
							if (response.returnData.branchCode)
								locals.DRBranchCode = response.returnData.branchCode;
							if (response.returnData.sortCode)
								locals.DRBranchCode = response.returnData.sortCode;
							locals.DRBankAddress = response.returnData.bankAddress;
							locals.DRSpecialInstructions = response.returnData.instructions;
							locals.receivedproviderBankAccount = true;
							saveClientState();
							callback();

						}
						else {
							callback();
						}
						hideLoading();




					}
					else {
						callback();

						hideLoading();
					}
				});
			});

		}

		else {
			callback();
			hideLoading();

		}


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



		/*
		
				card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getSmartPayDetails/', args, function (err, response) { //CHANGE THIS
					if (response) {
		
		
					}
					else {
						showError('An error occured whilst obtaining the Credit Card Payment Form: ' + err);
		
					}
				});
		*/


	}

}