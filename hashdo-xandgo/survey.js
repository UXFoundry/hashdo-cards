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
      card = this;

    // enable client side state and proxy support
    card.clientStateSupport = true;

    // previously cached?
    if (state.survey) {

      // render readonly card if already completed
      if (state.complete) {

        // disable client side state & proxy support
        card.clientStateSupport = false;

        callback(null, {
          survey: state.survey,
          responses: state.responses,
          complete: true
        });
      }
      else {

        // try for a newer version if no responses
        if (state.responses.length === 0) {
          XandGo.getSurvey(inputs.apiKey, inputs.secret, inputs.surveyId, state.version, function (newSurvey, newVersion) {
            if (newSurvey) {
              state.version = newVersion;
              state.survey = newSurvey;

              callback(null,
                {
                  survey: newSurvey,
                  responses: state.responses
                },
                {
                  questions: survey.questions,
                  responseCount: 0
                }
              );
            }
            else {
              callback(null,
                {
                  survey: state.survey,
                  responses: state.responses
                },
                {
                  questions: state.survey.questions,
                  responseCount: 0
                }
              );
            }
          });
        }
        else {
          callback(null,
            {
              survey: state.survey,
              responses: state.responses
            },
            {
              questions: survey.questions,
              responseCount: state.responses.length
            }
          );
        }
      }
    }
    else {
      XandGo.getSurvey(inputs.apiKey, inputs.secret, inputs.surveyId, null, function (survey, version) {
        state.version = version;
        state.survey = survey;
        state.responses = [];

        callback(null,
          {
            survey: survey,
            responses: []
          },
          {
            questions: survey.questions,
            responseCount: 0
          }
        );
      });
    }
  }
};