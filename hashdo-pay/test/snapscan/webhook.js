var Request = require('request');

exports.webhook = function (req, res) {
  Request.post({
    url: 'http://localhost:' + (process.env.PORT || 4000) + '/webhook/pay/snapscan',
    form: {
      payload: '{"id":' + (Math.random() * (1000 - 1) + 1).toFixed() + ',"status":"completed","totalAmount":' + req.query.amount + ',"tipAmount":0,"feeAmount":' + req.query.amount * 0.03 + ',"settleAmount":' + req.query.amount * 0.97 + ',"requiredAmount":' + req.query.amount + ',"date":"' + new Date().toISOString() + '","snapCode":"xandgo","snapCodeReference":"da4c9002-f99e-4924-bfd0-d991fc3f2503","userReference":null,"merchantReference":"' + req.query.id + '","statementReference":null,"authCode":"' + (Math.random() * (10000 - 1) + 1).toFixed() + '","deliveryAddress":null}'
    },
    json: true
  }, function (err, response, body) {
    if (err) {
      res.status(500);
    }
    else {
      res.status(200);
    }

    res.send(body);
  });
};
