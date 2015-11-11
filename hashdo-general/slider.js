module.exports = {
  name: 'Slider',
  description: 'An interactive sliding info card ',
  icon: 'http://cdn.hashdo.com/icons/slider.png',
  
  inputs: {
    configUrl: {
      example: 'http://cdn.hashdo.com/config/test.json',
      label: 'JSON Config file URL',
      description: 'A URL for the slider\'s JSON config file',
      required: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var viewModel = {},
      card = this;

    if (!state.config) {
      var Request = require('request');

      Request(inputs.configUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          try {
            var config = JSON.parse(body);

            if (config && config.slides) {
              state.slides = config.slides;
              viewModel.slides = config.slides;

              card.client$Support = true;
            }
          }
          catch (ex) {
            console.log(ex);
            // ignore error
          }
        }

        callback(null, viewModel);
      });
    }
    else {
      viewModel.slides = state.slides;
      card.client$Support = true;

      callback(null, viewModel);
    }
  }
};

