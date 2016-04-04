var SOAP = require('soap'),
  _ = require('lodash'),

  genericErrorMessage = 'Invalid Exchange4Free API response';

exports.execute = execute;

function execute(apiUrl, method, args, callback) {
  SOAP.createClient(apiUrl + _.camelCase(method) + '.wsdl', function (err, client) {
    if (err) {
      callback && callback(err);
    }
    else {
      var func = client[_.upperFirst(method)];

      if (func) {
        func.call(null, args, function (err, result) {
          if (err) {
            callback && callback(err);
          }
          else if (!result) {
            callback && callback(genericErrorMessage);
          }
          else {
            if (result.statusCode === 200 || result.statusCode === 202) {
              callback && callback(null, result.returnData || {});
            }
            else {
              callback && callback(result.message || genericErrorMessage);
            }
          }
        });
      }
      else {
        callback && callback('Unknown API Endpoint.');
      }
    }
  });
}