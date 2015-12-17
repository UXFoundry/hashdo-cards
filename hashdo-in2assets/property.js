module.exports = {
  name: 'Property',
  description: 'In2Assets Property Card.',
  icon: 'http://cdn.hashdo.com/icons/in2assets.png',

  inputs: {
    reference: {
      example: 'AUCT-000098',
      description: 'An In2Assets property reference.',
      required: true,
      prompt: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var In2Assets = require('./lib/in2assets'),
      card = this;

    // enable client side js support
    card.client$Support = true;

    if (state.property && !In2Assets.isTime(state.dateTimeStamp)) {
      var viewModel = state.property;
      callback(null, viewModel);
    }
    else {
      In2Assets.getProperty(inputs.reference, function (err, property) {
        if (property) {
          var viewModel = property;

          // save state
          state.property = property;
          state.dateTimeStamp = new Date();

          callback(null, viewModel);
        }
        else {
          callback();
        }
      });
    }
  }
};

