card.onReady = function () {
	
	 //var over = '<div id="overlay"><img id="loading" src="http://bit.ly/pMtW1K"></div>';
	var over = '<div id="overlay"><img id="loading" src="images/loader.gif"></div>';
	
	
    var $card = $('#' + locals.card.id),
	
	
    isActive = true,
    now = new Date(),
    renderUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()).valueOf();
	
	prePopulateData();
	var allCountries;
	
	function sortAllCountriesbyName(x,y) {
		return ((x.countryName == y.countryName) ? 0 : ((x.countryName > y.countryName) ? 1 : -1 ));
	}
	
		
	$card.find('.beneficiaryFundsOwner').on('change', function () {
		displayLoading();
		
		if ($card.find('.beneficiaryFundsOwner').val() == 'no') {
			
			$card.find('.beneficiaryFundsOwnerInformation').removeClass('hidden');	
			locals.fundsOwner=false;		
		}
		else {
			
			$card.find('.beneficiaryFundsOwnerInformation').addClass('hidden');
			locals.fundsOwner=true;	
		}
		
		
		
	});
	
	
	function prePopulateData() {
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getAllCountryList/',{} , function (err, response) {
		if (response) {
			
			
			allCountries = response.returnData;
			allCountries.sort(sortAllCountriesbyName);
			
			
			beneficiaryFundsOwnerInformationCountry = $card.find('.beneficiaryFundsOwnerInformationCountry');
			beneficiaryFundsOwnerInformationCountry[0].options.length=0;
			beneficiaryFundsOwnerInformationCountry.append($("<option />").val("Default").text("Owner Country"));
			
			if (response.returnData) {
				allCountries.forEach(function(entry) {				
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
		
	});
	
	$card.find('.beneficiaryOwnerConfirm').on('change', function () {
		displayLoading();
		
		locals.beneficiaryFundsOwnerInformationCountry=$card.find('.beneficiaryFundsOwnerInformationCountry').val();
		locals.beneficiaryFundsOwnerInformationAddress=$card.find('.beneficiaryFundsOwnerInformationAddress').val();
		locals.beneficiaryFundsOwnerInformationName=$card.find('.beneficiaryFundsOwnerInformationName').val();
		locals.beneficiaryFundsOwnerInformationSurname=$card.find('.beneficiaryFundsOwnerInformationSurname').val();
		locals.beneficiaryFundsOwnerInformationdob=$card.find('.beneficiaryFundsOwnerInformationdob').val();
		locals.beneficiaryFundsOwnerInformationemail=$card.find('.beneficiaryFundsOwnerInformationemail').val();
		locals.beneficiaryFundsOwnerInformationregNo=$card.find('.beneficiaryFundsOwnerInformationregNo').val();
		locals.beneficiaryFundsOwnerInformationcantact=$card.find('.beneficiaryFundsOwnerInformationcantact').val();
		
		
	});

	$card.find('.payInCountrySelect').on('change', function () {
		displayLoading();
		getClientIP();
		getCountryPayInCurrency($card.find('.payInCountrySelect').val());
		locals.sourceCountryCode  = $card.find('.payInCountrySelect').val();
		$card.find('.payInCurrencyBlock').removeClass('hidden');		
	});
	//paymethodInSelect
	$card.find('.paymethodInSelect').on('change', function () {
		displayLoading();
		locals.payinMethodValue = $card.find('.paymethodInSelect').val();
		$card.find('.payOutCountryBlock').removeClass('hidden');
		hideLoading();
		
		
	});
	//payOption
	$card.find('.payOption').on('change', function () {
		displayLoading();
		locals.providedAmountOption = $card.find('.payOption').val();
		$card.find('.getQuoteBlock').removeClass('hidden');		
		hideLoading();
		
		
	});
	
	//beneficiaryOption
	$card.find('.beneficiaryOption').on('change', function () {
		displayLoading();
		
		getBeneficiaryBankDetailsById(function() {
			
		
		});
		
		$card.find('.beneficiaryConfirmation').removeClass('hidden');
		$card.find('.beneficiaryAccept').removeClass('hidden');
		
		
		
	});
	
	
	
	$card.find('.paymethodOutSelect').on('change', function () {
		displayLoading();
		$card.find('.payOptionBlock').removeClass('hidden');
		locals.transactionType = $card.find('.paymethodOutSelect').val();
		hideLoading();
		
	});
	
	
	$card.find('.payInCurrencySelect').on('change', function () {
		displayLoading();
		getCountryPayInOptions();
		locals.sourceCurrencyCode  = $card.find('.payInCurrencySelect').val();
		$card.find('.payInMethodBlock').removeClass('hidden');
		
		
	});
	
	$card.find('.payOutCountrySelect').on('change', function () {
		displayLoading();
		
		getCountryPayOutCurrency($card.find('.payOutCountrySelect').val());
		locals.destinationCountryCode = $card.find('.payOutCountrySelect').val();
		$card.find('.payOutCurrencyBlock').removeClass('hidden');
		
	});
	
	$card.find('.payOutCurrencySelect').on('change', function () {
		displayLoading();
		//payOutMethodBlock
		getCountryPayOutOptions();
		locals.destinationCurrencyCode  = $card.find('.payOutCurrencySelect').val();
		$card.find('.payOutMethodBlock').removeClass('hidden');
		
	});
	
	$card.find('.finalTransferReasonSelect').on('change', function () {
		displayLoading();
		//payOutMethodBlock
		locals.reasonsForTransferId  = $card.find('.finalTransferReasonSelect').val();	
		
	});
	
	$card.find('.finalSourceofFundsSelect').on('change', function () {
		displayLoading();
		//payOutMethodBlock
		locals.sourceOfFunds  = $card.find('.finalSourceofFundsSelect').val();	
		
	});
	
	$card.find('.confirmFinal').on('click', function () {
		displayLoading();		
		createTransaction(function(data) {
			
			
		});
		
	});
	

	$card.find('.acceptQuoteButton').on('click', function () {
		displayLoading();
		
		var d = new Date();
		var n = d.getTime();
		locals.transactionReference = 'xandgo' + n;
		
		locals.transferFee = $card.find('.transferFeeValue').val();
		locals.clientExchangeRate = $card.find('.exchangeRateValue').val();
		locals.netPayOutAmount= $card.find('.AmountValue').val();
		locals.paymentRequestOption=false;
		locals.exchangeRateOption=1;
		acceptQuote_0();
		
		
		
		
		
		$card.find('.beneficiary').removeClass('hidden');
		getBeneficiaryListForUserAndCountry(function() {
			$card.find('.beneficiary').removeClass('hidden');		
			
		})
		
		
		
	});
	
	function acceptQuote_0() {
		
		var sourceCurrencyCode=locals.sourceCurrencyCode;
		var destinationCurrencyCode=locals.destinationCurrencyCode;
		var timeStamp=locals.quoteTimeStamp;
		var providedAmount=locals.providedAmount;
		var clientExchangeRate=locals.clientExchangeRate;
		
				
		card.proxy.post('http://guiness.exchange4free.com:3000/e4f/quoteAcceptance/',{
			sourceCurrencyCode: sourceCurrencyCode,
			destinationCurrencyCode: destinationCurrencyCode,
			timeStamp: timeStamp,
			providedAmount: providedAmount,
			clientExchangeRate: clientExchangeRate,
			quoteState: 0
			
			
			
			} , function (err, response) {
		if (response) {
			if (response.returnData) {
				locals.quoteTimeStamp = response.returnData[0].timeStamp;
				acceptQuote_1();
			
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
		var sourceCurrencyCode=locals.sourceCurrencyCode;
		var destinationCurrencyCode=locals.destinationCurrencyCode;
		var timeStamp=locals.quoteTimeStamp;
		var providedAmount=locals.providedAmount;
		var clientExchangeRate=locals.clientExchangeRate;
				
		card.proxy.post('http://guiness.exchange4free.com:3000/e4f/quoteAcceptance/',{
			sourceCurrencyCode: sourceCurrencyCode,
			destinationCurrencyCode: destinationCurrencyCode,
			timeStamp: timeStamp,
			providedAmount: providedAmount,
			clientExchangeRate: clientExchangeRate,
			quoteState: 1
			
			
			} , function (err, response) {
		if (response) {
			hideLoading();
			

       
		}
		else {
			showError('An Error has occured during quote acceptance: ' + err);
			hideLoading();
		}
		});
		
	};
	
	
	
	function getClientIP() {
		
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getClientIPDetails/',{} , function (err, response) {
		if (response) {			
			locals.clientIPAddr = response.ipaddr;     
		}
		else {
			showError('An error has occured during client data validation');
		}
		});
	}
	
	$card.find('.acceptBeneficiary').on('click', function () {
		displayLoading();
		
		$card.find('.finalTransferReason').removeClass('hidden');
		$card.find('.finalSourceofFunds').removeClass('hidden');
		
		getTransferReasons(function() {
			
		});
		
		getSourceOfFunds(function() {
			
		});
		
		updatePaymentDetails(function() {
			
			
		});
			
		$card.find('.termsandConditions').removeClass('hidden');
		
		$card.find('.paymentDetails').removeClass('hidden');
		
		locals.beneficiaryId = $card.find('.beneficiaryOption').val();
			
	});
	
	function createTransaction(callback) {
		
		
		locals.referenceToAppear = $card.find('.pdReferenceToAppear').val();
		card.proxy.post('http://127.0.0.1:3000/e4f/createTransaction/',
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
				beneficiaryId: locals.beneficiaryId,
				electronicSignature: 'test/test',
				reasonsForTransferId: locals.reasonsForTransferId,
				sourceOfFunds: locals.sourceOfFunds,
				transactionType: locals.transactionType,
				exchangeRateOption: locals.exchangeRateOption,
				clientIpAddress: locals.clientIPAddr,
				referenceToAppear: locals.referenceToAppear,
				fundsOwner: locals.fundsOwner,
				timeStamp:locals.quoteTimeStamp,
				entityType: locals.entityType,
				countryCode: locals.beneficiaryFundsOwnerInformationCountry,
				address: locals.beneficiaryFundsOwnerInformationAddress,
				ownersName: locals.beneficiaryFundsOwnerInformationName,
				'dateOfBirth-Incorporation': locals.beneficiaryFundsOwnerInformationdob,
				contactEmail: locals.beneficiaryFundsOwnerInformationemail,
				surname:locals.beneficiaryFundsOwnerInformationSurname,
				registrationNumber: locals.beneficiaryFundsOwnerInformationregNo,
				contactPerson: locals.beneficiaryFundsOwnerInformationcantact
				
				} , function (err, response) {
					if (response) {
						
						hideLoading();
						
						if (response.returnData) {
							
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
	
	function updatePaymentDetails(callback) {
		var beneficiaryID= $card.find('.beneficiaryOption').val();
		
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getBeneficiaryById/',{beneficiaryId: beneficiaryID  } , function (err, response) {
		if (response) {
			if (response.returnData) {	

			
			$card.find('.pdBeneficiaryName').val(response.returnData.firstName + ' ' + response.returnData.surname);
			$card.find('.pdPhoneNumber').val(response.returnData.telephone);
			var payotionvalud = $card.find('.payOption').val();
			
			if (payotionvalud==0) { //Sending Amount
				
				$card.find('.pdAmounttoTransfer').val($card.find('.payValue').val());
				$card.find('.pdCurrencyPaidOut').val($card.find('.AmountValue').val());
				$card.find('.pdTotalPaidOut').val($card.find('.AmountValue').val());
			}
			else {				
				$card.find('.pdAmounttoTransfer').val($card.find('.AmountValue').val());
				$card.find('.pdCurrencyPaidOut').val($card.find('.payValue').val());
				$card.find('.pdTotalPaidOut').val($card.find('.payValue').val());
				
			}
			
			
			
			var payInCurrencySelect=$card.find('.payInCurrencySelect').text();
			$card.find('.pdCurrencySending').val(payInCurrencySelect.val());
			
			$card.find('.pdExchangeRate').val($card.find('.exchangeRateValue').val());
			
			
			$card.find('.pdTransferFee').val($card.find('.transferFeeValue').val());
			
			hideLoading();
			
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
	
	function getTransferReasons(callback) {
		//https://code.jquery.com/jquery-2.2.3.min.js

		var destinationCountryCode = $card.find('.payOutCountrySelect').val();
		
		
	card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getTransferReasonList/',{destinationCountryCode: destinationCountryCode} , function (err, response) {
		if (response) {
			if (response.returnData) {
			
				response.returnData.forEach(function(entry) {
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
		
		
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getSourceOfFundList/',{} , function (err, response) {
		if (response) {
			if (response.returnData) {		
			
			response.returnData.forEach(function(entry) {
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
		
		var beneficiaryID= $card.find('.beneficiaryOption').val();
		
		
		
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getBeneficiaryBankDetailsById/',{beneficiaryId: beneficiaryID  } , function (err, response) {
		if (response) {
			if (response.returnData) {		
			
			$card.find('.beneficiaryBankName').val(response.returnData.bankName);
			$card.find('.beneficiaryAccountNumber').val(response.returnData.accountNumber);
			$card.find('.beneficiaryBranchCode').val(response.returnData.branchCode);
			$card.find('.beneficiaryBankCountry').val(response.returnData.bankCountry);
			$beneficiaryReference=response.returnData.referenceToAppear;
			
			}
			else {
				showError('An error occured obtaining the beneficiaries bank details' + response.message);
				
			}
			hideLoading();
			
			

       
		}
		else {
			showError('An error occured obtaining the beneficiaries bank details' + err);
			hideLoading();
		}
		});
		
		
		
	}
	
	
	
	$card.find('.getQuote').on('click', function () {
		displayLoading();
		
		locals.providedAmount = $card.find('.payValue').val();
		
		getQuotationCalculator(function() {
			$card.find('.quoteResults').removeClass('hidden');
			$card.find('.acceptQuote').removeClass('hidden');
			hideLoading();
			
		});
		
		
		
	});
	
	function hideError() {
		$card.find('.statusLogText').val('');
	}
	
	var $modal;
	
	function showError(text) {
		$modal = card.modal.open('<br><div class="hdc-error-text">' + text +'</div>'+ '<div class="hdc-errormodal-footer"><br><div class="hdc-errormodal-done" style="display: block;"><button type="button">OK</button></div></div>');
		
		$ok = $modal.find('.hdc-errormodal-done');
		$ok.on('click', function() {			
			card.modal.close();
			
		});
	}
	
	var $quoteTimeStamp;
	
	function getQuotationCalculator(callback) {
		//https://code.jquery.com/jquery-2.2.3.min.js
		var sourceCountryCode = $card.find('.payInCountrySelect').val();
		var sourceCurrencyCode = $card.find('.payInCurrencySelect').val();
		var destinationCurrencyCode = $card.find('.payOutCurrencySelect').val();
		var destinationCountryCode = $card.find('.payOutCountrySelect').val();
		var payinMethodValue= $card.find('.paymethodInSelect').val();
		var payoutMethodValue= $card.find('.paymethodOutSelect').val();
		var providedAmountOption= $card.find('.payOption').val();
		var providedAmount= $card.find('.payValue').val();
		
		
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/quotationCalculator/',{sourceCountryCode: sourceCountryCode,sourceCurrencyCode: sourceCurrencyCode,destinationCurrencyCode: destinationCurrencyCode,destinationCountryCode: destinationCountryCode,payinMethodValue: payinMethodValue,payoutMethodValue: payoutMethodValue,providedAmountOption: providedAmountOption,providedAmount: providedAmount} , function (err, response) {
		if (response) {
			if (!response.returnData) {
				hideLoading();
				showError('An error occured whilst obtaining a quotation from Exchange 4 Free: ' + response.message);
			}
			else {
				$quoteTimeStamp = response.returnData.TimeStamp;
				locals.quoteTimeStamp = $quoteTimeStamp;
				var transferfee = parseFloat(response.returnData.transferFee).toFixed(2);
				var clientExchangeRate = parseFloat(response.returnData.clientExchangeRate).toFixed(2);
				var amountValue = parseFloat(response.returnData.amount).toFixed(2);
				$card.find('.transferFeeValue').val(transferfee);
				$card.find('.exchangeRateValue').val(clientExchangeRate);
				$card.find('.AmountValue').val(amountValue);
				callback();
				hideLoading();
			}       
		}
		else {
			showError('An error occured whilst obtaining a quotation from Exchange 4 Free: ' + err);
			hideLoading();
		}
		});
		
		
		
	}
	
	 
	 function getBeneficiaryListForUserAndCountry(callback) {
		//https://code.jquery.com/jquery-2.2.3.min.js
		
		var destinationCurrencyCode = $card.find('.payOutCurrencySelect').val();
		var destinationCountryCode = $card.find('.payOutCountrySelect').val();
		var payoutMethodValue= $card.find('.paymethodOutSelect').val();
		
		
	card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getBeneficiaryListForUserAndCountry/',{destinationCurrencyCode: destinationCurrencyCode,destinationCountryCode: destinationCountryCode,payoutMethodValue: payoutMethodValue} , function (err, response) {
		if (response) {
			if (response.returnData) {
				beneficiaryOption = $card.find('.beneficiaryOption');
				beneficiaryOption[0].options.length=0;
				beneficiaryOption.append($("<option />").val('Default').text('Select Beneficiary'));
				response.returnData.forEach(function(entry) {
					beneficiaryOption = $card.find('.beneficiaryOption');
					var $str = entry.firstName + ' ' + entry.surname;
					beneficiaryOption.append($("<option />").val(entry.beneficiaryId).text($str));
					
				}); 	
				
				callback();
			
			}
			else {
				showError('An error occured whilst obtaining the beneficiary list for the country selected' + response.message);
			}
			hideLoading();

       
		}
		else {
			showError('An error occured whilst obtaining the beneficiary list for the country selected' + err);
			hideLoading();
		}
		});
		
		
		
	}
	
	function displayLoading() {
		$card.find('.hdc-content').append(over);		
	}
	
	function hideLoading() {
		  $('#overlay').remove();		
	}
	
	function getCountryPayInCurrency(countryCode) {
		//https://code.jquery.com/jquery-2.2.3.min.js
				
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayinCurrencyList/', {sourceCountryCode : countryCode}, function (err, response) {
		if (response) {
			
			payInSelect = $card.find('.payInCurrencySelect');
			
			payInSelect[0].options.length=0;
			payInSelect.append($("<option />").val("Default").text("Select Pay In Currency"));
			if (response.returnData) {
			response.returnData.forEach(function(entry) {
				
				payInSelect = $card.find('.payInCurrencySelect');
				payInSelect.append($("<option />").val(entry.sourceCurrencyCode).text(entry.sourceCurrencyName));
								 
				 
				
			}); 
			
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
	
	function getCountryPayInOptions() {
		//https://code.jquery.com/jquery-2.2.3.min.js
				var sourceCountryCode = $card.find('.payInCountrySelect').val();
		var sourceCurrencyCode = $card.find('.payInCurrencySelect').val();
					
		
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayinMethodList/', {sourceCountryCode: sourceCountryCode, sourceCurrencyCode : sourceCurrencyCode}, function (err, response) {
		if (response) {
			if (response.returnData) {
				payInMethod = $card.find('.paymethodInSelect');
				
				payInMethod[0].options.length=0;
				payInMethod.append($("<option />").val('Default').text('Select Pay In Method'));
				
				response.returnData.forEach(function(entry) {
					
					payInMethod = $card.find('.paymethodInSelect');
					payInMethod.append($("<option />").val(entry.payinMethodValue).text(entry.payinMethodName));
					
				}); 	
				
			}
			
			else {
				showError('An error occured whilst attempting to obtain the country pay in options: '+ response.message);
			}
			hideLoading();

       
		}
		else {
			showError('An error occured whilst attempting to obtain the country pay in options: '+ err);
			hideLoading();
		}
		});
		
		
		
	}
	
	function getCountryPayOutOptions() {
		//https://code.jquery.com/jquery-2.2.3.min.js
		
		var destinationCountryCode = $card.find('.payOutCountrySelect').val();
		var destinationCurrencyCode = $card.find('.payOutCurrencySelect').val();
					
		
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayoutMethodList/', {destinationCountryCode: destinationCountryCode, destinationCurrencyCode : destinationCurrencyCode}, function (err, response) {
		if (response) {
			if (response.returnData) {
				payOutMethod = $card.find('.paymethodOutSelect');

				
				payOutMethod[0].options.length=0;
				payOutMethod.append($("<option />").val('Default').text('Select Pay Out Method'));
				response.returnData.forEach(function(entry) {
					
					payOutMethod = $card.find('.paymethodOutSelect');
					payOutMethod.append($("<option />").val(entry.payoutMethodValue).text(entry.payoutMethodName));
					
				}); 
				
				}
			else {
				showError('An error occured whilst attempting to obtain the country pay out options: ' + response.message);
			}
			hideLoading();

       
		}
		else {
			showError('An error occured whilst attempting to obtain the country pay out options: ' + err);
			hideLoading();
		}
		});
		
		
		
	}
	
	function getCountryPayOutCurrency(countryCode) {
		//https://code.jquery.com/jquery-2.2.3.min.js
		
		var srccountryCode=$card.find('.payInCountrySelect').val();
		var srcCurrencyCode=$card.find('.payInCurrencySelect').val();
		 
		
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayoutCurrencyList/', {sourceCountryCode : srccountryCode,sourceCurrencyCode: srcCurrencyCode,destinationCountryCode: countryCode}, function (err, response) {
		if (response) {
			
			payOutSelect = $card.find('.payOutCurrencySelect');
			
			payOutSelect[0].options.length=0;
			payOutSelect.append($("<option />").val("Default").text("Select Pay Out Currency"));
			if (response.returnData) {
			response.returnData.forEach(function(entry) {
				
				payOutSelect = $card.find('.payOutCurrencySelect');
				payOutSelect.append($("<option />").val(entry.destinationCurrencyCode).text(entry.destinationCurrencyName));
				
			}); 
			
			}
			else {
				showError('An error occured whilst obtaining the currency options for the pay out country: '+ response.message);
			}
			hideLoading();

       
		}
		else {
			showError('An error occured whilst obtaining the currency options for the pay out country: '+ err);
			hideLoading();
		}
		});
		
		
		
	}
	
}