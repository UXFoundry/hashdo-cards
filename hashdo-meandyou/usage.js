module.exports = {
  name: 'My account usage',
  description: 'My me&you account usage.',
  icon: 'http://cdn.hashdo.com/icons/meandyou.png',

  inputs: {
    customerId: {
      example: '123456789',
      description: 'A me&you customer id.',
      required: true,
      secure: true
    },
    MSISDN: {
      example: '27831234567',
      description: 'A valid MSISDN number.',
      required: true,
      secure: true
    },
    merchantId: {
      example: 'merchant',
      description: 'A valid me&you API merchant id.',
      required: !process.env.ME_YOU_MERCHANT_ID,
      secure: true
    },
    session: {
      example: '324235dsfsdg324',
      description: 'A valid me&you API session key.',
      required: true,
      secure: true
    },
    apiUrl: {
      example: 'http://api.com',
      description: 'A valid API endpoint url.',
      required: !process.env.ME_YOU_HOST_URL,
      secure: true
    },
    apiKey: {
      example: 'dfsdf324234DSfddd',
      description: 'A valid me&you API key',
      required: !process.env.ME_YOU_API_KEY,
      secure: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var MeAndYou = require('./lib/meandyou'),
      Request = require('request'),
      _ = require('lodash');

    MeAndYou.getSimBalance(inputs.apiUrl, inputs.customerId, inputs.merchantId, inputs.session, inputs.apiKey, inputs.MSISDN, function (err, data) {
      var viewModel = {

      };

      callback(null, viewModel);
    });
  }
};

