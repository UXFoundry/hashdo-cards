var Cloudinary = require('cloudinary'),
  Moment = require('moment'),
  Request = require('request');

exports.isTime = function (dateTimeStamp) {
  if (dateTimeStamp) {
    return Moment().subtract(1, 'h') > Moment(dateTimeStamp);
  }

  return true;
};

exports.getPlace = function(apiKey, apiSecret, placeId, callback) {
  Request.post(
    {
      url: 'http://xandgo.com/api/place',
      form: {
        apiKey: apiKey,
        secret: apiSecret,
        placeId: placeId
      },
      json: true
    },
    function (err, response, body) {
      if (!err) {
        if (body.success) {
          var place = body.place;

          place.photos = parsePlacePhotos(place);
          place.address = parsePlaceAddress(place);

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
    }
  );
};

function parsePlacePhotos(place) {
  var width = 225,
    height = 143,
    crop = 'fill',
    photos = [];

  if (place) {
    Cloudinary.config({
      cloud_name: 'xandgo',
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET
    });

    if (place.photos && place.photos.length > 0) {
      for (var i = 0; i < place.photos.length; i++) {
        photos.push(Cloudinary.url(place.photos[i].public_id, {width: width, height: height, crop: crop}));
      }
    }

    if (place.logo && photos.length === 0) {
      return Cloudinary.url(place.logo.public_id, {
        width: width,
        height: height,
        crop: crop
      });
    }

    if (place.location && photos.length === 0) {
      if (place.location.geo) {
        return 'http://maps.googleapis.com/maps/api/staticmap?&markers=color:black%7C' + place.location.geo[1] + ',' + place.location.geo[0] + '&center=' + place.location.geo[1] + ',' + place.location.geo[0] + '&size=' + width + 'x' + height + '&zoom=15&sensor=false';
      }
    }
  }

  return photos;
}

function parsePlaceAddress(place) {
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