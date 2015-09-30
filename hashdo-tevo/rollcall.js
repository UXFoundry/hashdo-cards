module.exports = {
  name: 'Roll Call',
  description: 'Complete a user roll call.',
  icon: 'http://cdn.hashdo.com/icons/rollcall.png',
  clientStateSupport: true,

  inputs: {
    apiKey: {
      example: 'abcdefghijklmnopqrstuvwxyz',
      description: 'X&Go API Key.',
      secure: true,
      required: true
    },
    secret: {
      example: 'abcdefghijklmnopqrstuvwxyz',
      description: 'X&Go API Key\'s Secret.',
      secure: true,
      required: true
    },
    appId: {
      example: '552fa62425186c6012edcf18',
      description: 'A valid X&Go App ID.',
      secure: true,
      required: true
    },
    detailLabel: {
      example: 'Reports To',
      description: 'The label of the user detail field.',
      required: false
    },
    userId: {
      example: '552fa62425186c6012edcf18',
      description: 'The current user\'s ID.',
      required: true
    }
  },

  getCardData: function (inputs, state, callback) {
    function getUsers(callback) {
      var Request = require('request'),
        _ = require('lodash');

      Request.post({
        url: 'http://xandgo.com/api/users/byDetail',
        form: {
          apiKey: inputs.apiKey,
          secret: inputs.secret,
          appId: inputs.appId,
          detail: inputs.detailLabel,
          value: inputs.userId
        },
        json: true
      },
        function (err, response, body) {
          if (!err) {
            if (body.success) {
              var users = body.users || [],
                result = [];

              for (var i = 0; i < users.length; i++) {
                result.push(_.extend({}, users[i], {status: false}));
              }

              callback(result);
            }
            else {
              callback();
            }
          }
          else {
            console.error('Tevo-RollCall: Error getting X&Go users for app ID ' + inputs.appId, err);
            callback();
          }
        }
      );
    }

    // By default we don't want extra client code.
    this.clientStateSupport = false;
    this.clientAnalyticsSupport = false;

    var viewModel = {
      title: 'Roll Call',
      users: state.users || [],
      active: false
    };

    if (state.users && state.users.length > 0) {
      callback(null, viewModel);
    }
    else {
      getUsers(function (users) {
        this.clientStateSupport = true;
        this.clientAnalyticsSupport = true;

        viewModel.users = users || [];
        viewModel.active = true;

        callback(null, viewModel, {
          appId: inputs.appId,
          users: users
        });
      }.bind(this));
    }
  }
};

