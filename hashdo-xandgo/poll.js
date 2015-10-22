var Moment = require('moment'),
  _ = require('lodash');

module.exports = {
  name: 'Poll',
  description: 'Conduct a quick poll.',
  icon: 'http://cdn.hashdo.com/icons/question.png',
  clientStateSupport: true,

  inputs: {
    question: {
      example: 'How old are you?',
      description: 'The question.',
      required: true
    },
    delimiter: {
      example: ',',
      description: 'Option delimiter.'
    },
    options: {
      example: '0 to 13; 14 to 21; 22 to 30; 31 to 40',
      description: 'A list of poll options.',
      required: true
    },
    expiryDate: {
      example: '28 Sep 1976 09:00',
      description: 'Expiry date and time.'
    }
  },

  getCardData: function (inputs, state, callback) {
    var delimiter = inputs.delimiter || ',',
      options = [],
      CUID = require('cuid');

    // first instantiation
    if (!state.pollId) {
      state.pollId = CUID();
      state.votes = [];
      state.expired = false;
    }

    // has poll expired?
    var expiry = parsePollExpiry(inputs.expiryDate);
    if (expiry) {
      state.expiry = expiry;
    }
    else {
      state.expired = true;
      state.expiry = false;
      this.clientStateSupport = false;
    }

    // parse poll options
    if (inputs.options) {
      _.forEach(inputs.options.split(delimiter), function (option) {
        options.push(_.trim(option));
      });
    }

    // count votes
    var counts = countVotes(options, state.votes);

    // locals sent to server-side jade
    var viewModel = {
      id: state.pollId,
      title: 'Quick Poll',
      question: inputs.question,
      options: options,
      voteCounts: counts,
      totalVotes: state.votes.length,
      expired: state.expired,
      expiry: state.expiry
    };

    // locals sent to client-side javascript
    var clientLocals = {
      id: state.pollId,
      voteCounts: counts,
      totalVotes: state.votes.length,
      expired: state.expired
    };

    console.log(counts);

    callback(null, viewModel, clientLocals);
  }
};

function countVotes(options, votes) {
  var counts = [];

  for (var i = 0; i < options.length; i++) {
    counts.push({
      percentage: 0,
      count: 0
    });
  }

  for (var j = 0; j < votes.length; j++) {
    if (votes[j].dateTimeStamp && counts[votes[j].vote]) {
      counts[votes[j].vote].count++;
      counts[votes[j].vote].percentage = Math.floor((counts[votes[j].vote].count / votes.length) * 100);
    }
  }

  return counts;
}

function parsePollExpiry(expiryDate) {
  if (expiryDate) {
    var expiryMoment = Moment.utc(new Date(expiryDate)),
      nowMoment = Moment.utc();

    if (expiryMoment.isValid()) {
      if (expiryMoment.isAfter(nowMoment)) {

        // we still got time
        return expiryMoment.toNow(true) + ' left';
      }
      else {

        // too late
        return false;
      }
    }
  }
}

