module.exports = {
  name: 'Place',
  description: 'An X&Go Place Card.',
  icon: 'http://cdn.hashdo.com/icons/place.png',

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
    placeId: {
      example: '552fa62425186c6012edcf18',
      description: 'The X&Go ID of the place to display.',
      required: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var XandGo = require('./lib/xandgo'),
      card = this;

    // enable client side js support
    card.client$Support = true;

    XandGo.getDataVersion(inputs.apiKey, inputs.secret, 'places', function (version) {
      version = version || 0;

      if (state.place && state.version === version) {
        callback(null, state.place);
      }
      else {
        XandGo.getPlace(inputs.apiKey, inputs.secret, inputs.placeId, function (place) {
          if (place) {
            var viewModel = place;

            // save state
            state.place = place;
            state.version = version;

            callback(null, viewModel);
          }
          else {
            callback(new Error('Could not find place with ID ' + (inputs.placeId || '?')));
          }
        });
      }
    });
  }
};

