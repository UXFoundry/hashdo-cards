module.exports = {
  name: 'Location',
  description: 'Share your current location.',
  icon: 'http://cdn.hashdo.com/icons/location.png',

  inputs: {
    latitude: {
      example: 37.422256,
      description: 'A valid latitude.',
      required: false
    },
    longitude: {
      example: -122.083859,
      description: 'A valid longitude',
      required: false
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
    }
  },

  getCardData: function (inputs, state, callback) {
    var Request = require('request'),
      _ = require('lodash');

    function getLatLng(callback) {
      var lat = Number(inputs.latitude),
        lng = Number(inputs.longitude);

      if (_.isNaN(lat) || _.isNaN(lng)) {
        getLatLngByIP(inputs.ipAddress || '', callback);
      }
      else {
        callback({
          lat: lat,
          lng: lng
        });
      }
    }

    function getLatLngByIP(ipAddress, callback) {
      Request({
          url: 'http://ipinfo.io/' + ipAddress,
          json: true
        },
        function (err, response, body) {
          if (!err) {
            if (body && body.loc) {
              var loc = body.loc.split(',');

              callback({
                lat: Number(loc[0]),
                lng: Number(loc[1])
              });
            }
            else {
              callback();
            }
          }
          else {
            console.error('Geo-Location: Error getting lat/long for IP address ' + ipAddress, err);
            callback();
          }
        }
      );
    }

    function reverseGeocode(lat, lng, callback) {
      Request({
          url: 'https://maps.googleapis.com/maps/api/geocode/json',
          qs: {
            'latlng': lat + ',' + lng,
            'key': inputs.googleAPIKey || process.env.GOOGLE_API_KEY
          },
          json: true
        },
        function (err, response, body) {
          if (!err) {
            if (response && response.statusCode === 200) {
              if (body && body.results && body.results.length > 0) {
                /*jshint camelcase: false */
                callback(body.results[0].formatted_address);
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
            console.error('Geo-Location: Error getting reverse geocode for ' + lat + ',' + lng, err);
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
      title: state.address || this.name,
      key: inputs.googleAPIKey
    };

    // If there is already a lat/long just re-use it.
    if (state.lat && state.lng) {
      callback(null, viewModel);
    }
    else {
      getLatLng(function (latLng) {
        if (latLng) {
          state.lat = latLng.lat;
          state.lng = latLng.lng;

          // save lat, lng as address in case address lookup fails
          state.address = parseFloat(latLng.lat).toFixed(5) + ',' + latLng.lng.toFixed(5);

          viewModel.link = 'http://maps.google.com/maps?q=loc:' + latLng.lat + ',' + latLng.lng;

          reverseGeocode(latLng.lat, latLng.lng, function (address) {
            if (address) {
              state.address = address;
              viewModel.title = address;
            }

            callback(null, _.merge(viewModel, state));
          });
        }
        else {
          callback('Failed to get latitude and longitude from IP address: ' + (inputs.ipAddress || '?'));
        }
      });
    }
  }
};

