/* global card, locals, _, $ */

card.onReady = function () {
  var currentQuestion,
    currentQuestionIndex = 0,
    responses = locals.responses || {},
    $card = $('#' + locals.card.id),
    $modal = $card.find('.survey-modal'),
    $q = $modal.find('.survey-question'),
    $title = $q.find('h3'),
    $description = $q.find('.survey-question-description'),
    $input = $q.find('.survey-question-input'),
    $done = $q.find('.survey-question-done'),
    $next = $q.find('.survey-question-next'),
    $back = $q.find('.survey-question-back');

  // load lodash if needed
  if (typeof _ === 'undefined') {
    card.require('https://cdn.jsdelivr.net/lodash/4.2.0/lodash.min.js');
  }

  // subscribe to any state changes
  card.state.onChange = function (val) {
    var percentageComplete = 0;

    if (val && val.responses) {
      var responseCount = _.keys(val.responses).length,
        questionCount = getQuestionCount();

      percentageComplete = Math.floor((responseCount / questionCount) * 100);
    }

    if (val.complete) {
      percentageComplete = 100;
    }

    if (percentageComplete > 0) {
      var $progress = $card.find('.survey-progress');

      $progress.find('h3').html(percentageComplete + '%');
      $progress.find('.survey-progress-percentage').css('width', percentageComplete + '%');
      $progress.show();
    }
  };

  // summary footer click
  $card.find('.survey-footer.active').click(function () {
    // start or continue survey
    (_.keys(locals.responses).length === 0 ? startSurvey : continueSurvey).call();
  });

  // start a new survey
  function startSurvey() {
    currentQuestion = getQuestion(0);

    if (currentQuestion) {
      currentQuestionIndex = 0;

      // open modal
      openModal();

      renderQuestion();
    }
  }

  // continue an incomplete survey
  function continueSurvey() {
    // get latest response
    var latestId, latestResponse,
      max = 0;

    for (var i = 0; i < _.keys(locals.responses).length; i++) {
      if (locals.responses[_.keys(locals.responses)[i]].dateTimeStamp > max) {
        latestId = _.keys(locals.responses)[i];
        latestResponse = locals.responses[latestId].response;

        max = locals.responses[latestId].dateTimeStamp;
      }
    }

    if (latestId) {
      currentQuestionIndex = getQuestionIndexById(latestId);
      currentQuestion = getQuestionById(latestId);

      var nextQuestionIndex = getNextQuestionIndex(latestResponse);

      if (locals.questions[nextQuestionIndex]) {
        currentQuestionIndex = nextQuestionIndex;
        currentQuestion = locals.questions[nextQuestionIndex];

        // open modal
        openModal();

        renderQuestion();
      }
      else {
        endSurvey();
      }
    }
    else {
      endSurvey();
    }
  }

  function openModal() {
    $modal.addClass('open');
  }

  function closeModal() {
    $modal.removeClass('open');
  }

  function resetModal() {
    $title.html('');
    $description.html('');
    $input.html('');

    $done.hide();
    $next.hide();
    $back.hide();
  }

  // modal next
  $next.click(function () {
    var response = getResponse();

    if (validateResponse(response)) {
      // save response
      responses[currentQuestion.id] = {
        response: response,
        dateTimeStamp: new Date().getTime()
      };

      card.state.save({
        responses: responses
      });

      // next question
      var nextQuestionIndex = getNextQuestionIndex(response);

      if (locals.questions[nextQuestionIndex]) {
        currentQuestionIndex = nextQuestionIndex;
        currentQuestion = locals.questions[nextQuestionIndex];

        renderQuestion();
      }
      else {
        endSurvey();
      }
    }
  });

  // modal back
  $back.click(function () {

  });

  // modal done
  $done.click(function () {
    endSurvey();
  });

  // modal close
  $modal.find('a[href="#close"]').click(function () {
    closeModal();
  });

  function getQuestionCount() {
    if (locals.questions && _.isArray(locals.questions)) {
      return locals.questions.length;
    }
    else {
      return 0;
    }
  }

  function getQuestion(index) {
    if (locals.questions && locals.questions[index]) {
      return locals.questions[index];
    }
  }

  function getQuestionById(questionId) {
    if (locals.questions) {
      for (var i = 0; i < locals.questions.length; i++) {
        if (questionId === locals.questions[i].id) {
          return locals.questions[i];
        }
      }
    }
  }

  function getQuestionIndexById(questionId) {
    if (locals.questions) {
      for (var i = 0; i < locals.questions.length; i++) {
        if (questionId === locals.questions[i].id) {
          return i;
        }
      }
    }
  }

  function renderQuestion() {
    if (currentQuestion) {
      var description = '',
        inputHTML = '',
        value = '',
        showNext = true,
        showBack = _.keys(responses).length > 0;

      resetModal();

      // populate question
      $title.html(currentQuestion.message);

      if (currentQuestion.replyType === 'end') {
        $done.show();

        // flag as complete
        card.state.save({
          complete: true,
          completeDateTimeStamp: new Date().getTime()
        });
      }
      else {
        switch (currentQuestion.replyType) {
          case 'rating':
            description = '(' + currentQuestion.reply.min + ' - ' + currentQuestion.reply.max + ')';
            inputHTML = '<input type="number">';
            break;

          case 'userField':
            inputHTML = '<input type="text">';
            value = getUserFieldValue(currentQuestion.reply.field);
            break;

          case 'userDetail':
            inputHTML = '<input type="text">';
            value = getUserDetailValue(currentQuestion.reply.field);
            break;
        }

        // populate description, field and buttons
        $description.html(description);
        $input.html(inputHTML);

        if (value) {
          var $answer = $input.children().first();
          $answer.val(value).focus()[0].select();
        }

        if (showNext) {
          $next.show();
        }

        if (showBack) {
          $back.show();
        }
      }
    }
  }

  function getResponse() {
    var $response = $input.children().first(),
      response = _.trim($response.val());

    return response;
  }

  function validateResponse(response) {
    var $response = $input.children().first(),
      valid = true;

    // validate response
    switch (currentQuestion.replyType) {
      case 'multipleChoice':
        if (_.isArray(currentQuestion.reply)) {
          var validOption = false;

          for (var i = 0; i < currentQuestion.reply.length; i++) {
            if (currentQuestion.reply[i].choice === response) {
              validOption = true;
              break;
            }
          }

          if (!validOption) {
            valid = false;
          }
        }
        break;

      case 'text':
      case 'userField':
      case 'userDetail':
        if (response.length === 0) {
          valid = false;
        }
        break;

      case 'rating':
        if (!_.inRange(response, currentQuestion.reply.min, currentQuestion.reply.max + 1)) {
          valid = false;
        }
        break;
    }

    if (!valid) {
      $response.addClass('invalid');

      function onKeyPress() {
        $response.removeClass('invalid');
        $response.off('keypress', onKeyPress);
      }

      $response.on('keypress', onKeyPress);
    }

    return valid;
  }

  function getNextQuestionIndex(response) {
    var nextQuestionIndex = currentQuestionIndex + 1;

    // apply multiple choice jump logic
    if (currentQuestion.replyType === 'multipleChoice') {
      for (var i = 0; i < currentQuestion.reply.length; i++) {
        if (currentQuestion.reply[i].choice === response) {
          if (currentQuestion.reply[i].jumpTo) {
            if (currentQuestion.reply[i].jumpTo === 'end') {
              nextQuestionIndex = Math.max();
            }
            else {
              nextQuestionIndex = getQuestionIndexById(currentQuestion.reply[i].jumpTo);
              break;
            }
          }
        }
      }
    }

    return nextQuestionIndex;
  }

  function endSurvey() {
    $card.find('.survey-footer').removeClass('active').html('Completed').off('click');
    closeModal();
  }

  function getUserFieldValue(field) {
    if (locals.user) {
      var user = locals.user,
        value;

      switch (field) {
        case 'name':
          var name = '';

          if (user.name) {
            if (user.name.first) {
              name = user.name.first;
            }

            if (user.name.last) {
              if (name.length > 0) {
                name = name + ' ';
              }

              name = name + user.name.last;
            }
          }

          if (name.length > 0) {
            value = name;
          }

          break;

        case 'email':
          if (user.email) {
            value = user.email;
          }
          break;

        case 'cell':
          if (user.cell) {
            value = user.cell;
          }
          break;

        case 'twitter':
          if (user.twitter) {
            value = user.twitter;
          }
          break;

        case 'website':
          if (user.website) {
            value = user.website;
          }
          break;
      }

      return value;
    }
  }

  function getUserDetailValue(detail) {
    if (locals.user) {
      var user = locals.user;

      if (_.isArray(user.details)) {
        for (var i = 0; i < user.details.length; i++) {
          if (user.details[i].label === detail) {
            return user.details[i].value;
          }
        }
      }
    }
  }
};
