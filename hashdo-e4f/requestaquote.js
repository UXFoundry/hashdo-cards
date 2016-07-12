var Async = require('async'),
  Request = require('request');

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
      Async.waterfall(
        [
          prePopulate_e4fData,
          handovertoHashDo
        ],
        function (err) {
          console.log("ERROR #################################");
          console.log(err);
        }
      );
    }
    else {
      Async.waterfall(
        [
          prePopulate_e4fData,
          handovertoHashDo
        ],
        function (err) {
          console.log("ERROR #################################");
          console.log(err);
        }
      );
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
      Async.parallel({
        e4f_getPayInCountries: function (cb) {
          var url = 'http://guinness.exchange4free.com:3000/e4f/getPayInCountryCurrencyList';
          var args = {
            E4FUserId: inputs.E4FUserId
          };

          Request.post(url, {json: true, body: args}, function (err, res, body) {
            if (!err && res.statusCode === 200) {
              var sourceCountries = res.body.returnData;
              cb(null, sourceCountries);
            }
            else {
              cb();
            }
          });
        },

        e4f_getPayOutCountries: function (cb) {
          var url = 'http://guinness.exchange4free.com:3000/e4f/getPayOutCountryCurrencyList';
          var args = {
            E4FUserId: inputs.E4FUserId
          };

          Request.post(url, {json: true, body: args}, function (err, res, body) {
            if (!err && res.statusCode === 200) {
              var destinationCountries = res.body.returnData;
              cb(null, destinationCountries);
            }
            else {
              cb();
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

