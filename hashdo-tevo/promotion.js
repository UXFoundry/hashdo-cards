module.exports = {
  name: 'Promotion Space',
  description: 'How are products displayed for promotion.',
  icon: 'http://cdn.hashdo.com/icons/promotion.png',
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
    },
    firstName: {
      example: 'Joe',
      description: 'The current user\'s first name.'
    },
    lastName: {
      example: 'Public',
      description: 'The current user\'s last name.'
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
      },
        function (err, response, body) {
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
            console.error('Tevo-Promotion: Error getting X&Go products for app ID ' + inputs.appId, err);
            callback();
          }
        }
      );
    }

    // By default we don't want extra client code.
    this.clientStateSupport = false;
    this.clientAnalyticsSupport = false;

    var viewModel = {
      title: 'Promotion Space',
      entries: state.entries || [],
      active: false
    };

    if (state.entries && state.entries.length > 0) {
      callback(null, viewModel);
    }
    else {
      getProducts(function (products) {
        this.clientStateSupport = true;
        this.clientAnalyticsSupport = true;

        viewModel.products = products;
        viewModel.active = true;

        callback(null, viewModel, {
          appId: inputs.appId,
          user: {
            name: inputs.firstName + ' ' + inputs.lastName
          }
        });
      }.bind(this));
    }
  }
};

