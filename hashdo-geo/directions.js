module.exports = {
  name: 'Directions',
  description: 'Get directions to specific location.',
  icon: 'http://cdn.hashdo.com/icons/directions.png',

  inputs: {
    latitude: {
      example: 37.422256,
      description: 'A valid latitude.',
      required: true
    },
    longitude: {
      example: -122.083859,
      description: 'A valid longitude',
      required: true
    },
    destination: {
      example: '1 Infinite Loop Cupertino, CA 95014',
      description: 'A valid street address.',
      prompt: true,
      label: 'Destination',
      required: true
    },
    googleAPIKey: {
      example: 'AIzaSyD587MQrkTIx_nsa7GQn_Qo',
      description: 'A Google Apps API Key.',
      secure: true,
      required: true,
      whereToGet: {
        url: 'https://developers.google.com/maps/documentation/directions/intro',
        description: 'Create a new project, enable Directions API and then head to credentials to create an API key.'
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
            console.error('Geo-Directions: Error getting lat/long for IP address ' + ipAddress, err);
            callback();
          }
        }
      );
    }

    function getDirections(lat, lng, callback) {
      Request({
          url: 'https://maps.googleapis.com/maps/api/directions/json',
          qs: {
            'origin': lat + ',' + lng,
            'destination': inputs.destination,
            'key': inputs.googleAPIKey
          },
          json: true
        },
        function (err, response, body) {
          if (!err) {
            if (response && response.statusCode === 200) {
              if (body && body.routes && body.routes.length > 0 && body.routes[0].legs && body.routes[0].legs.length > 0) {
                var leg = body.routes[0].legs[0];

                /*jshint camelcase: false */
                var simpleDirectionData = {
                  from: {
                    address: leg.start_address,
                    lat: leg.start_location.lat,
                    lng: leg.start_location.lng
                  },
                  to: {
                    address: leg.end_address,
                    lat: leg.end_location.lat,
                    lng: leg.end_location.lng
                  },
                  distance: leg.distance.text,
                  duration: leg.duration.text,
                  steps: []
                };

                // Pull out all the steps in an easy to parse format.
                for (var i = 0; i < leg.steps.length; i++) {
                  var step = leg.steps[i];

                  simpleDirectionData.steps.push({
                    index: i + 1,
                    distance: step.distance.text,
                    duration: step.duration.text,
                    instructions: step.html_instructions,
                    maneuver: step.maneuver || 'none'
                  });
                }

                callback(simpleDirectionData);
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
            callback();
          }
        }
      );
    }

    var viewModel = {
      fromAddress: state.fromAddress,
      toAddress: state.toAddress,
      totalDistance: state.totalDistance,
      totalDuration: state.totalDuration,
      directions: state.directions,
      link: state.link,
      title: state.toAddress || this.name
    };

    // If we have directions in the previous state, then take the view data and callback.
    if (state.directions && state.directions.length > 0) {
      callback(null, viewModel);
    }
    else {
      getLatLng(function (latLng) {
        if (latLng) {
          getDirections(latLng.lat, latLng.lng, function (directions) {
            if (directions && directions.steps) {
              state.fromAddress = directions.from.address;
              state.toAddress = directions.to.address;
              state.totalDistance = directions.distance;
              state.totalDuration = directions.duration;
              state.directions = directions.steps;
              state.link = 'https://www.google.com/maps' +
                '?saddr=' + directions.from.lat + ',' + directions.from.lng +
                '&daddr=' + directions.to.lat + ',' + directions.to.lng;

              viewModel.title = directions.from.address + ' to ' + directions.to.address;

              callback(null, _.merge(viewModel, state));
            }
          });
        }
        else {
          callback(new Error('Failed to get latitude and longitude from IP address: ' + (inputs.ipAddress || '?')));
        }
      });
    }
  }
};

