module.exports = {
  name: 'Survey',
  description: 'An X&Go Survey Card.',
  icon: 'http://cdn.hashdo.com/icons/survey.png',

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
    requestId: {
      example: '552fa62425186c6012edcf18',
      description: 'The current request\'s ID.',
      required: true
    },
    userId: {
      example: '552fa62425186c6012edcf18',
      description: 'The current user\'s X&Go ID.',
      required: true,
      secure: true
    },
    surveyId: {
      example: '552fa62425186c6012edcf18',
      description: 'The X&Go ID of the survey to display.',
      required: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var XandGo = require('./lib/xandgo'),
      card = this,
      Moment = require('moment'),
      CUID = require('cuid'),
      _ = require('lodash');

    // enable client side state and proxy support
    card.clientStateSupport = true;
    card.clientProxySupport = true;

    // previously cached?
    if (state.survey) {

      // legacy state support
      state.instances = state.instances || [];

      // render readonly card if already completed
      if (state.complete || (state.survey.limit !== 0 && state.instances.length > state.survey.limit)) {

        // disable client side state & proxy support
        card.clientStateSupport = false;
        card.clientProxySupport = false;

        callback(null, {
          survey: state.survey,
          percentageComplete: 100,
          complete: true,
          completeDate: formatDate(state.completeDateTimeStamp, state.survey.timezoneOffset),
          labels: getLabels(state.survey.translations, state.language || 'en',
            {
              questionCount: '{{COUNT}} question survey',
              response: 'response',
              responses: 'responses',
              completed: 'Completed',
              continue: 'Continue',
              start: 'Start'
            },
            {
              count: state.survey.questions.length
            }
          )
        });
      }
      else {
        // try for a newer version if no responses
        if (_.keys(state.responses).length === 0) {
          var version = state.version;

          // reopened survey's responses will be set to null. Force API fetch
          if (state.responses === null) {
            version = 0;
          }

          XandGo.getSurvey(inputs.apiKey, inputs.secret, inputs.surveyId, version, function (newSurvey, newVersion) {
            if (newSurvey) {
              state.version = newVersion;
              state.survey = newSurvey;

              execCardDataCallback(newSurvey, {}, state.instances, callback);
            }
            else {
              execCardDataCallback(state.survey, {}, state.instances, callback);
            }
          });
        }
        else {
          execCardDataCallback(state.survey, state.responses, state.instances, callback);
        }
      }
    }
    else {
      XandGo.getSurvey(inputs.apiKey, inputs.secret, inputs.surveyId, null, function (survey, version) {
        if (survey) {
          state.version = version;
          state.survey = survey;
          state.responses = {};
          state.instances = [CUID()];

          execCardDataCallback(survey, state.responses, state.instances, callback);
        }
        else {
          callback(new Error('Could not find survey with ID ' + (inputs.surveyId || '?')));
        }
      });
    }

    function execCardDataCallback(survey, responses, instances, callback) {
      XandGo.getUser(inputs.apiKey, inputs.secret, inputs.userId, function (user) {
        if (!user) {
          callback(new Error('Unknown User: ' + (inputs.userId || '?')));
        }
        else {
          // save user's language to state
          state.language = user.language;

          callback && callback(null,

            // jade locals
            {
              survey: survey,
              responseCount: _.keys(responses || {}).length,
              percentageComplete: Math.floor((_.keys(responses || {}).length / survey.questions.length) * 100),
              instances: instances,
              labels: getLabels(survey.translations, user.language,
                {
                  questionCount: '{{COUNT}} question survey',
                  response: 'response',
                  responses: 'responses',
                  completed: 'Completed',
                  continue: 'Continue',
                  start: 'Start'
                },
                {
                  count: survey.questions.length
                }
              )
            },

            // js client side locals
            {
              surveyId: survey.id,
              questions: survey.questions,
              responses: responses || {},
              user: user,
              limit: survey.limit,
              instances: instances,
              previousQuestionId: state.previousQuestionId,
              photoCount: survey.photos.length,
              allowBack: survey.allowBack,
              labels: getLabels(survey.translations, user.language, {
                start: 'Start',
                next: 'Next',
                back: 'Back',
                done: 'Done',
                required: 'required',
                response: 'response',
                responses: 'responses',
                completed: 'Completed',
                continue: 'Continue'
              })
            }
          );
        }
      });
    }

    function formatDate(value, timezoneOffset, format) {
      format = format || 'D MMM YYYY H:mm';

      if (value) {
        var dt = Moment(value).utc();

        // default offset to GMT +2
        if (_.isUndefined(timezoneOffset) || _.isNull(timezoneOffset) || !_.isNumber(timezoneOffset)) {
          timezoneOffset = 120;
        }

        return dt.utcOffset(timezoneOffset).format(format);
      }
      else {
        return '';
      }
    }

    function getLabels(translations, languageCode, defaults, values) {
      var labels = {};

      _.each(_.keys(defaults), function (defaultKey) {
        labels[defaultKey] = lookupTranslation(translations, languageCode, 'labels', defaultKey, defaults[defaultKey])

        // replace any tokens with provided values
        if (values) {
          _.each(_.keys(values), function (valueKey) {
            labels[defaultKey] = labels[defaultKey].replace('{{' + valueKey.toUpperCase() + '}}', values[valueKey])
          });
        }
      });

      return labels;
    }

    function lookupTranslation(translations, languageCode, section, key, defaultValue) {
      if (translations) {
        if (translations[languageCode]) {
          if (translations[languageCode][section]) {
            if (translations[languageCode][section][key]) {
              return translations[languageCode][section][key];
            }
          }
        }
      }

      return defaultValue;
    }
  }
};
