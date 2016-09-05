module.exports = {
  name: 'iFrame',
  description: 'A basic iFrame card.',
  icon: 'http://cdn.hashdo.com/icons/html.png',
  clientStateSupport: false,

  inputs: {
    url: {
      example: 'about:blank',
      description: 'The url to be displayed by the iFrame',
      required: true
    },
    height: {
      example: 300,
      description: 'The pixel height of the iFrame element',
      required: false
    }
  },

  getCardData: function (inputs, state, callback) {
    callback(null, {url: inputs.url, height: inputs.height || 300});
  }
};

