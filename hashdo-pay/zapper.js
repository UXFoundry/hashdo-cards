/**  * Zapper
 * Make payments with Zapper
 * NB: This module and it's variables are cached (like a singleton).
 * 
 * @module Zapper
 */
module.exports = {
  name: 'Zapper',
  description: 'Make payments with Zapper',
  icon: 'icon.png',
  clientStateSupport: true,
  
  /**
   * Inputs required to generate and render this card.
   * These will also be displayed on #Do administration screens to assist users in providing the correct data to create a card.
   *
   * @property inputs
   * @type Object
   */
  inputs: {
    merchantName: {
      example: 'HashDo',
      label: 'Application or Merchant Name',
      description: 'The name that will appear in Zapper to whom the payment is being made.',
      required: true,
      secure: true
    },
    merchantId: {
      example: 10,
      label: 'Merchant ID',
      description: 'The unique merchant ID assigned to you when joining Zapper.',
      required: !process.env.ZAPPER_MERCHANT_ID,
      secure: true
    },
    siteId: {
      example: 10,
      label: 'Site ID',
      description: 'Unique ID tied to the merchant ID defining which site the payment is being made from.',
      required: !process.env.ZAPPER_SITE_ID,
      secure: true
    },
    posApiUrl: {
      example: 'http://qa.pointofsale.zapzapadmin.com',
      label: 'POS API URL',
      description: 'API key to access Zapper online POS system.',
      required: !process.env.ZAPPER_POS_API_URL,
      secure: true
    },
    posKey: {
      example: '6E4A8B1D-2715-453A-83A9-5CEA976A1B7A',
      label: 'POS Key',
      description: 'API key to access Zapper online POS system.',
      required: !process.env.ZAPPER_POS_KEY,
      secure: true
    },
    posSecret: {
      example: 'DD9B7A6B-A3D8-43ED-AF5F-DA762F59A799',
      label: 'POS Secret',
      description: 'API secret paired with the POS key to access Zapper online POS system.',
      required: !process.env.ZAPPER_POS_SECRET,
      secure: true
    },
    paymentId: {
      example: '552fa62012edcf18-0123456',
      label: 'Payment ID',
      description: 'The payment\'s unique ID.',
      required: true,
      secure: true
    },
    description: {
      example: 'Payment for movie tickets.',
      label: 'Description',
      description: 'The description of the payment being made. This will be displayed in the Zapper application.',
      required: false,
      prompt: true,
      secure: true
    },
    amount: {
      example: 400,
      label: 'Amount',
      description: 'The required payment amount in cents.',
      required: true,
      prompt: true
    },
    currency: {
      example: 'ZAR',
      label: 'Currency',
      description: 'The ISO currency code that the payment needs to be made in.',
      required: true,
      prompt: true
    }
  },

  /**
   * Generate or restore view model for template based on inputs and current card state.
   * Update any card state if necessary for subsequent calls to getCardData.
   *
   * @method getCardData
   * @async
   * @param {Object}   inputs    Inputs provided by the application or the user.
   * @param {Object}   state     Saved state information about the card, empty object if no state is available.
   * @param {Function} callback  Callback function to signal that any async processing in this card is complete. function([error], [viewModel], [clientLocals])
   */
  getCardData: function (inputs, state, callback) {
    this.clientStateSupport = true;
    
    // Validate
    var paymentInfo = inputs.paymentId.split('-');
    
    // uniqueReference cannot be greater than 16 chars.
    if (paymentInfo.length !== 2 || inputs.paymentId[0].length > 16) {
      callback(new Error('Invalid paymentId value: ' + inputs.paymentId));
      return;
    }
    
    // Apply defaults
    inputs.merchantId = inputs.merchantId || process.env.ZAPPER_MERCHANT_ID;
    inputs.siteId = inputs.siteId || process.env.ZAPPER_SITE_ID;
    inputs.posApiUrl = inputs.posApiUrl || process.env.ZAPPER_POS_API_URL;
    inputs.posKey = inputs.posKey || process.env.ZAPPER_POS_KEY;
    inputs.posKey = inputs.posKey || process.env.ZAPPER_POS_SECRET;
    
    var Currency = require('currency-symbol.js'),
      Request = require('request'),
      Sha256 = require('crypto').createHash('sha256'),
      _ = require('lodash');

    Sha256.update(inputs.posSecret + '&' + inputs.posKey);

    var apiRequestUrl = _.trimRight(inputs.posApiUrl, '/') + '/api/v2/merchants/' + inputs.merchantId + '/sites/' + inputs.siteId + '/payments?PosReference=' + paymentInfo[0];

    var apiRequestHeaders = {
      siteid: inputs.siteId,
      poskey: inputs.posKey,
      possecret: inputs.posSecret,
      signature: Sha256.digest('hex')
    };

    var viewModel = {
      symbol: Currency.symbolize(inputs.currency.toUpperCase()),
      amount: (Number(inputs.amount) / 100).toFixed(2),
      description: inputs.description,
      footer: 'Pay Now',
      title: 'Zapper Payment'
    };

    var clientLocals = {
      posApiUrl: apiRequestUrl,
      posApiHeaders: apiRequestHeaders
    };

    function generateQrCode() {
      // Build the QR code data.
      var paymentUrl = 'http://2.zap.pe?t=4&i={merchantId}:{siteId}'
        .replace('{merchantId}', inputs.merchantId)
        .replace('{siteId}', inputs.siteId);

      var paymentData = ':7[34|{amount}|11,33|{orderNumber}|10,66|{uniqueReference}'
        .replace('{amount}', (Number(inputs.amount) / 100).toFixed(2))
        .replace('{orderNumber}', paymentInfo[1])
        .replace('{uniqueReference}', paymentInfo[0]);

      var descriptionData = ':8[0n|{description}|11|{label}'
        .replace('{description}', inputs.description)
        .replace('{label}', 'Description');

      var merchantData = ':10[38|{name},39|{currency}'
        .replace('{name}', inputs.merchantName)
        .replace('{currency}', inputs.currency.toUpperCase());

      var qrCode = paymentUrl + paymentData;

      if (inputs.description && inputs.description !== '') {
        qrCode += descriptionData;
      }

      qrCode += merchantData;

      return qrCode;
    }

    function paymentComplete() {
      // Don't add client code unless the card is for a new payment.
      viewModel.description = 'Payment was completed';
      viewModel.footer = 'Thank You';

      callback(null, viewModel);
    }

    function newPayment() {
      var qrCode = generateQrCode();
      viewModel.link = 'zapper://payment?qr=' + encodeURIComponent(qrCode) + '&appName=HashDo';
      
      // TODO: Remove this when callbacks become optional.
      viewModel.link += '&successCallbackURL=test&failureCallbackURL=test';

      callback(null, viewModel, clientLocals);
    }

    if (state.status === 'complete') {
      this.clientStateSupport = false;
      paymentComplete();
    }
    else {
      // Check the API to see if it was completed.
      Request({
        url: apiRequestUrl,
        headers: apiRequestHeaders,
        json: true
      },
      function (err, response, body) {
        if (!err && response && response.statusCode === 200 && body && body.data && body.data.length > 0) {
          // Update the state.
          state.status = 'complete';
          state.response = body;

          this.clientStateSupport = false;
          paymentComplete();
        }
        else {
          newPayment();
        }
      });
    }
  }
};

