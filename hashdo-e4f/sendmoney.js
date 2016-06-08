var async = require('async');

module.exports = {
  name: 'SendMoney',
  description: 'E4F Send Money Online',
  icon: 'http://cdn.hashdo.com/icons/html.png',
  clientStateSupport: true,
  clientProxySupport: true,

  inputs: {
	partnerId: {
      example: '01',
      description: 'API Partner ID.',
      secure: true,
      required: true
    },
	partnerUsername: {
      example: 'username',
      description: 'API Partner Username.',
      secure: true,
      required: true
    },
	partnerPassword: {
      example: 'password',
      description: 'API Partner Password.',
      secure: true,
      required: true
    },
	E4FUserId: {
      example: '132785',
      description: 'Authenticated User Token.',
      secure: true,
      required: true
    }	  
   

  },
  
  

  getCardData: function (inputs, state, callback) {
	 async.waterfall([
		//e4f_logon,
		//e4f_getPayInCountries,
		prePopulate_e4fData,
		handovertoHashDo
	 
	 ],function(err) {
		 console.log("ERROR #################################");
		 console.log(err);
	 });
	
	function handovertoHashDo(dataIn) {
		//console.log(dataIn.e4f_getPayOutCountries.count);
		//console.log("HEre");
		//console.log(htmlIn);
		var viewModel = {
			title: 'Information',		  
			payInCountries: dataIn.e4f_getPayInCountries,
			payOutCountries: dataIn.e4f_getPayOutCountries		  
		};
		
		var clientLocals = {
			userID: inputs.LoggedInUserID		
		};
		callback(null, viewModel, clientLocals);
		
		
	}
	
	function sortPayInCountriesbyName(x,y) {
		return ((x.sourceCountryName == y.sourceCountryName) ? 0 : ((x.sourceCountryName > y.sourceCountryName) ? 1 : -1 ));
	}
	
	function sortPayOutCountriesbyName(x,y) {
		return ((x.destinationCountryName == y.destinationCountryName) ? 0 : ((x.destinationCountryName > y.destinationCountryName) ? 1 : -1 ));
	}
	
	function prePopulate_e4fData(callback) {
		async.parallel({
			e4f_getPayInCountries: function(callback){
				//console.log("GettingPayInCountries");
				var url = 'http://guinness.exchange4free.com:3000/e4f/getPayInCountryList';
				var args = {			
					E4FUserId: inputs.E4FUserId
				};
		
				var request = require('request');
				request.post(url, {json: true, body: args}, function(err, res, body) {
				if (!err && res.statusCode === 200) {
					var sourceCountries = res.body.returnData;
					sourceCountries.sort(sortPayInCountriesbyName);
					//console.log(sourceCountries);
					callback(null, sourceCountries);
				}
				});			
				
			},
			e4f_getPayOutCountries: function(callback){
				//console.log("GettingPayOutCountries");
				var url = 'http://guinness.exchange4free.com:3000/e4f/getPayOutCountryList';
				var args = {			
					E4FUserId: inputs.E4FUserId
					  
				};
		
				var request = require('request');
				request.post(url, {json: true, body: args}, function(err, res, body) {
				if (!err && res.statusCode === 200) {
					var destinationCountries = res.body.returnData;
					destinationCountries.sort(sortPayOutCountriesbyName);					
					callback(null, destinationCountries);
				}
				});		
			}
		},
		function(err, results) {
			callback(null,results);
		});
		
	}
	

	
    /*
	function e4f_logon(callback) {
		console.log("Logging on User");
				var url = 'http://guinness.exchange4free.com:3000/e4f/userLogIn';
				var args = {
					partnerId: 45,
					partnerUsername: 'e4fmobile',
					partnerPassword: 'e4fM0b1le',
					username: 'MUM88566152',
					password: 'Demo123!'  
				};
		
				var request = require('request');
				request.post(url, {json: true, body: args}, function(err, res, body) {
				if (!err && res.statusCode === 200) {
					console.log(body.returnData);
					LoggedInUserID = (res.body.returnData.userId);
					//console.log(res.body.returnData);
					callback(null, LoggedInUserID);
				}
				});			
		
	
	
	}*/
		

   
    
    
    
    
  }
};

