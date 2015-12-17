module.exports = {
  name: 'Auction',
  description: 'In2Assets Auction Card.',
  icon: 'http://cdn.hashdo.com/icons/in2assets.png',

  inputs: {
    auctionName: {
      example: 'DURBAN COMBINED PROPERTY AUCTION',
      description: 'The name of the auction.',
      required: true,
      prompt: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var In2Assets = require('./lib/in2assets'),
      card = this;

    // enable client side js support
    card.client$Support = true;

    if (state.auction && !In2Assets.isTime(state.dateTimeStamp)) {
      var viewModel = state.auction;
      callback(null, viewModel);
    }
    else {
      In2Assets.getAuction(inputs.auctionName, function (err, auction) {
        if (auction) {
          var viewModel = auction;

          // save state
          state.auction = auction;
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

