module.exports = {
  name: 'Product',
  description: 'An X&Go Product Card.',
  icon: 'http://cdn.hashdo.com/icons/cart.png',

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
    productId: {
      example: '552fa62425186c6012edcf18',
      description: 'The X&Go ID of the product to display.',
      required: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var _ = require('lodash');

    function getProduct(callback) {
      var Request = require('request');

      Request.post({
        url: 'http://xandgo.com/api/product',
        form: {
          apiKey: inputs.apiKey,
          secret: inputs.secret,
          productId: inputs.productId
        },
        json: true
      }, function (err, response, body) {
        if (!err) {
          if (body.success) {
            var product = body.product;
            product.headerImage = parseHeaderImage(product);
            product.video = getDetail(product.details, 'Video');

            callback(product);
          }
          else {
            callback();
          }
        }
        else {
          console.error('XandGo-Product: Error getting X&Go product for product ID ' + inputs.productId, err);
          callback();
        }
      });
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

    function parseHeaderImage(product) {
      var Cloudinary = require('cloudinary'),
        width = 225,
        height = 143,
        crop = 'fill';

      if (product) {
        /*jshint camelcase: false */
        Cloudinary.config({
          cloud_name: 'xandgo',
          api_key: process.env.CLOUDINARY_KEY,
          api_secret: process.env.CLOUDINARY_SECRET
        });

        if (product.photos && product.photos.length > 0) {
          /*jshint camelcase: false */
          return Cloudinary.url(product.photos[0].public_id, {
            width: width,
            height: height,
            crop: crop
          });
        }

        if (product.logo) {
          /*jshint camelcase: false */
          return Cloudinary.url(product.logo.public_id, {
            width: width,
            height: height,
            crop: crop
          });
        }

        if (product.location) {
          if (product.location.geo) {
            return 'http://maps.googleapis.com/maps/api/staticmap?&markers=color:black%7C' + product.location.geo[1] + ',' + product.location.geo[0] + '&center=' + product.location.geo[1] + ',' + product.location.geo[0] + '&size=' + width + 'x' + height + '&zoom=15&sensor=false';
          }
        }
      }

      return '';
    }

    getProduct(function (product) {
      if (product) {
        callback(null, {
          title: product.name || this.name,
          product: product
        });
      }
      else {
        callback(new Error('Could not find product with ID ' + (inputs.productId || '?')));
      }
    });
  }
};

