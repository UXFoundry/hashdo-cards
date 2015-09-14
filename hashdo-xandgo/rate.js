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
    var _ = require('lodash');

    function getRating(callback) {
      var Request = require('request');

      Request.post({
        url: 'http://xandgo.com/api/request/rating',
        form: {
          apiKey: inputs.apiKey,
          secret: inputs.secret,
          requestId: inputs.requestId
        },
        json: true
      }, function (err, response, body) {
        if (!err) {
          if (body.success) {
            callback(body.rating);
          }
          else {
            callback();
          }
        }
        else {
          console.error('XandGo-Rate: Error getting X&Go rating for request ID ' + inputs.requestId, err);
          callback();
        }
      });
    }

    // By default we don't want extra client code.
    this.clientStateSupport = false;

    var viewModel = {
      title: 'Rate our Service',
      header: inputs.header || 'Please take a moment to rate our service.',
      rating: state.rating || 0
    };

    if (state.rating > 0) {
      callback(null, viewModel);
    }
    else {
      getRating(function (rating) {
        if (rating > 0) {
          state.rating = rating;

          callback(null, _.merge(viewModel, state));
        }
        else {
          // Ensure client code is injected, but only if the rating hasn't yet been made.
          this.clientStateSupport = true;

          callback(null, viewModel, {
            apiKey: inputs.apiKey,
            secret: inputs.secret,
            requestId: inputs.requestId
          });
        }
      }.bind(this));
    }
  }
};

