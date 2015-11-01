module.exports = {
  name: 'Job',
  description: 'A Bullhorn Job Card.',
  icon: 'http://cdn.hashdo.com/icons/bullhorn.png',
  clientStateSupport: false,

  inputs: {
    clientId: {
      example: '73eebbd9-9999-9999-9999-448a2a827f52',
      description: 'Your Bullhorn client Id.',
      required: !process.env.BULLHORN_CLIENT_ID,
      secure: true
    },
    clientSecret: {
      example: 'wZOvR9Dj80CvPRmcoezZcn8qbzoD1fQA',
      description: 'Your Bullhorn client secret.',
      required: !process.env.BULLHORN_CLIENT_SECRET,
      secure: true
    },
    username: {
      example: 'username',
      description: 'Your Bullhorn username.',
      required: !process.env.BULLHORN_USERNAME,
      secure: true
    },
    password: {
      example: 'password',
      description: 'Your Bullhorn password.',
      required: !process.env.BULLHORN_PASSWORD,
      secure: true
    },
    jobId: {
      example: 133,
      description: 'The Job\'s Bullhorn Id',
      required: true,
      prompt: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var Bullhorn = require('./lib/bullhorn'),
      BullhornClient = new Bullhorn({
        username: inputs.username || process.env.BULLHORN_USERNAME,
        password: inputs.password || process.env.BULLHORN_PASSWORD,
        clientId: inputs.clientId || process.env.BULLHORN_CLIENT_ID,
        clientSecret: inputs.clientSecret || process.env.BULLHORN_CLIENT_SECRET
      });

    BullhornClient.getJob(inputs.jobId, function (job) {
      var viewModel = {
        job: job ? job.data : {}
      };

      callback(null, viewModel);
    });
  }
};



