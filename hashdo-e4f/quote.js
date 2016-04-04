module.exports = {
  name: 'Quote',
  description: 'An Exchange4Free Request a Quote Card.',
  icon: 'http://cdn.hashdo.com/icons/e4f.png',

  inputs: {
    apiURl: {
      example: 'http://test.com',
      label: 'API URL',
      description: 'The Exchange4Free API URL.',
      secure: true,
      required: !process.env.E4F_API_URL
    },
    userId: {
      example: 1234,
      label: 'User ID',
      description: 'The id assigned to the user requesting the quote.',
      secure: true,
      required: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var E4F = require('./lib/e4f'),
      card = this;

    callback && callback(null,

      // jade locals
      {

      },

      // js client side locals
      {
        
      }
    );
  }
};