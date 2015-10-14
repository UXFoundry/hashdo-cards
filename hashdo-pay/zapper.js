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
      example: 11620,
      label: 'Merchant ID',
      description: 'The unique merchant ID assigned to you when joining Zapper.',
      required: true,
      secure: true
    },    
    siteId: {
      example: 10232,
      label: 'Site ID',
      description: 'Unique ID tied to the merchant ID defining which site the payment is being made from.',
      required: true,
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
   * NB: 
   *
   * @method getCardData
   * @async
   * @param {Object}   inputs    Inputs provided by the application or the user.
   * @param {Object}   state     Saved state information about the card, empty object if no state is available.
   * @param {Function} callback  Callback function to signal that any async processing in this card is complete. function([error], [viewModel], [clientLocals])
   */
  getCardData: function (inputs, state, callback) {
    // Validate
    var paymentInfo = inputs.paymentId.split('-');
    
    // uniqueReference cannot be greater than 16 chars.
    if (paymentInfo.length !== 2 || inputs.paymentId[0].length > 16) {
      callback(new Error('Invalid paymentId value: ' + inputs.paymentId));
    }
      
    var Currency = require('currency-symbol.js'),
      Sha256 = require('crypto').createHash('sha256');
    
    var posKey = process.env.ZAPPER_POS_KEY || '',
      posSecret = process.env.ZAPPER_POS_SECRET || '';
      
    Sha256.update(posKey + '&' + posSecret);
    
    // By default we don't want extra client code.
    this.clientStateSupport = false;
    
    // Generate view model to render your view template.
    var viewModel = {
      symbol: Currency.symbolize(inputs.currency.toUpperCase()),
      amount: (Number(inputs.amount) / 100).toFixed(2),
      description: inputs.description,
      footer: 'Pay Now',
      title: 'Zapper Payment'
    };
    
    if (state.status !== 'complete') {      
      this.clientStateSupport = true;
      
      // Build the QR code data.
      var paymentUrl = 'http://2.zap.pe?t=4&i={merchantId}:{siteId}'
        .replace('{merchantId}', inputs.merchantId)
        .replace('{siteId}', inputs.siteId);
        
      var paymentData = ':7[34|{amount}|11,33|{orderNumber}|10,66|{uniqueReference}'
        .replace('{amount}', inputs.amount)
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
      
      viewModel.link = 'zapper://payment?qr=' + encodeURIComponent(qrCode) + '&appName=HashDo&successCallbackURL=test&failureCallbackURL=test';
    }
    else {
      viewModel.description = 'Payment was completed';
      viewModel.footer = 'Thank You';
    }
    
    callback(null, viewModel, {
      description: inputs.description,
      merchantId: inputs.merchantId,
      siteId: inputs.siteId,
      reference: paymentInfo[0],
      posKey: posKey,
      posSecret: posSecret,
      signature: Sha256.digest('hex')
    });
  }
};

