module.exports = {
  name: 'SnapScan',
  description: 'Pay via SnapScan.',
  icon: 'http://cdn.hashdo.com/icons/snapscan.png',
  clientStateSupport: true,

  inputs: {
    url: {
      example: 'https://pos.snapscan.io/qr/xandgo',
      label: 'URL',
      description: 'SnapScan payment URL.',
      secure: true,
      required: true
    },
    id: {
      example: '552fa62012edcf18-0123456',
      label: 'ID',
      description: 'The payment\'s unique ID.',
      secure: true,
      required: true
    },
    amount: {
      example: 100,
      label: 'Amount',
      description: 'The amount (in cents) to be paid.',
      prompt: true,
      required: true
    }
  },

  getCardData: function (inputs, state, callback) {
    // By default we don't want extra client code.
    this.clientStateSupport = false;

    var viewModel = {
      total: state.total || inputs.amount,
      status: state.status || 'pending',
      title: 'SnapScan Payment'
    };

    if (!state.total) {
      // Ensure client code is injected, but only if the payment is still pending.
      this.clientStateSupport = true;
      viewModel.link = inputs.url + '?amount=' + inputs.amount + '&id=' + inputs.id + '-' + inputs.token;
    }

    callback(null, viewModel);
  },

  webHook: function (payload, callback) {
    if (payload.status === 'completed') {
      var requestId = '',
        code = '',
        token = '';

      if (payload.merchantReference && payload.merchantReference.indexOf('-') > -1) {
        var params = payload.merchantReference.split('-');
        requestId = params[0];
        code = params[1];
        token = params[2];
      }

      callback(null, {amount: payload.requiredAmount, token: token}, {
        requestId: requestId,
        code: code,
        total: payload.totalAmount,
        authCode: payload.authCode,
        status: 'paid'
      });
    }
    else {
      callback();
    }
  }
};

