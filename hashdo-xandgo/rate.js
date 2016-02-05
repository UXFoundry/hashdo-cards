module.exports = {
  name: 'Rate',
  description: 'Rate a request.',
  icon: 'http://cdn.hashdo.com/icons/rate.png',
  clientStateSupport: true,

  inputs: {
    apiKey: {
      example: 'abcdefghijklmnopqrstuvwxyz',
      description: 'API Key.',
      secure: true,
      required: true
    },
    secret: {
      example: 'abcdefghijklmnopqrstuvwxyz',
      description: 'API Key\'s Secret.',
      secure: true,
      required: true
    },
    requestId: {
      example: '552fa62425186c6012edcf18',
      description: 'The current request\'s ID.',
      required: true
    },
    header: {
      example: 'Please take a moment to rate our service.',
      description: 'The header text displayed within the card.',
      required: false
    }
  },

  getCardData: function (inputs, state, callback) {
    var XandGo = require('./lib/xandgo');

    // disable client state and proxy support
    this.clientStateSupport = false;
    this.clientProxySupport = false;

    var viewModel = {
      title: 'Rate our Service',
      header: inputs.header || 'Please take a moment to rate our service.',
      rating: state.rating || 0
    };

    if (state.rating > 0) {
      callback(null, viewModel);
    }
    else {
      XandGo.getRequestRating(inputs.apiKey, inputs.secret, inputs.requestId, function (rating) {
        if (rating > 0) {
          state.rating = rating;
          viewModel.rating = rating;

          callback(null, viewModel);
        }
        else {
          // enable client state and proxy support
          this.clientStateSupport = true;
          this.clientProxySupport = true;

          callback(null, viewModel);
        }
      }.bind(this));
    }
  }
};

