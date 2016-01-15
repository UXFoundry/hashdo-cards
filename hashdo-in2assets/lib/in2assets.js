var Moment = require('moment'),
  Request = require('request'),
  _ = require('lodash');

var apiUrl = 'http://www.in2assets.co.za/api/',
  imageBaseUrl = 'http://www.in2assets.co.za/',
  genericErrorMessage = 'Invalid in2assets API response';

exports.isTime = function (dateTimeStamp) {
  if (dateTimeStamp) {
    return Moment().subtract(4, 'h') > Moment(dateTimeStamp);
  }

  return true;
};

exports.getAuction = function (auctionId, callback) {
  getAuctions(function (err, auctions) {
    if (err || !auctions) {
      callback && callback(err || genericErrorMessage);
    }
    else {
      var result = undefined;

      _.forEach(auctions, function (auction) {
        if (auction.id === auctionId) {
          result = auction;
          return false;
        }
      });

      callback && callback(null, result);
    }
  });
};

exports.getProperty = function (reference, callback) {
  getAuctions(function (err, auctions) {
    if (err || !auctions) {
      callback && callback(err || genericErrorMessage);
    }
    else {
      var result = undefined;

      _.forEach(auctions, function (auction) {
        _.forEach(auction.properties, function (property) {
          if (property.reference === reference) {
            result = property;
            result.auction = {
              id: auction.id,
              name: auction.name,
              formattedName: auction.formattedName,
              propertyCount: auction.properties.length,
              date: auction.date,
              address: auction.address
            };

            return false;
          }
        });

        if (result) {
          return false;
        }
      });

      if (result) {
        getPropertyImages(reference, function (err, images) {
          if (images) {
            result.images = images;
          }

          callback && callback(null, result);
        });
      }
      else {
        callback && callback();
      }
    }
  });
};

function getAuctions(callback) {
  Request(
    {
      method: 'GET',
      url: apiUrl + 'auction-list/0',
      json: true,
      timeout: 20000
    },
    function (err, res, body) {
      if (err) {
        callback && callback(err);
      }
      else if (body) {
        if (_.isArray(body)) {
          var auctions = [],
            lastAuction = '',
            i = 0;

          // group by auction
          for (i = 0; i < body.length; i++) {
            var item = body[i];

            if (item.auction_start_date) {
              var itemMoment = Moment(item.auction_start_date);

              if (item.auction_id !== lastAuction) {
                auctions.push({
                  id: item.auction_id,
                  name: item.auction_name,
                  formattedName: parseAuctionName(item.auction_name),
                  dateUnix: itemMoment.unix(),
                  date: itemMoment.format('Do MMM YYYY, HH:mm'),
                  address: parseAuctionAddress(item),
                  properties: []
                });

                lastAuction = item.auction_id;
              }
            }
          }

          // sort auction's by date
          _.sortBy(auctions, 'dateUnix');

          // add auction's properties
          _.forEach(auctions, function (auction) {
            for (i = 0; i < body.length; i++) {
              var item = body[i];

              if (item.auction_id === auction.id) {
                auction.properties.push({
                  reference: item.reference,
                  longDescription: item.long_descrip,
                  shortDescription: parsePropertyShortDescription(item.short_descrip),
                  leadImage: parsePropertyImage(item.lead_image),
                  thumbnail: parsePropertyThumbnail(item.lead_image),
                  address: parsePropertyAddress(item),
                  province: item.province,
                  contact: item.firstname + ' ' + item.lastname,
                  cell: item.cellnumber
                });
              }
            }
          });

          callback && callback(null, auctions);
        }
        else {
          callback && callback(genericErrorMessage);
        }
      }
      else {
        callback && callback(genericErrorMessage);
      }
    }
  );
}

function getPropertyImages(reference, callback) {
  Request(
    {
      method: 'GET',
      url: apiUrl + 'images/' + reference,
      json: true,
      timeout: 20000
    },
    function (err, res, body) {
      if (err) {
        callback && callback(err);
      }
      else if (body) {
        if (_.isArray(body)) {
          var images = [];

          for (var i = 0; i < body.length; i++) {
            if (body[i].file) {
              images.push(parsePropertyImage(body[i].file));
            }
          }

          // remove duplicates
          images = _.uniq(images);

          // max length
          if (images.length > 6) {
            images = _.take(images, 6);
          }

          callback && callback(null, images);
        }
        else {
          callback && callback(genericErrorMessage);
        }
      }
    }
  );
}

function parseAuctionName(name) {
  if (name) {
    return _.capitalize(name.toLowerCase());
  }
  else {
    return name;
  }
}

function parseAuctionAddress(auction) {
  var address = [],
    fields = ['auction_street_address', 'auction_suburb', 'auction_area', 'auction_province'];

  if (auction) {
    for (var i = 0; i < fields.length; i++) {
      if (auction[fields[i]]) {
        address.push(_.trim(auction[fields[i]]));
      }
    }
  }

  return _.uniq(address).join(', ');
}

function parsePropertyShortDescription(description) {
  if (description && description.indexOf(',') > -1) {
    return _.trim(description.split(',')[0]);
  }
  else {
    return description;
  }
}

function parsePropertyThumbnail(imageUrl) {
  if (imageUrl) {
    return 'http://res.cloudinary.com/xandgo/image/fetch/w_160,h_160,c_fill/' + imageBaseUrl + imageUrl;
  }
  else {
    return '';
  }
}

function parsePropertyImage(imageUrl) {
  if (imageUrl) {
    return 'http://res.cloudinary.com/xandgo/image/fetch/w_225,h_143,c_fill/' + imageBaseUrl + imageUrl;
  }
  else {
    return '';
  }
}

function parsePropertyAddress(property) {
  var address = [],
    fields = ['complex_number', 'complex_name', 'street_number', 'street_address', 'postcode', 'suburb_town_city', 'area', 'province', 'country'];

  if (property) {
    for (var i = 0; i < fields.length; i++) {
      if (property[fields[i]]) {
        address.push(_.trim(property[fields[i]]));
      }
    }
  }

  return _.uniq(address).join(', ');
}