module.exports = {
  name: 'Bool',
  description: 'A boolean question. Yes or No, True or False etc.',
  icon: 'http://cdn.hashdo.com/icons/question.png',
  clientStateSupport: true,

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
    requestId: {
      example: '552fa62425186c6012edcf18',
      description: 'The current request\'s ID.',
      required: true
    },
    question: {
      example: 'Was your query answered satisfactorily?',
      description: 'The question to be asked of the user.',
      required: true
    },
    yesOption: {
      example: 'Yes',
      description: 'The label for the yes option.',
      required: false
    },
    noOption: {
      example: 'No',
      description: 'The label for the no option.',
      required: false
    }
  },

  getCardData: function (inputs, state, callback) {
    var XandGo = require('./lib/xandgo');
    var _ = require('lodash')

    // disable client state and proxy support
    this.clientStateSupport = false;
    this.clientProxySupport = false;

    var model = {
      noOption: inputs.noOption,
      question: inputs.question,
      response: state.response,
      title: inputs.question,
      yesOption: inputs.yesOption
    };

    console.log(state, _.isUndefined(state.response))

    if (state.response > 0) {
      callback(null, model);
    }
    else {
      XandGo.getRequestRating(inputs.apiKey, inputs.secret, inputs.requestId, function (rating) {
        if (rating > 0) {
          state.response = rating;
          model.response = rating;

          callback(null, model);
        }
        else {
          // enable client state and proxy support
          this.clientStateSupport = true;
          this.clientProxySupport = true;

          callback(null, model);
        }
      }.bind(this));
    }
  }
};
