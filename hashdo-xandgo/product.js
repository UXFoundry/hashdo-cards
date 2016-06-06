module.exports = {
  name: 'Product',
  description: 'An X&Go Product Card.',
  icon: 'http://cdn.hashdo.com/icons/cart.png',

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
    productId: {
      example: '552fa62425186c6012edcf18',
      description: 'The X&Go ID of the product to display.',
      required: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var XandGo = require('./lib/xandgo'),
      card = this;

    // enable client side js support
    card.client$Support = true;

    XandGo.getDataVersion(inputs.apiKey, inputs.secret, 'products', function (version) {
      version = version || 0;

      if (state.product && state.version === version) {
        if (state.product.photos.length === 0) {
          card.client$Support = false;
        }

        callback(null, state.product, {photoCount: state.product.photos.length});
      }
      else {
        XandGo.getProduct(inputs.apiKey, inputs.secret, inputs.productId, function (product) {
          if (product) {
            var viewModel = product;

            // save state
            state.product = product;
            state.version = version;

            if (product.photos.length === 0) {
              card.client$Support = false;
            }

            callback(null, viewModel, {photoCount: product.photos.length});
          }
          else {
            callback('Could not find product with ID ' + (inputs.productId || '?'));
          }
        });
      }
    });
  }
};

