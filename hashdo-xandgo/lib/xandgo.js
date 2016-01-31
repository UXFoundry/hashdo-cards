var Cloudinary = require('cloudinary'),
  Moment = require('moment'),
  Request = require('request'),
  _ = require('lodash');

var dataVersions = [],
  dataVersionCacheDurationInMinutes = 2;

exports.getDataVersion = getDataVersion;

function getDataVersion(apiKey, apiSecret, dataKey, callback) {
  var cachedVersion = getCachedDataVersion(apiKey, apiSecret, dataKey);

  if (cachedVersion) {
    callback(cachedVersion);
  }
  else {
    Request.post(
      {
        url: 'http://xandgo.com/api/app/dataVersion',
        form: {
          apiKey: apiKey,
          secret: apiSecret,
          key: dataKey
        },
        json: true
      },
      function (err, response, body) {
        if (!err) {
          if (body.success) {
            cacheDataVersion(apiKey, apiSecret, dataKey, body.version);
            callback(body.version);
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
}

function isUpdateAvailable(apiKey, apiSecret, currentVersion, dataKey, callback) {
  getDataVersion(apiKey, apiSecret, dataKey, function (version) {
    if (version === currentVersion) {
      callback && callback(false, version);
    }
    else {
      callback && callback(true, version);
    }
  });
}

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

          place.photos = parsePhotos(place);
          place.address = parsePlaceAddress(place);

          callback(place);
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
};

exports.getProduct = function(apiKey, apiSecret, productId, callback) {
  Request.post(
    {
      url: 'http://xandgo.com/api/product',
      form: {
        apiKey: apiKey,
        secret: apiSecret,
        productId: productId
      },
      json: true
    },
    function (err, response, body) {
      if (!err) {
        if (body.success) {
          var product = body.product;

          product.photos = parsePhotos(product);
          product.video = getDetail(product.details, 'Video');

          callback(product);
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
};

exports.getSurvey = function(apiKey, apiSecret, surveyId, currentVersion, callback) {
  isUpdateAvailable(apiKey, apiSecret, currentVersion, 'surveys', function(updateAvailable, newVersion) {
    if (updateAvailable) {
      Request.post(
        {
          url: 'http://xandgo.com/api/survey',
          form: {
            apiKey: apiKey,
            secret: apiSecret,
            surveyId: surveyId
          },
          json: true
        },
        function (err, response, body) {
          if (!err) {
            if (body.success) {
              callback(body.survey, newVersion);
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
    else {
      callback && callback();
    }
  });
};

function getCachedDataVersion(apiKey, apiSecret, dataKey) {
  var version = 0;

  _.forEach(dataVersions, function (dataVersion) {
    if (dataVersion.apiKey === apiKey && dataVersion.apiSecret === apiSecret && dataVersion.dataKey === dataKey && !isTime(dataVersion.dateTimeStamp)) {
      version = dataVersion.version;
      return false;
    }
  });

  return version;
}

function cacheDataVersion(apiKey, apiSecret, dataKey, version) {
  var found = false;

  _.forEach(dataVersions, function (dataVersion) {
    if (dataVersion.apiKey === apiKey && dataVersion.apiSecret === apiSecret && dataVersion.dataKey === dataKey) {
      found = true;
      dataVersion.version = version;
      dataVersion.dateTimeStamp = new Date();
      return false;
    }
  });

  if (!found) {
    dataVersions.push({
      apiKey: apiKey,
      apiSecret: apiSecret,
      dataKey: dataKey,
      version: version,
      dateTimeStamp: new Date()
    });
  }
}

function isTime(dateTimeStamp) {
  if (dateTimeStamp) {
    return Moment().subtract(dataVersionCacheDurationInMinutes, 'minutes') > Moment(dateTimeStamp);
  }

  return true;
}

function parsePhotos(obj) {
  var width = 225,
    height = 143,
    crop = 'fill',
    photos = [];

  if (obj) {
    Cloudinary.config({
      cloud_name: 'xandgo',
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET
    });

    if (obj.photos && obj.photos.length > 0) {
      for (var i = 0; i < obj.photos.length; i++) {
        photos.push(Cloudinary.url(obj.photos[i].public_id, {width: width, height: height, crop: crop}));
      }
    }

    if (obj.logo && photos.length === 0) {
      return Cloudinary.url(obj.logo.public_id, {
        width: width,
        height: height,
        crop: crop
      });
    }

    if (obj.location && photos.length === 0) {
      if (obj.location.geo) {
        return 'http://maps.googleapis.com/maps/api/staticmap?&markers=color:black%7C' + obj.location.geo[1] + ',' + obj.location.geo[0] + '&center=' + obj.location.geo[1] + ',' + obj.location.geo[0] + '&size=' + width + 'x' + height + '&zoom=15&sensor=false';
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

function getDetail(details, detail) {
  if (details && _.isArray(details)) {
    for (var i = 0; i < details.length; i++) {
      if (details[i].label === detail) {
        return details[i].value;
      }
    }
  }
}