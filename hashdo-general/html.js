module.exports = {
  name: 'HTML',
  description: 'A basic HTML card.',
  icon: 'http://cdn.hashdo.com/icons/html.png',
  clientStateSupport: false,

  inputs: {
    html: {
      example: '<div>Hello World</div>',
      description: 'The HTML content to be displayed',
      required: true
    }
  },

  getCardData: function (inputs, state, callback) {
    callback(null, {html: inputs.html});
  }
};

