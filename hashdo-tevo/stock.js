module.exports = {
  name: 'Out of Stocks',
  description: 'Product physical, computer and required counts.',
  icon: 'http://cdn.hashdo.com/icons/stock.png',
  clientStateSupport: true,

  inputs: {
    apiKey: {
      example: 'abcdefghijklmnopqrstuvwxyz',
      description: 'X&Go API Key.',
      secure: true,
      required: true
    },
    secret: {
      example: 'abcdefghijklmnopqrstuvwxyz',
      description: 'X&Go API Key\'s Secret.',
      secure: true,
      required: true
    },
    appId: {
      example: '552fa62425186c6012edcf18',
      description: 'A valid X&Go App ID.',
      secure: true,
      required: true
    }
  },

  getCardData: function (inputs, state, callback) {

    function getProducts(callback) {
      var Request = require('request');

      Request.post({
        url: 'http://xandgo.com/api/products',
        form: {
          apiKey: inputs.apiKey,
          secret: inputs.secret,
          appId: inputs.appId
        },
        json: true
      }, function (err, response, body) {
        if (!err) {
          if (body.success) {
            var products = body.products || [],
              result = [];

            for (var i = 0; i < products.length; i++) {
              result.push(products[i].name);
            }

            callback(result);
          }
          else {
            callback();
          }
        }
        else {
          console.error('Tevo-Stock: Error getting X&Go products for app ID ' + inputs.appId, err);
          callback();
        }
      });
    }

    // By default we don't want extra client code.
    this.clientStateSupport = false;

    var viewModel = {
      title: 'Out of Stocks',
      entries: state.entries || [],
      active: false
    };

    if (state.entries && state.entries.length > 0) {
      callback(null, viewModel);
    }
    else {
      getProducts(function (products) {
        this.clientStateSupport = true;

        viewModel.products = products;
        viewModel.active = true;

        callback(null, viewModel);
      }.bind(this));
    }
  }
};

