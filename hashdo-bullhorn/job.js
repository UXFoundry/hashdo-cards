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
    googleAPIKey: {
      example: 'AIzaSyD587MQrkTIx_nsa7GQn_Qo',
      description: 'A Google Apps API Key.',
      secure: true,
      required: !process.env.GOOGLE_API_KEY,
      whereToGet: {
        url: 'http://console.developers.google.com',
        description: 'Create a new project and then head to credentials.'
      }
    },
    jobId: {
      example: 133,
      description: 'The Job\'s Bullhorn Id',
      required: true,
      prompt: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var Request = require('request'),
      Bullhorn = require('./lib/bullhorn'),
      BullhornClient = new Bullhorn({
        username: inputs.username || process.env.BULLHORN_USERNAME,
        password: inputs.password || process.env.BULLHORN_PASSWORD,
        clientId: inputs.clientId || process.env.BULLHORN_CLIENT_ID,
        clientSecret: inputs.clientSecret || process.env.BULLHORN_CLIENT_SECRET,
        debug: false
      }),
      _ = require('lodash');

    if (state.job) {
      var viewModel = {
        job: state.job
      };

      callback(null, viewModel);
    }
    else {
      BullhornClient.getJob(inputs.jobId, function (job) {
        if (job) {
          var viewModel = {
            job: job
          };

          parseAddress(job.address, function (geo) {
            if (geo) {
              job.geo = geo;
              viewModel.link = job.geo.link;
            }

            // save state
            state.job = job;

            callback(null, viewModel);
          });
        }
        else {
          callback(null, {job: {}});
        }
      });
    }

    function parseAddress(address, callback) {
      if (address) {
        geocodeAddress(_.values(address).join(' ').replace(/,/g, ''), function (mapResult) {
          if (mapResult && mapResult.geometry && mapResult.geometry.location) {
            callback && callback({
              lat: mapResult.geometry.location.lat,
              lng: mapResult.geometry.location.lng,
              address: mapResult.formatted_address,
              link: 'http://maps.google.com/maps?q=loc:' + mapResult.geometry.location.lat + ',' + mapResult.geometry.location.lng
            });
          }
          else {
            callback && callback();
          }
        });
      }
      else {
        callback && callback();
      }
    }

    function geocodeAddress(address, callback) {
      Request({
          url: 'https://maps.googleapis.com/maps/api/geocode/json',
          qs: {
            'address': address,
            'key': inputs.googleAPIKey || process.env.GOOGLE_API_KEY
          },
          json: true
        },
        function (err, response, body) {
          if (!err) {
            if (response && response.statusCode === 200) {
              if (body && body.results && body.results.length > 0) {
                callback(body.results[0]);
              }
              else {
                callback();
              }
            }
            else {
              callback();
            }
          }
          else {
            console.error('Geo-Address: Error geocoding address ' + address, err);
            callback();
          }
        }
      );
    }
  }
};



