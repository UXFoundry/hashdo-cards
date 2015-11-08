var Request = require('request');

exports.getSimBalance = function (apiUrl, customerId, merchantId, session, apiKey, MSISDN, callback) {
  Request(
    {
      method: 'POST',
      url: apiUrl + '/console/index.php?route=rest/mysims/simbalance&customer_id=' + customerId,
      headers: {
        'X-Oc-Merchant-Id': merchantId,
        'X-Oc-Session': session,
        'XandGoKey': apiKey
      },
      json: true,
      body: {"MSISDN": MSISDN}
    },
    function (err, res, body) {
      if (err) {
        callback && callback(err);
      }
      else if (body) {
        if (!body.success || !body.Result) {
          callback && callback(body.error || 'Invalid me&you API response');
        }
        else {
          callback && callback(null, body.Result);
        }
      }
      else {
        callback && callback('Invalid me&you API response');
      }
    }
  );
};