module.exports = {
  name: 'Place',
  description: 'An X&Go Place Card.',
  icon: 'http://cdn.hashdo.com/icons/place.png',

  inputs: {
    apiKey: {
      example: 'abcdefghijklmnopqrstuvwxyz',
      description: 'API Key.',
      secure: true,
      required: true
    },
    secret: {
      example: 'abcdefghijklmnopqrstuvwxyz',
      description: 'API Key\'s Secret.',
      secure: true,
      required: true
    },
    placeId: {
      example: '552fa62425186c6012edcf18',
      description: 'The X&Go ID of the place to display.',
      required: true
    }
  },

  getCardData: function (inputs, state, callback) {

    function getPlace(callback) {
      var Request = require('request');

      Request.post({
        url: 'http://xandgo.com/api/place',
        form: {
          apiKey: inputs.apiKey,
          secret: inputs.secret,
          placeId: inputs.placeId
        },
        json: true
      }, function (err, response, body) {
        if (!err) {
          if (body.success) {
            var place = body.place;
            place.headerImage = parseHeaderImage(place);
            place.address = parseAddress(place);

            callback(place);
          }
          else {
            callback();
          }
        }
        else {
          console.error('XandGo-Place: Error getting X&Go place for place ID ' + inputs.placeId, err);
          callback();
        }
      });
    }

    function parseHeaderImage(place) {
      var Cloudinary = require('cloudinary'),
        width = 225,
        height = 143,
        crop = 'fill';

      if (place) {
        /*jshint camelcase: false */
        Cloudinary.config({
          cloud_name: 'xandgo',
          api_key: process.env.CLOUDINARY_KEY,
          api_secret: process.env.CLOUDINARY_SECRET
        });

        if (place.photos && place.photos.length > 0) {
          /*jshint camelcase: false */
          return Cloudinary.url(place.photos[0].public_id, {
            width: width,
            height: height,
            crop: crop
          });
        }

        if (place.logo) {
          /*jshint camelcase: false */
          return Cloudinary.url(place.logo.public_id, {
            width: width,
            height: height,
            crop: crop
          });
        }

        if (place.location) {
          if (place.location.geo) {
            return 'http://maps.googleapis.com/maps/api/staticmap?&markers=color:black%7C' + place.location.geo[1] + ',' + place.location.geo[0] + '&center=' + place.location.geo[1] + ',' + place.location.geo[0] + '&size=' + width + 'x' + height + '&zoom=15&sensor=false';
          }
        }
      }

      return '';
    }

    function parseAddress(place) {
      var address = [];

      if (place) {
        if (place.location) {
          if (place.location.street1) {
            address.push(place.location.street1);
          }

          if (place.location.suburb) {
            address.push(place.location.suburb);
          }

          if (place.location.state) {
            address.push(place.location.state);
          }

          if (address.length > 0) {
            return address.join(', ');
          }
        }
      }

      return '';
    }

    getPlace(function (place) {
      if (place) {
        callback(null, {
          title: place.name || this.name,
          place: place
        });
      }
      else {
        callback(new Error('Could not find place with ID ' + (inputs.placeId || '?')));
      }
    });
  }
};

