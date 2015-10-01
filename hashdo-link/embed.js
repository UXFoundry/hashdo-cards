module.exports = {
  name: 'Embed',
  description: 'Embed a link.',

  inputs: {
    url: {
      example: 'http://www.imdb.com/title/tt3520702',
      description: 'A valid URL.',
      required: true
    },
    iframelyAPIKey: {
      example: 'cfff62348986e2bdddb43b',
      description: 'An iFramely API Key.',
      secure: true,
      required: !process.env.IFRAMELY_API_KEY,
      whereToGet: {
        url: 'https://iframely.com',
        description: 'Signup for an API key on iframely.com.'
      }
    }
  },

  getCardData: function (inputs, state, callback) {
    var Request = require('request'),
      _ = require('lodash');

    if (state.link && state.link.length > 0) {
      callback(null, {
        thumbnail: state.thumbnail,
        icon: state.icon,
        source: state.source,
        description: state.description,
        link: state.link,
        title: state.title || this.name
      });
    }
    else {
      Request({
          url: 'http://iframe.ly/api/iframely',
          qs: {
            'url': inputs.url.indexOf('%3A%2F%2F') > -1 ? decodeURIComponent(inputs.url) : inputs.url,
            'api_key': inputs.iframelyAPIKey || process.env.IFRAMELY_API_KEY
          },
          json: true
        },
        function (err, response, body) {
          if (!err) {
            if (body) {
              var meta = {};

              if (body.meta) {
                // general
                addMetaField(meta, body.meta, 'title', 'general');
                addMetaField(meta, body.meta, 'description', 'general');
                addMetaField(meta, body.meta, 'date', 'general');
                addMetaField(meta, body.meta, 'canonical', 'general');
                addMetaField(meta, body.meta, 'category', 'general');
                addMetaField(meta, body.meta, 'keywords', 'general');

                // attribution
                addMetaField(meta, body.meta, 'author', 'attribution');
                addMetaField(meta, body.meta, 'author_url', 'attribution');
                addMetaField(meta, body.meta, 'site', 'attribution');

                // stats
                addMetaField(meta, body.meta, 'views', 'stats');
                addMetaField(meta, body.meta, 'likes', 'stats');
                addMetaField(meta, body.meta, 'comments', 'stats');
                addMetaField(meta, body.meta, 'duration', 'stats');

                // geo
                addMetaField(meta, body.meta, 'country-name', 'geo');
                addMetaField(meta, body.meta, 'region', 'geo');
                addMetaField(meta, body.meta, 'latitude', 'geo');
                addMetaField(meta, body.meta, 'longitude', 'geo');

                // product
                addMetaField(meta, body.meta, 'price', 'product');
                addMetaField(meta, body.meta, 'currency_code', 'product');
                addMetaField(meta, body.meta, 'brand', 'product');
                addMetaField(meta, body.meta, 'product_id', 'product');
                addMetaField(meta, body.meta, 'availability', 'product');
                addMetaField(meta, body.meta, 'quantity', 'product');
              }

              // images
              if (body.links) {
                addImage(meta, 'icon', body.links);
                addImage(meta, 'thumbnail', body.links);
              }

              if (meta && meta.general && meta.general.title) {
                if (meta.thumbnail && meta.thumbnail.width > 150) {
                  state.title = meta.general.title;
                  state.link = meta.general.canonical;

                  if (meta.icon) {
                    state.icon = meta.icon.href;
                  }

                  if (meta.general.description) {
                    if (_.isString(meta.general.description)) {
                      if (meta.general.description.trim().length > 0) {
                        state.description = meta.general.description;
                      }
                    }
                  }

                  if (meta.attribution && meta.attribution.site) {
                    state.source = meta.attribution.site;
                  }

                  var width = '225px',
                    ratio = 225 / meta.thumbnail.width,
                    height = Math.round(meta.thumbnail.height * ratio) + 'px';

                  state.thumbnail = {
                    url: meta.thumbnail.href,
                    width: width,
                    height: height
                  };

                  // The view model and state are the same.
                  callback(null, state);
                }
                else {
                  callback(new Error('Could not get thumbnail data or thumbnail is too small from iFramely.'));
                }
              }
              else {
                callback(new Error('Could not get general meta data from iFramely.'));
              }
            }
            else {
              callback(new Error('Invalid response from iFramely.'));
            }
          }
          else {
            callback(err);
          }
        }
      );
    }

    function addMetaField(destination, source, field, section) {
      destination = destination || {};

      if (section) {
        destination[section] = destination[section] || {};
      }

      if (source[field]) {
        if (section) {
          destination[section][field] = source[field];
        }
        else {
          destination[field] = source[field];
        }
      }
    }

    function addImage(destination, imageType, source) {
      if (source[imageType]) {
        if (_.isArray(source[imageType])) {
          var images = [];

          for (var i = 0; i < source[imageType].length; i++) {
            var sourceImage = source[imageType][i];

            if (sourceImage.href) {
              var image = {
                href: sourceImage.href
              };

              if (sourceImage.media) {
                image.width = sourceImage.media.width;
                image.height = sourceImage.media.height;
              }

              images.push(image);
            }
          }

          if (images.length > 0) {
            if (imageType === 'thumbnail') {
              images = _.sortBy(images, 'width');
              destination[imageType] = images[images.length - 1];
            }
            else {
              destination[imageType] = images[0];
            }
          }
        }
      }
    }
  }
};

