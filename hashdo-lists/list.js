module.exports = {
  name: 'List',
  description: 'A list',
  icon: 'http://cdn.hashdo.com/icons/list.png',
  
  inputs: {
    title: {
      example: 'Shopping List',
      label: 'List Title',
      description: 'The list\s title'
    },
    list: {      
      example: 'Bread, Milk, Eggs, Butter',
      label: 'List',
      description: 'Delimiter separated list of items'
    },
    delimiter: {
      example: ',',
      label: 'Delimiter',
      description: 'The character used to separate the list items'
    },
    numbered: {
      example: 'true',
      label: 'Numbered?',
      description: 'Number the list? true or false'
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
    }
    
    var viewModel = {
      list: items,
      numbered: inputs.numbered,
      title: inputs.title
    };
    
    callback(null, viewModel);
  }
};

