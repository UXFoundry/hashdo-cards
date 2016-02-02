/* global card, locals, _, $ */

card.onReady = function () {
  var currentQuestion,
    currentQuestionIndex = 0,
    responses = locals.responses || [],
    $card = $('#' + locals.card.id),
    $modal = $card.find('.survey-modal'),
    $q = $modal.find('.survey-question'),
    $title = $q.find('h3'),
    $description = $q.find('.survey-question-description'),
    $input = $q.find('.survey-question-input'),
    $next = $q.find('.survey-question-next'),
    $back = $q.find('.survey-question-back');

  // load lodash if needed
  if (typeof _ === 'undefined') {
    card.require('https://cdn.jsdelivr.net/lodash/4.2.0/lodash.min.js');
  }

  // summary footer click
  $card.find('.survey-footer').click(function () {
    // start or continue survey
    (locals.responses.length === 0 ? startSurvey : continueSurvey).call();
  });

  function startSurvey() {
    currentQuestion = getQuestion(0);

    if (currentQuestion) {
      currentQuestionIndex = 0;

      renderQuestion();

      // open modal
      $modal.addClass('open');
    }
  }

  function continueSurvey() {

  }
  
  // modal next
  $next.click(function () {
    var response = getResponse();
    
    if (validateResponse(response)) {
      var nextQuestionIndex = getNextQuestionIndex(response);
      
      // save response
      responses.push({
        question: currentQuestion,
        response: response,
        dateTimeStamp: new Date().getTime()
      });
      
      card.state.save({
        responses: responses
      });
      
      // next question
      if (locals.questions[nextQuestionIndex]) {
        currentQuestionIndex = nextQuestionIndex;
        currentQuestion = locals.questions[nextQuestionIndex];
        
        renderQuestion();
      }
      else {
        // end survey
      }
    }
  });

  // modal back
  $back.click(function () {

  });

  // modal close
  $modal.find('a[href="#close"]').click(function () {
    $modal.removeClass('open');
  });

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
        showBack = responses.length > 0;

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
      
      // populate
      $title.html(currentQuestion.message);
      $description.html(description);
      $input.html(inputHTML);

      if (value) {
        var $answer = $input.children().first();
        $answer.val(value).focus()[0].select();
      }

      $next.hide();
      $back.hide();

      if (showNext) {
        $next.show();
      }

      if (showBack) {
        $back.show();
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

