module.exports = {
  name: 'Statement',
  description: 'MECC Statement Card.',
  icon: 'http://cdn.hashdo.com/icons/mecc.png',

  inputs: {
    accountNumber: {
      example: 'T0332',
      description: 'MECC account number.',
      required: true,
      prompt: true
    },
    clubDBServer: {
      example: 'server.org',
      description: 'MECC club DB server.',
      required: !process.env.MECC_CLUB_SERVER,
      secure: true
    },
    clubDBUser: {
      example: 'username',
      description: 'MECC club DB username.',
      required: !process.env.MECC_CLUB_USER,
      secure: true
    },
    clubDBPassword: {
      example: 'password',
      description: 'MECC club DB password.',
      required: !process.env.MECC_CLUB_PASSWORD,
      secure: true
    },
    clubDB: {
      example: 'clubdb',
      description: 'MECC club DB database name.',
      required: !process.env.MECC_CLUB_DB,
      secure: true
    }
  },

  getCardData: function(inputs, state, callback) {
    var Mecc = require('./lib/mecc')
    var Moment = require('moment')
    var card = this

    if (state.statement && !Mecc.isTime(state.dateTimeStamp)) {
      var viewModel = { date: state.date, statement: state.statement }
      callback(null, viewModel)
    } else {
      Mecc.getStatement(
        inputs.accountNumber,
        inputs.clubDBServer || process.env.MECC_CLUB_SERVER,
        inputs.clubDBUser || process.env.MECC_CLUB_USER,
        inputs.clubDBPassword || process.env.MECC_CLUB_PASSWORD,
        inputs.clubDB || process.env.MECC_CLUB_DB,
        function(err, statement) {
          if (statement) {
            var viewModel = { date: Moment.utc().format('Do MMMM YYYY'), statement: statement }

            // save state
            state.date = viewModel.date
            state.statement = viewModel.statement
            state.dateTimeStamp = new Date()

            callback(null, viewModel)
          } else {
            callback(err)
          }
        }
      )
    }
  }
}
