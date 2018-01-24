var async = require('async');

module.exports = {
	name: 'GetQuote',
	description: 'E4F Get Foreign Exchange Quotation',
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
			prePopulate_e4fData,
			handovertoHashDo

		], function (err) {
			console.log("ERROR #################################");
			console.log(err);
		});

		function handovertoHashDo(dataIn) {
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

		function sortPayInCountriesbyName(x, y) {
			return ((x.sourceCountryName == y.sourceCountryName) ? 0 : ((x.sourceCountryName > y.sourceCountryName) ? 1 : -1));
		}

		function sortPayOutCountriesbyName(x, y) {
			return ((x.destinationCountryName == y.destinationCountryName) ? 0 : ((x.destinationCountryName > y.destinationCountryName) ? 1 : -1));
		}

		function prePopulate_e4fData(callback) {
			async.parallel({
				e4f_getPayInCountries: function (callback) {
					var url = 'http://guinness.exchange4free.com:3000/e4f/getPayInCountryList';
					var args = {
						E4FUserId: inputs.E4FUserId
					};

					var request = require('request');
					request.post(url, { json: true, body: args }, function (err, res, body) {
						if (!err && res.statusCode === 200) {
							var sourceCountries = res.body.returnData;
							sourceCountries.sort(sortPayInCountriesbyName);
							callback(null, sourceCountries);
						}
					});
				},
				e4f_getPayOutCountries: function (callback) {
					var url = 'http://guinness.exchange4free.com:3000/e4f/getPayOutCountryList';
					var args = {
						E4FUserId: inputs.E4FUserId
					};

					var request = require('request');
					request.post(url, { json: true, body: args }, function (err, res, body) {
						if (!err && res.statusCode === 200) {
							var destinationCountries = res.body.returnData;
							destinationCountries.sort(sortPayOutCountriesbyName);
							callback(null, destinationCountries);
						}
					});
				}
			},
				function (err, results) {
					callback(null, results);
				});

		}

	}
};

