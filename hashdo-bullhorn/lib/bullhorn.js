var Request = require('request'),
  URL = require('url'),
  QS = require('querystring'),
  _ = require('lodash');

var Client = (function () {
  function Bullhorn(options) {
    this.options = _.defaults(options, {
      apiRoot: 'https://rest.bullhornstaffing.com/rest-services/',
      authEndpoint: 'https://auth.bullhornstaffing.com/oauth/',
      version: '2.0',
      clientId: '',
      clientSecret: '',
      username: '',
      password: ''
    });
  }

  Bullhorn.prototype.getJob = function (id, callback) {
    var client = this;

    client.login(function () {
      Request.get({
          url: client.restUrl + 'entity/JobOrder/' + id,
          qs: {
            BhRestToken: client.BhRestToken,
            fields: '*'
          },
          json: true
        },
        function (err, response) {
          if (response && response.body) {
            callback && callback(response.body);
          }
          else {
            callback && callback();
          }
        }
      );
    })
  };

  Bullhorn.prototype.login = function (callback) {
    var client = this;

    client.auth(function () {
      Request.get({
          url: client.options.apiRoot + 'login',
          qs: {
            version: client.options.version,
            access_token: client.accessToken
          },
          json: true
        },
        function (err, response) {
          client.restUrl = response.body.restUrl;
          client.BhRestToken = response.body.BhRestToken;

          callback && callback();
        }
      );
    });
  };

  Bullhorn.prototype.auth = function (callback) {
    var client = this,
      now = new Date().getTime(),
      auth = false;

    if (!client.authDateTime || now - client.authDateTime > 8 * 60 * 1000) {
      auth = true;
    }

    if (!auth) {
      callback && callback();
    }
    else {
      client.getAuthCode(function (code) {
        if (code) {
          client.getToken(code, function (tokens) {
            client.authDateTime = new Date().getTime();
            client.accessToken = tokens.access_token;

            callback && callback();
          });
        }
        else {
          callback && callback();
        }
      });
    }
  };

  Bullhorn.prototype.getToken = function (code, callback) {
    var client = this;

    Request.post({
        url: client.options.authEndpoint + 'token',
        qs: {
          grant_type: 'authorization_code',
          code: code,
          client_id: client.options.clientId,
          client_secret: client.options.clientSecret
        },
        json: true
      },
      function (err, response) {
        if (response && response.body) {
          callback && callback(response.body);
        }
        else {
          callback && callback();
        }
      }
    );
  };

  Bullhorn.prototype.getAuthCode = function (callback) {
    var client = this;

    Request.get({
        url: client.options.authEndpoint + 'authorize',
        qs: {
          client_id: client.options.clientId,
          response_type: 'code',
          username: client.options.username,
          password: client.options.password,
          action: 'Login'
        }
      },
      function (err, res) {
        callback && callback(QS.parse(URL.parse(res.request.uri.href).query).code);
      }
    );
  };

  return Bullhorn;
})();

module.exports = Client;