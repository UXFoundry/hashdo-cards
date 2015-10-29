module.exports = {
  name: 'Todo List',
  description: 'A simple list of things to do',
  icon: 'http://cdn.hashdo.com/icons/todo.png',

  inputs: {
    title: {
      example: 'Holiday Checklist',
      label: 'List Title',
      description: 'The list\s title'
    },
    list: {
      example: 'Tickets, Passport, Travelers Cheques, Charging cables',
      label: 'Actionable Items',
      description: 'Delimiter separated list of actionable items'
    },
    delimiter: {
      example: ',',
      label: 'Delimiter',
      description: 'The character used to separate the list items'
    },
    userId: {
      example: '552fa62425186c6012edcf18',
      description: 'The current user\'s ID.',
      required: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var _ = require('lodash'),
      items = [];

    if (inputs.list) {
      items = inputs.list.split(inputs.delimiter || ',');

      for (var item in items) {
        items[item] = _.trim(_.capitalize(items[item]));
      }

      this.clientStateSupport = true;
    }
    else {
      this.clientStateSupport = false;
    }

    var viewModel = {
      list: items,
      checked: state.checked || {},
      title: inputs.title || this.name
    };

    callback(null, viewModel);
  }
};