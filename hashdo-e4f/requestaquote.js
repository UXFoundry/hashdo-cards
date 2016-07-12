var async = require('async');

module.exports = {
    name: 'RequestAQuote',
    description: 'E4F Request a Quote',
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
        if (state.localData) {

            async.waterfall([
                prePopulate_e4fData,
                handovertoHashDo

            ], function (err) {
                console.log("ERROR #################################");
                console.log(err);
            });           
           
        }

        else {
            console.log('No state data');
            async.waterfall([
                prePopulate_e4fData,
                handovertoHashDo

            ], function (err) {
                console.log("ERROR #################################");
                console.log(err);
            });
        }


        function handovertoHashDo(dataIn) {
            var viewModel = {
                title: 'Information',
                payInCountries: dataIn.e4f_getPayInCountries,
                payOutCountries: dataIn.e4f_getPayOutCountries
            };
            var clientLocals = {
                userID: inputs.LoggedInUserID,
                stateData: state.localData
            };
            callback(null, viewModel, clientLocals);

        }

        function prePopulate_e4fData(callback) {
            async.parallel({
                e4f_getPayInCountries: function (callback) {
                    var url = 'http://guinness.exchange4free.com:3000/e4f/getPayInCountryCurrencyList';
                    var args = {
                        E4FUserId: inputs.E4FUserId
                    };

                    var request = require('request');
                    request.post(url, { json: true, body: args }, function (err, res, body) {
                        if (!err && res.statusCode === 200) {
                            var sourceCountries = res.body.returnData;
                            callback(null, sourceCountries);
                        }
                    });
                },
                e4f_getPayOutCountries: function (callback) {
                    var url = 'http://guinness.exchange4free.com:3000/e4f/getPayOutCountryCurrencyList';
                    var args = {
                        E4FUserId: inputs.E4FUserId
                    };

                    var request = require('request');
                    request.post(url, { json: true, body: args }, function (err, res, body) {
                        if (!err && res.statusCode === 200) {                            
                            var destinationCountries = res.body.returnData;
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

