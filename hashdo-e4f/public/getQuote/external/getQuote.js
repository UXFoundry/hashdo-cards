var __e4f = {

    getQuote: {
		onReady(c, dc, loc) {
			$card = dc;
			card = c;
			console.log(loc);
			locals = loc;
			importGetQuote();
		}
    }

};

var $card;
var card;
var locals;

function importGetQuote() {

    var over = '<div id="overlay"><img id="loading" src="images/loader.gif"></div>';
	function getCountryPayInCurrency(countryCode) {
		//https://code.jquery.com/jquery-2.2.3.min.js
				
		card.proxy.post('http://127.0.0.1:3000/e4f/getPayinCurrencyList/', {sourceCountryCode : countryCode}, function (err, response) {
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
	
	var $modal;
	
	function showError(text) {
		$modal = card.modal.open('<br><div class="hdc-error-text">' + text +'</div>'+ '<div class="hdc-errormodal-footer"><br><div class="hdc-errormodal-done" style="display: block;"><button type="button">OK</button></div></div>');
		
		$ok = $modal.find('.hdc-errormodal-done');
		$ok.on('click', function() {			
			card.modal.close();
			
		});
	}
	
	$card.find('.payInCurrencySelect').on('change', function () {
		displayLoading();
		getCountryPayInOptions();
		locals.sourceCurrencyCode  = $card.find('.payInCurrencySelect').val();
		$card.find('.payInMethodBlock').removeClass('hidden');
		
		
	});
	
	function getCountryPayInOptions() {
		//https://code.jquery.com/jquery-2.2.3.min.js
		var loggedInUserID = locals.userID;
		var sourceCountryCode = $card.find('.payInCountrySelect').val();
		var sourceCurrencyCode = $card.find('.payInCurrencySelect').val();
					
		//loggedInUserID req.body.userID, userID req.body.userID, sourceCountryCode req.body.sourceCountryCode,sourceCurrencyCode req.body.sourceCurrencyCode
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayinMethodList/', {loggedInUserID: loggedInUserID, userID: loggedInUserID,sourceCountryCode: sourceCountryCode, sourceCurrencyCode : sourceCurrencyCode}, function (err, response) {
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

	$card.find('.payInCountrySelect').on('change', function () {
		displayLoading();		
		getCountryPayInCurrency($card.find('.payInCountrySelect').val());
		locals.sourceCountryCode = $card.find('.payInCountrySelect').val();
		var selectedIndex = $card.find('.payInCountrySelect')[0].options.selectedIndex;
		locals.sourceCountryCodeText = $card.find('.payInCountrySelect')[0][selectedIndex].text;		
		$card.find('.payInCurrencyBlock').removeClass('hidden');
	});
	
	$card.find('.paymethodInSelect').on('change', function () {
		displayLoading();
		locals.payinMethodValue = $card.find('.paymethodInSelect').val();
		$card.find('.payOutCountryBlock').removeClass('hidden');
		hideLoading();
		
		
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
	
	function getCountryPayOutOptions() {
		//https://code.jquery.com/jquery-2.2.3.min.js
		var loggedInUserID = locals.userID;
		var destinationCountryCode = $card.find('.payOutCountrySelect').val();
		var destinationCurrencyCode = $card.find('.payOutCurrencySelect').val();
					
		//loggedInUserID req.body.userID, userID req.body.userID, sourceCountryCode req.body.sourceCountryCode,sourceCurrencyCode req.body.sourceCurrencyCode
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
	
	$card.find('.paymethodOutSelect').on('change', function () {
		displayLoading();
		$card.find('.payOptionBlock').removeClass('hidden');
		locals.transactionType = $card.find('.paymethodOutSelect').val();
		hideLoading();
		
	});
	
	$card.find('.payOption').on('change', function () {
		displayLoading();
		locals.providedAmountOption = $card.find('.payOption').val();
		$card.find('.getQuoteBlock').removeClass('hidden');		
		hideLoading();
		
		
	});
	
	$card.find('.getQuoteBtn').on('click', function () {
		//displayLoading();
		
		locals.providedAmount = $card.find('.payValue').val();
		
		getQuotationCalculator(function() {
			$card.find('.quoteResults').removeClass('hidden');	
			
			
			
			$card.find('.payInCountrySelect').attr('disabled',false);
			$card.find('.payInCurrencySelect').attr('disabled',false);
			$card.find('.payOutCountrySelect').attr('disabled',false);
			$card.find('.paymethodInSelect').attr('disabled',false);
			$card.find('.payOutCurrencySelect').attr('disabled',false);
			
			$card.find('.paymethodOutSelect').attr('disabled',false);
			hideLoading();
			
		});
		
		
		
	});
	
	function displayLoading() {
		$card.find('.hdc-content').append(over);		
	}
	
	function hideLoading() {
		  $('#overlay').remove();		
	}
	
	var $quoteTimeStamp;
	
	function getQuotationCalculator(callback) {
		//https://code.jquery.com/jquery-2.2.3.min.js
		var loggedInUserID = locals.userID;
		var sourceCountryCode = $card.find('.payInCountrySelect').val();
		var sourceCurrencyCode = $card.find('.payInCurrencySelect').val();
		var destinationCurrencyCode = $card.find('.payOutCurrencySelect').val();
		var destinationCountryCode = $card.find('.payOutCountrySelect').val();
		var payinMethodValue= $card.find('.paymethodInSelect').val();
		var payoutMethodValue= $card.find('.paymethodOutSelect').val();
		var providedAmountOption= $card.find('.payOption').val();
		var providedAmount= $card.find('.payValue').val();
		
		//{apiPartnerId: 19, apiPartnerUsername: 'AlanWalker', apiPartnerPassword: 'Al@ne4FAP1', loggedInUserID: req.body.loggedInUserID, userId : req.body.loggedInUserID,sourceCurrencyCode: req.body.sourceCurrencyCode,sourceCountryCode: req.body.sourceCountryCode,destinationCurrencyCode: req.body.destinationCurrencyCode,destinationCountryCode: req.body.loggedInUserID,payinMethodValue: req.body.payinMethodValue,payoutMethodValue: req.body.payoutMethodValue,providedAmountOption: req.body.providedAmountOption,providedAmount: req.body.providedAmount
		card.proxy.post('http://guinness.exchange4free.com:3000/e4f/quotationCalculator/',{loggedInUserID: loggedInUserID,sourceCountryCode: sourceCountryCode,sourceCurrencyCode: sourceCurrencyCode,destinationCurrencyCode: destinationCurrencyCode,destinationCountryCode: destinationCountryCode,payinMethodValue: payinMethodValue,payoutMethodValue: payoutMethodValue,providedAmountOption: providedAmountOption,providedAmount: providedAmount} , function (err, response) {
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

}
