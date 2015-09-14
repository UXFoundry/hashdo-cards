module.exports = {
  name: 'Address',
  description: 'Share a specific street address.',
  icon: 'http://cdn.hashdo.com/icons/location.png',

  inputs: {
    address: {
      example: '1 Infinite Loop Cupertino, CA 95014',
      description: 'A valid street address.',
      prompt: true,
      label: 'Address',
      required: true
    },
    googleAPIKey: {
      example: 'AIzaSyD587MQrkTIx_nsa7GQn_Qo',
      description: 'A Google Apps API Key.',
      secure: true,
      required: true,
      whereToGet: {
        url: 'http://console.developers.google.com',
        description: 'Create a new project and then head to credentials.'
      }
    }
  },

  getCardData: function (inputs, state, callback) {
    var Request = require('request'),
      _ = require('lodash');

    function geocodeAddress(address, callback) {
      Request({
          url: 'https://maps.googleapis.com/maps/api/geocode/json',
          qs: {
            'address': address,
            'key': inputs.googleAPIKey
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

    var viewModel = {
      lat: state.lat,
      lng: state.lng,
      address: state.address,
      link: 'http://maps.google.com/maps?q=loc:' + state.lat + ',' + state.lng,
      title: state.address || this.name
    };

    if (state.lat && state.lng) {
      callback(null, viewModel);
    }
    else {
      geocodeAddress(inputs.address, function (mapResult) {
        if (mapResult && mapResult.geometry && mapResult.geometry.location) {
          /*jshint camelcase: false */
          state.lat = mapResult.geometry.location.lat;
          state.lng = mapResult.geometry.location.lng;
          state.address = mapResult.formatted_address;

          viewModel.link = 'http://maps.google.com/maps?q=loc:' + state.lat + ',' + state.lng;
          viewModel.title = state.address;

          callback(null, _.merge(viewModel, state));
        }
        else {
          callback(new Error('Failed to get latitude and longitude from address: ' + (inputs.address || '?')));
        }
      });
    }
  }
};

