/* global card, locals, $, _lodash_survey */

// custom lodash build:
// lodash include=keys,isArray,trim,toNumber,isDate,isNumber,inRange,merge,startsWith,noConflict

card.onReady = function() {
  var currentQuestion,
    previousQuestionId,
    $modal,
    $q,
    $title,
    $description,
    $input,
    $done,
    $next,
    $back,
    currentQuestionIndex = 0,
    responses = locals.responses || {},
    $card = $('#' + locals.card.id),
    currentInstanceId = locals.instances[locals.instances.length - 1],
    baseXGoAPIUrl = 'https://xandgo.com/api/'

  initSwiper()
  initCustomInputs()

  // first survey loaded into document?
  if (typeof _lodash_survey === 'undefined') {
    // load css dependencies
    card.requireCSS('https://cdn.hashdo.com/css/survey.v22.css')

    // load js dependencies
    card.require('https://cdn.hashdo.com/js/survey.v10.js', function() {
      // start or continue
      attachStartOrContinueHandler()

      // subscribe to any state changes
      subscribeToStateChanges()

      // preload question images
      preloadQuestionImages()
    })
  } else {
    // dependencies already loaded.

    attachStartOrContinueHandler()
    subscribeToStateChanges()
    preloadQuestionImages()
  }

  // preload question images
  function preloadQuestionImages() {
    // preload question images
    if (locals.questionImages) {
      for (var i = 0; i < _lodash_survey.keys(locals.questionImages).length; i++) {
        var pi = new Image()
        pi.src = locals.questionImages[_lodash_survey.keys(locals.questionImages)[i]]
      }
    }
  }

  // summary footer click
  function attachStartOrContinueHandler() {
    $card.find('.hdc-survey-footer.active').click(function() {
      // start or continue survey
      ;(_lodash_survey.keys(responses).length === 0 ? startSurvey : continueSurvey).call()
    })
  }

  function subscribeToStateChanges() {
    card.state.onChange = function(val) {
      if (val) {
        if (val.instances) {
          $card
            .find('.hdc-survey-response-count')
            .html(val.instances.length + ' ' + (val.instances.length === 1 ? locals.labels.response : locals.labels.responses))
        }

        if (val.currentInstanceId === currentInstanceId) {
          var $progress = $card.find('.hdc-survey-progress'),
            percentageComplete = 0

          // calculate % complete
          if (val.responses) {
            var responseCount = _lodash_survey.keys(val.responses).length,
              questionCount = getQuestionCount()

            percentageComplete = Math.floor(responseCount / questionCount * 100)
          }

          if (val.complete) {
            percentageComplete = 100
            $card
              .find('.hdc-survey-footer')
              .removeClass('active')
              .html(locals.labels.completed)
              .off('click')
          }

          if (percentageComplete > 0) {
            $progress.find('h3').html(percentageComplete + '%')
            $progress.find('.hdc-survey-progress-percentage').css('width', percentageComplete + '%')
            $progress.show()

            if (percentageComplete < 100) {
              $card.find('.hdc-survey-footer').html(locals.labels.continue)
            }
          }
        }
      }
    }
  }

  function initSwiper() {
    if (locals.photoCount > 0) {
      if (typeof Swiper === 'undefined') {
        card.requireCSS('https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/css/swiper.min.css')

        card.require('https://cdnjs.cloudflare.com/ajax/libs/Swiper/3.3.1/js/swiper.min.js', function() {
          new Swiper('#' + locals.card.id + ' .swiper-container', {
            loop: true,
            width: 225,
            nextButton: '#' + locals.card.id + ' .swiper-button-next',
            prevButton: '#' + locals.card.id + ' .swiper-button-prev'
          })
        })
      } else {
        new Swiper('#' + locals.card.id + ' .swiper-container', {
          loop: true,
          width: 225,
          nextButton: '#' + locals.card.id + ' .swiper-button-next',
          prevButton: '#' + locals.card.id + ' .swiper-button-prev'
        })
      }
    }
  }

  function initCustomInputs() {
    var $inputs = $('.custom-checkbox input, .custom-radio input')

    $inputs.on('change', function() {
      var input = $(this),
        wrapper = input.parent(),
        checkedValue = $(this).attr('value')

      if (!input.is(':checked')) {
        input.val(checkedValue).prop('checked', false)
        input.removeAttr('checked')
        wrapper.removeClass('checked')
      } else {
        input.val(checkedValue).prop('checked', true)
        input.attr('checked', 'checked')
        wrapper.addClass('checked')
      }
    })

    $inputs.each(function() {
      var input = $(this),
        wrapper = input.parent().parent()

      if (input.is(':disabled')) {
        wrapper.addClass('disabled')
      }
    })

    $inputs.trigger('change')
  }

  // start a new survey
  function startSurvey() {
    currentQuestion = getQuestion(0)

    if (currentQuestion) {
      currentQuestionIndex = 0

      openModal()
      renderQuestion()

      card.proxy.post(baseXGoAPIUrl + 'survey/begin', {})
    }
  }

  // continue an incomplete survey
  function continueSurvey() {
    // get latest response
    var latestId,
      latestResponse,
      max = 0

    for (var i = 0; i < _lodash_survey.keys(responses).length; i++) {
      if (responses[_lodash_survey.keys(responses)[i]].dateTimeStamp > max) {
        latestId = _lodash_survey.keys(responses)[i]
        latestResponse = responses[latestId].response

        max = responses[latestId].dateTimeStamp
      }
    }

    if (latestId) {
      currentQuestionIndex = getQuestionIndexById(latestId)
      currentQuestion = getQuestionById(latestId)

      var nextQuestionIndex = getNextQuestionIndex(latestResponse)

      if (locals.questions[nextQuestionIndex]) {
        currentQuestionIndex = nextQuestionIndex
        currentQuestion = locals.questions[nextQuestionIndex]

        openModal()
        renderQuestion()

        card.proxy.post(baseXGoAPIUrl + 'survey/continue', {})
      } else {
        closeSurvey()
      }
    } else {
      closeSurvey()
    }
  }

  function resetSurvey() {
    var $progress = $card.find('.hdc-survey-progress')

    $progress.find('h3').html('')
    $progress.find('.hdc-survey-progress-percentage').css('width', '0')
    $progress.hide()

    currentQuestion = undefined
    previousQuestionId = undefined
    currentQuestionIndex = 0
    responses = {}

    $card
      .find('.hdc-survey-footer')
      .addClass('active')
      .html(locals.labels.start)
    attachStartOrContinueHandler()
  }

  function openModal() {
    $modal = card.modal.open(
      '<div class="hdc-survey-question">' +
        '<div class="hdc-survey-question-body">' +
        '<div class="hdc-survey-question-title"></div>' +
        '<div class="hdc-survey-question-description"></div>' +
        '<div class="hdc-survey-question-input"></div>' +
        '</div>' +
        '<div class="hdc-survey-question-footer">' +
        '<div class="hdc-survey-question-done" style="display: none;">' +
        locals.labels.done +
        '</div>' +
        '<div class="hdc-survey-question-next" style="display: block;">' +
        locals.labels.next +
        '</div>' +
        '<div class="hdc-survey-question-back" style="display: block;">' +
        locals.labels.back +
        '</div>' +
        '</div>' +
        '</div>'
    )

    $q = $modal.find('.hdc-survey-question')
    $title = $q.find('.hdc-survey-question-title')
    $description = $q.find('.hdc-survey-question-description')
    $input = $q.find('.hdc-survey-question-input')
    $done = $q.find('.hdc-survey-question-done')
    $next = $q.find('.hdc-survey-question-next')
    $back = $q.find('.hdc-survey-question-back')

    // set max height
    $q.find('.hdc-survey-question-body').css('max-height', getViewportSize().height - 75)

    // attach event handlers for this survey instance
    if (locals.allowBack) {
      $back.on('click', onBack)
    } else {
      $back.hide()
    }

    $next.on('click', onNext)
    $done.on('click', onDone)

    card.modal.onClose = function() {
      $q = $title = $description = $input = $done = $next = $back = undefined
    }
  }

  function resetModal() {
    $title.html('')
    $description.html('')
    $input.html('')

    $modal.find('.hdc-survey-question-footer div').hide()
  }

  // on modal next
  function onNext() {
    var response = getResponse()

    if (validateResponse(response)) {
      previousQuestionId = currentQuestion.id

      // save response
      var save = true
      if (responses[currentQuestion.id] && responses[currentQuestion.id].response === response) {
        save = false
      }

      if (save && typeof response !== 'undefined') {
        responses[currentQuestion.id] = {
          response: response,
          dateTimeStamp: new Date().getTime()
        }

        // save current question's response
        card.state.save({
          currentInstanceId: currentInstanceId,
          responses: responses,
          previousQuestionId: previousQuestionId
        })
      }

      // next question
      var nextQuestionIndex = getNextQuestionIndex(response)

      if (locals.questions[nextQuestionIndex]) {
        currentQuestionIndex = nextQuestionIndex
        currentQuestion = locals.questions[nextQuestionIndex]

        renderQuestion()
      } else {
        closeSurvey()
      }
    }
  }

  // on modal back
  function onBack() {
    if (currentQuestionIndex > 0) {
      var response = getResponse()

      if (validateResponse(response)) {
        // save response
        var save = true
        if (responses[currentQuestion.id] && responses[currentQuestion.id].response === response) {
          save = false
        }

        if (currentQuestion.replyType === 'end') {
          save = false
        }

        if (save && typeof response !== 'undefined') {
          responses[currentQuestion.id] = {
            response: response,
            dateTimeStamp: new Date().getTime()
          }

          // save current question's response
          card.state.save({
            currentInstanceId: currentInstanceId,
            responses: responses,
            previousQuestionId: previousQuestionId
          })
        }

        var previousQuestionIndex = getPreviousQuestionIndex(response)

        if (locals.questions[previousQuestionIndex]) {
          currentQuestionIndex = previousQuestionIndex
          currentQuestion = locals.questions[previousQuestionIndex]
          previousQuestionId = currentQuestion.id

          renderQuestion()
        }
      }
    }
  }

  // on modal done
  function onDone() {
    endSurvey()
  }

  function getQuestionCount() {
    if (locals.questions && _lodash_survey.isArray(locals.questions)) {
      return locals.questions.length
    } else {
      return 0
    }
  }

  function getQuestion(index) {
    if (locals.questions && locals.questions[index]) {
      return locals.questions[index]
    }
  }

  function getQuestionById(questionId) {
    if (locals.questions) {
      for (var i = 0; i < locals.questions.length; i++) {
        if (questionId === locals.questions[i].id) {
          return locals.questions[i]
        }
      }
    }
  }

  function getQuestionIndexById(questionId) {
    if (locals.questions) {
      for (var i = 0; i < locals.questions.length; i++) {
        if (questionId === locals.questions[i].id) {
          return i
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
        showBack = currentQuestionIndex > 0

      resetModal()

      // populate question
      $title.html(currentQuestion.message)

      // question image?
      if (locals.questionImages && locals.questionImages[currentQuestion.id]) {
        $title.prepend('<img src="' + locals.questionImages[currentQuestion.id] + '" style="max-width: 200px; display: block; margin: 0 auto;">')
      }

      if (currentQuestion.replyType === 'end') {
        $done.show()

        if (showBack && locals.allowBack) {
          $back.show()
        }
      } else {
        switch (currentQuestion.replyType) {
          case 'text':
            if (currentQuestion.reply && currentQuestion.reply.max) {
              inputHTML = '<input type="text" maxlength="' + currentQuestion.reply.max + '">'
            } else {
              inputHTML = '<input type="text">'
            }
            break

          case 'email':
            inputHTML = '<input type="email">'
            break

          case 'website':
            inputHTML = '<input type="url" placeholder="http://">'
            break

          case 'date':
            inputHTML = '<input type="date">'
            break

          case 'multipleChoice':
            inputHTML = '<div class="hdc-survey-input-options">'

            if (_lodash_survey.isArray(currentQuestion.reply)) {
              for (var i = 0; i < currentQuestion.reply.length; i++) {
                var controlType = currentQuestion.multipleSelections ? 'checkbox' : 'radio'
                var choice = currentQuestion.reply[i]._choice || currentQuestion.reply[i].choice

                inputHTML +=
                  '<div class="' +
                  controlType +
                  '">' +
                  '<label>' +
                  '<span class="custom-' +
                  controlType +
                  '">' +
                  '<input type="' +
                  controlType +
                  '" data-choice="' +
                  choice +
                  '" name="option-' +
                  currentQuestionIndex +
                  '" id="option-' +
                  currentQuestionIndex +
                  '-' +
                  i +
                  '">' +
                  '<span class="box">' +
                  '<span class="tick"></span>' +
                  '</span>' +
                  currentQuestion.reply[i].choice +
                  '</span>' +
                  '</label>' +
                  '</div>'
              }
            }

            inputHTML += '</div>'

            break

          case 'multipleChoiceQty':
            inputHTML = '<div class="hdc-survey-input-options">'

            if (_lodash_survey.isArray(currentQuestion.reply)) {
              for (var i = 0; i < currentQuestion.reply.length; i++) {
                var controlType = 'tel'
                var choice = currentQuestion.reply[i]._choice || currentQuestion.reply[i].choice

                inputHTML +=
                  '<div class="' +
                  controlType +
                  '">' +
                  '<input type="' +
                  controlType +
                  '" data-choice="' +
                  choice +
                  '" name="option-' +
                  currentQuestionIndex +
                  '" id="option-' +
                  currentQuestionIndex +
                  '-' +
                  i +
                  '"><label>' +
                  currentQuestion.reply[i].choice +
                  '</label>' +
                  '</div>'
              }
            }

            inputHTML += '</div>'

            break

          case 'number':
            inputHTML = '<input type="tel">'
            break

          case 'rating':
            inputHTML = '<input type="number" min="' + currentQuestion.reply.min + '" max="' + currentQuestion.reply.max + '">'
            description = '(' + currentQuestion.reply.min + ' - ' + currentQuestion.reply.max + ')'
            break

          case 'userField':
            inputHTML = '<input type="text">'
            value = getUserFieldValue(currentQuestion.reply.field)
            break

          case 'userDetail':
            inputHTML = '<input type="text">'
            value = getUserDetailValue(currentQuestion.reply.detail)
            break

          case 'image':
            inputHTML =
              '<label for="photo-' +
              currentQuestion.id +
              '"><div class="photo"><div class="placeholder" data-photo="' +
              currentQuestion.id +
              '"></div></div></label>'

            if (!isNative()) {
              inputHTML += '<input id="photo-' + currentQuestion.id + '" type="file" name="file" accept="image/*;capture=camera">'
            }

            inputHTML += '<input type="hidden" name="photo">'
            break
        }

        // overwrite value with previous response if any
        if (responses && responses[currentQuestion.id]) {
          if (typeof responses[currentQuestion.id].response !== 'undefined') {
            value = responses[currentQuestion.id].response
          }
        }

        // required
        if (currentQuestion.required && currentQuestion.replyType !== 'none') {
          if (description.length > 0) {
            description += ' '
          }

          description += '(' + locals.labels.required + ')'
        }

        // populate description, field, buttons / links and value
        $description.html(description)
        $input.html(inputHTML)

        if (currentQuestion.replyType === 'image') {
          initImageQuestion()
        }

        // populate response, if any
        setResponse(value)

        if (showNext) {
          $next.show()
        }

        if (showBack && locals.allowBack) {
          $back.show()
        }
      }
    }
  }

  function getResponse() {
    switch (currentQuestion.replyType) {
      case 'text':
      case 'email':
      case 'website':
      case 'userField':
      case 'userDetail':
        return _lodash_survey.trim($input.find('input').val())

      case 'date':
        return $input.find('input').val().length > 0 ? new Date($input.find('input').val()) : ''

      case 'rating':
      case 'number':
        return $input.find('input').val().length > 0 ? _lodash_survey.toNumber($input.find('input').val()) : ''

      case 'multipleChoice':
        if (currentQuestion.multipleSelections) {
          var selections = []

          $input.find('input[type=checkbox]:checked').each(function() {
            selections.push($(this).attr('data-choice'))
          })

          return selections.join(String.fromCharCode(30))
        } else {
          return $input.find('input[type="radio"]:checked').attr('data-choice')
        }

      case 'multipleChoiceQty':
        var selections = []

        $input.find('input[type="tel"]').each(function() {
          if ($(this).val() > 0) {
            selections.push($(this).val() + ' x ' + $(this).attr('data-choice'))
          }
        })

        return selections.join(String.fromCharCode(30))

      case 'image':
        var $img = $input.find('.placeholder.set')

        if ($img.length > 0) {
          var bg = $img.css('background-image'),
            start = 0,
            end = bg.length

          if (_lodash_survey.startsWith(bg, 'url(')) {
            start = 4
            end = bg.length - 5
          }

          return {
            publicId: $img.attr('data-publicid'),
            src: bg.substr(start, end).replace(/"/g, '')
          }
        } else {
          return ''
        }
    }
  }

  function setResponse(response) {
    switch (currentQuestion.replyType) {
      case 'text':
      case 'email':
      case 'website':
      case 'userField':
      case 'userDetail':
        $input.find('input').val(_lodash_survey.trim(response || ''))
        break

      case 'number':
      case 'rating':
        $input.find('input').val(response)
        break

      case 'date':
        var $el = $input.find('input')

        if ($el.length === 1) {
          $el[0].valueAsDate = new Date(response)
        }
        break

      case 'multipleChoice':
        if (currentQuestion.multipleSelections) {
          var selections = response.split(String.fromCharCode(30))

          for (j = 0; j < selections.length; j++) {
            $input.find('.hdc-survey-input-options input[data-choice="' + selections[j] + '"]').prop('checked', true)
          }
        } else {
          $input.find('.hdc-survey-input-options input[data-choice="' + response + '"]').prop('checked', true)
        }
        break

      case 'multipleChoiceQty':
        var selections = response.split(String.fromCharCode(30))

        for (j = 0; j < selections.length; j++) {
          var selection = selections[j].split(' x ')
          $input.find('.hdc-survey-input-options input[data-choice="' + selection[1] + '"]').val(selection[0])
        }

        break

      case 'image':
        if (response) {
          $input
            .find('.placeholder')
            .addClass('set')
            .attr('data-publicid', response.publicId)
            .css({
              'background-image': 'url(' + response.src + ')',
              'background-size': '100px 100px'
            })
        }
        break
    }
  }

  function validateResponse(response) {
    var $response,
      clearEvent = 'keypress',
      valid = true

    // validate response
    switch (currentQuestion.replyType) {
      case 'multipleChoice':
        $response = $input.find('.hdc-survey-input-options')
        clearEvent = 'change'

        if (!response && currentQuestion.required) {
          valid = false
        } else {
          if (_lodash_survey.isArray(currentQuestion.reply)) {
            var validOption = false

            for (var i = 0; i < currentQuestion.reply.length; i++) {
              if (currentQuestion.multipleSelections) {
                var selections = response.split(String.fromCharCode(30))

                for (j = 0; j < selections.length; j++) {
                  if (currentQuestion.reply[i].choice === selections[j] || currentQuestion.reply[i]._choice === selections[j]) {
                    validOption = true
                    break
                  }
                }

                if (validOption) {
                  break
                }
              } else {
                if (currentQuestion.reply[i].choice === response || currentQuestion.reply[i]._choice === response) {
                  validOption = true
                  break
                }
              }
            }

            if (currentQuestion.required && !validOption) {
              valid = false
            }
          }
        }
        break

      case 'multipleChoiceQty':
        $response = $input.find('.hdc-survey-input-options')
        clearEvent = 'change'

        if (!response && currentQuestion.required) {
          valid = false
        } else {
          if (_lodash_survey.isArray(currentQuestion.reply)) {
            var validOption = false

            for (var i = 0; i < currentQuestion.reply.length; i++) {
              var selections = response.split(String.fromCharCode(30))

              for (j = 0; j < selections.length; j++) {
                var selection = selections[j].split(' x ')

                if (currentQuestion.reply[i].choice === selection[1] || currentQuestion.reply[i]._choice === selection[1]) {
                  validOption = true
                  break
                }
              }

              if (validOption) {
                break
              }
            }

            if (currentQuestion.required && !validOption) {
              valid = false
            }
          }
        }
        break

      case 'text':
      case 'userField':
      case 'userDetail':
        $response = $input.find('input')
        clearEvent = 'keypress'

        if (currentQuestion.required && response.length === 0) {
          valid = false
        }
        break

      case 'email':
        $response = $input.find('input')
        clearEvent = 'keypress'

        if (currentQuestion.required) {
          if (response.length === 0) {
            valid = false
          }

          if (!isEmail(response)) {
            valid = false
          }
        } else {
          if (response) {
            if (!isEmail(response)) {
              valid = false
            }
          }
        }
        break

      case 'website':
        $response = $input.find('input')
        clearEvent = 'keypress'

        if (currentQuestion.required) {
          if (response.length === 0) {
            valid = false
          }

          if (!isURL(response)) {
            valid = false
          }
        } else {
          if (response) {
            if (!isURL(response)) {
              valid = false
            }
          }
        }
        break

      case 'date':
        $response = $input.find('input')
        clearEvent = 'keypress'

        if (currentQuestion.required) {
          if (!_lodash_survey.isDate(response)) {
            valid = false
          }
        } else {
          if (response) {
            if (!_lodash_survey.isDate(response)) {
              valid = false
            }
          }
        }
        break

      case 'number':
        $response = $input.find('input')
        clearEvent = 'keypress'

        if (currentQuestion.required) {
          if (response.length === 0) {
            valid = false
          }

          if (!_lodash_survey.isNumber(response)) {
            valid = false
          }
        } else {
          if (response) {
            if (!_lodash_survey.isNumber(response)) {
              valid = false
            }
          }
        }
        break

      case 'rating':
        $response = $input.find('input')
        clearEvent = 'keypress'

        if (currentQuestion.required) {
          if (!_lodash_survey.inRange(response, currentQuestion.reply.min, currentQuestion.reply.max + 1)) {
            valid = false
          }
        } else {
          if (response) {
            if (!_lodash_survey.inRange(response, currentQuestion.reply.min, currentQuestion.reply.max + 1)) {
              valid = false
            }
          }
        }
        break

      case 'image':
        $response = $input.find('.photo')
        clearEvent = 'click'

        if (currentQuestion.required) {
          valid = response && response.src && response.src.length > 0
        }

        break
    }

    if (!valid) {
      $response.addClass('invalid')

      function onClear() {
        $response.removeClass('invalid')
        $response.off(clearEvent, onClear)
      }

      $response.on(clearEvent, onClear)
    }

    return valid
  }

  function getNextQuestionIndex(response) {
    var nextQuestionIndex = currentQuestionIndex + 1

    // apply multiple choice jump logic
    if (typeof response !== 'undefined') {
      if (currentQuestion.replyType === 'multipleChoice') {
        for (var i = 0; i < currentQuestion.reply.length; i++) {
          if (currentQuestion.reply[i].choice === response || currentQuestion.reply[i]._choice === response) {
            if (currentQuestion.reply[i].jumpTo) {
              if (currentQuestion.reply[i].jumpTo === 'end') {
                nextQuestionIndex = Math.max()
              } else {
                nextQuestionIndex = getQuestionIndexById(currentQuestion.reply[i].jumpTo)
                break
              }
            }
          }
        }
      } else if (currentQuestion.replyType === 'multipleChoiceQty') {
        for (var i = 0; i < currentQuestion.reply.length; i++) {
          var selection = response.split(' x ')

          if (currentQuestion.reply[i].choice === selection[1] || currentQuestion.reply[i]._choice === selection[1]) {
            if (currentQuestion.reply[i].jumpTo) {
              if (currentQuestion.reply[i].jumpTo === 'end') {
                nextQuestionIndex = Math.max()
              } else {
                nextQuestionIndex = getQuestionIndexById(currentQuestion.reply[i].jumpTo)
                break
              }
            }
          }
        }
      }
    }

    // process any conditions on the next question
    var skip = processConditions(nextQuestionIndex)

    // skip
    if (skip) {
      currentQuestionIndex = nextQuestionIndex
      return getNextQuestionIndex()
    } else {
      return nextQuestionIndex
    }
  }

  function getPreviousQuestionIndex(response) {
    var previousQuestionIndex = currentQuestionIndex - 1

    previousQuestionId = previousQuestionId || locals.previousQuestionId

    if (previousQuestionId && previousQuestionId !== currentQuestion.id) {
      previousQuestionIndex = getQuestionIndexById(previousQuestionId)
    }

    // process any conditions on the previous question
    var skip = processConditions(previousQuestionIndex)

    // skip
    if (skip) {
      currentQuestionIndex = previousQuestionIndex
      return getPreviousQuestionIndex()
    } else {
      return previousQuestionIndex
    }
  }

  function processConditions(questionIndex) {
    var question = getQuestion(questionIndex),
      ands = true,
      ors = true,
      skip = false

    if (question && _lodash_survey.isArray(question.conditions)) {
      var results = {}

      for (var i = 0; i < question.conditions.length; i++) {
        results[question.conditions[i].operator] = results[question.conditions[i].operator] || []
        results[question.conditions[i].operator].push(validateCondition(question.conditions[i]))
      }

      results.and = results.and || []
      results.or = results.or || []

      // ands
      if (results.and.indexOf(false) > -1) {
        ands = false
      }

      // ors
      if (results.or.length > 0) {
        var falseCount = 0

        for (var i = 0; i < results.or.length; i++) {
          if (!results.or[i]) {
            falseCount++
          }
        }

        if (falseCount === results.or.length) {
          ors = false
        }
      }

      skip = !(ands && ors)
    }

    return skip
  }

  function validateCondition(condition) {
    if (condition) {
      var question = getQuestionById(condition.questionId)

      if (question) {
        if (condition.userGroupId) {
          var usersGroups = locals.user.groups || []

          if (usersGroups.indexOf(condition.userGroupId) > -1) {
            return true
          } else {
            return false
          }
        } else {
          var response = responses[question.id]

          if (response) {
            var responseArray = [response.response],
              resultArray = []

            if (question.replyType === 'multipleChoice' && question.multipleSelections) {
              responseArray = response.response.split(String.fromCharCode(30))
            }

            if (question.replyType === 'multipleChoiceQty') {
              responseArray = []

              var qtyResponseArray = response.response.split(String.fromCharCode(30))

              for (var i = 0; i < qtyResponseArray.length; i++) {
                responseArray.push(qtyResponseArray[i].split(' x ')[1])
              }
            }

            for (var i = 0; i < responseArray.length; i++) {
              switch (condition.operation) {
                case '=':
                  resultArray.push(condition.response == responseArray[i])
                  break

                case '!=':
                  resultArray.push(condition.response != responseArray[i])
                  break

                case '*':
                  resultArray.push(isWildcardMatch(response.response, responseArray[i]))
                  break

                case '>':
                  resultArray.push(condition.response > responseArray[i])
                  break

                case '>=':
                  resultArray.push(condition.response >= responseArray[i])
                  break

                case '<':
                  resultArray.push(condition.response < responseArray[i])
                  break

                case '<=':
                  resultArray.push(condition.response <= responseArray[i])
                  break
              }
            }

            return resultArray.indexOf(true) > -1
          } else {
            return true
          }
        }
      } else {
        return true
      }
    } else {
      return true
    }
  }

  function endSurvey() {
    closeSurvey()

    // flag as complete
    card.state.save({
      complete: true,
      currentInstanceId: currentInstanceId,
      completeDateTimeStamp: new Date().getTime()
    })

    $card.trigger('hdc:survey:complete', {
      surveyId: locals.surveyId
    })

    // save responses
    var responseToSave = {},
      responseQuestionIds = _lodash_survey.keys(responses)

    if (_lodash_survey.isArray(responseQuestionIds)) {
      for (var i = 0; i < responseQuestionIds.length; i++) {
        var question = getQuestionById(responseQuestionIds[i])

        responseToSave[responseQuestionIds[i]] = {
          question: question.message,
          response: responses[responseQuestionIds[i]].response
        }
      }
    }

    // proxy complete call to X&Go
    card.proxy.post(baseXGoAPIUrl + 'survey/complete', { responses: JSON.stringify(responseToSave) })

    // reopen?
    if (locals.limit === 0 || locals.instances.length + 1 < locals.limit) {
      setTimeout(function() {
        resetSurvey()

        currentInstanceId = cuid()
        locals.instances.push(currentInstanceId)

        card.state.save({
          complete: false,
          responses: null,
          completeDateTimeStamp: null,
          previousQuestionId: null,
          instances: locals.instances
        })
      }, 3000)
    }
  }

  function closeSurvey() {
    // remove events
    $card
      .find('.hdc-survey-footer')
      .removeClass('active')
      .html(locals.labels.completed)
      .off('click')

    // modal modal
    card.modal.close()
  }

  function getUserFieldValue(field) {
    if (locals.user) {
      var user = locals.user,
        value

      switch (field) {
        case 'name':
          var name = ''

          if (user.name) {
            if (user.name.first) {
              name = user.name.first
            }

            if (user.name.last) {
              if (name.length > 0) {
                name = name + ' '
              }

              name = name + user.name.last
            }
          }

          if (name.length > 0) {
            value = name
          }

          break

        case 'email':
          if (user.email) {
            value = user.email
          }
          break

        case 'cell':
          if (user.cell) {
            value = user.cell
          }
          break

        case 'twitter':
          if (user.twitter) {
            value = user.twitter
          }
          break

        case 'website':
          if (user.website) {
            value = user.website
          }
          break
      }

      return value
    }
  }

  function getUserDetailValue(detail) {
    if (locals.user) {
      var user = locals.user

      if (_lodash_survey.isArray(user.details)) {
        for (var i = 0; i < user.details.length; i++) {
          if (user.details[i].label === detail) {
            return user.details[i].value
          }
        }
      }
    }
  }

  function initImageQuestion() {
    if (isNative()) {
      $modal.find('.placeholder[data-photo="' + currentQuestion.id + '"]').on('click', function() {
        $card.trigger('hdc:photo', {
          surveyId: locals.surveyId,
          callback: onPhoto
        })
      })
    } else {
      $modal.find('#photo-' + currentQuestion.id).on('change', onFile)
    }
  }

  function onPhoto(photo) {
    if (photo) {
      $input
        .find('.placeholder')
        .addClass('set')
        .attr('data-publicid', photo.publicId)
        .css({
          'background-image': 'url(' + photo.src + ')',
          'background-size': '100px 100px'
        })
    }
  }

  function onFile() {
    var $file = $(this)

    if ($file.length > 0) {
      if ($file[0].files && $file[0].files.length > 0) {
        var file = $file[0].files[0],
          reader = new FileReader(),
          fileSize = (file.size / 1024 / 1024).toFixed(4),
          description = $description.html()

        if (fileSize > 5) {
          $description.html('<span style="color: #ff0000">Image too large. Max file size is 5Mb.</span>')

          setTimeout(function() {
            $description.html(description)
          }, 5000)
        } else {
          reader.readAsDataURL(file)

          reader.onloadend = function() {
            var base64 = reader.result

            $input
              .find('.placeholder')
              .addClass('set')
              .css({
                'background-image': 'url(' + base64 + ')',
                'background-size': '100px 100px'
              })
          }
        }
      }
    }
  }

  function isNative() {
    return typeof cordova !== 'undefined' || typeof phonegap !== 'undefined'
  }

  function isEmail(str) {
    // These comments use the following terms from RFC2822:
    // local-part, domain, domain-literal and dot-atom.
    // Does the address contain a local-part followed an @ followed by a domain?
    // Note the use of lastIndexOf to find the last @ in the address
    // since a valid email address may have a quoted @ in the local-part.
    // Does the domain name have at least two parts, i.e. at least one dot,
    // after the @? If not, is it a domain-literal?
    // This will accept some invalid email addresses
    // BUT it doesn't reject valid ones.
    var atSym = str.lastIndexOf('@')

    // no local-part
    if (atSym < 1) {
      return false
    }

    // no domain
    if (atSym == str.length - 1) {
      return false
    }

    // there may only be 64 octets in the local-part
    if (atSym > 64) {
      return false
    }

    // there may only be 255 octets in the domain
    if (str.length - atSym > 255) {
      return false
    }

    // Is the domain plausible?
    var lastDot = str.lastIndexOf('.')

    // Check if it is a dot-atom such as example.com
    if (lastDot > atSym + 1 && lastDot < str.length - 1) {
      return true
    }

    //  Check if could be a domain-literal.
    if (str.charAt(atSym + 1) == '[' && str.charAt(str.length - 1) == ']') {
      return true
    }

    return false
  }

  /*!
   * Copyright (c) 2015 Chris O'Hara <cohara87@gmail.com>
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  var default_fqdn_options = {
    require_tld: true,
    allow_underscores: false,
    allow_trailing_dot: false
  }

  function isFQDN(str, options) {
    options = _lodash_survey.merge(options, default_fqdn_options)

    /* Remove the optional trailing dot before checking validity */
    if (options.allow_trailing_dot && str[str.length - 1] === '.') {
      str = str.substring(0, str.length - 1)
    }

    var parts = str.split('.')

    if (options.require_tld) {
      var tld = parts.pop()

      if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
        return false
      }
    }

    for (var part, i = 0; i < parts.length; i++) {
      part = parts[i]

      if (options.allow_underscores) {
        if (part.indexOf('__') >= 0) {
          return false
        }

        part = part.replace(/_/g, '')
      }

      if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
        return false
      }

      if (/[\uff01-\uff5e]/.test(part)) {
        // disallow full-width chars
        return false
      }

      if (part[0] === '-' || part[part.length - 1] === '-') {
        return false
      }

      if (part.indexOf('---') >= 0 && part.slice(0, 4) !== 'xn--') {
        return false
      }
    }

    return true
  }

  var ipv4Maybe = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
    ipv6Block = /^[0-9A-F]{1,4}$/i

  function isIP(str, version) {
    version = version ? version + '' : ''

    if (!version) {
      return isIP(str, 4) || isIP(str, 6)
    } else if (version === '4') {
      if (!ipv4Maybe.test(str)) {
        return false
      }

      var parts = str.split('.').sort(function(a, b) {
        return a - b
      })

      return parts[3] <= 255
    } else if (version === '6') {
      var blocks = str.split(':')
      var foundOmissionBlock = false // marker to indicate ::

      // At least some OS accept the last 32 bits of an IPv6 address
      // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
      // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
      // and '::a.b.c.d' is deprecated, but also valid.
      var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4)
      var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8

      if (blocks.length > expectedNumberOfBlocks) return false

      // initial or final ::
      if (str === '::') {
        return true
      } else if (str.substr(0, 2) === '::') {
        blocks.shift()
        blocks.shift()

        foundOmissionBlock = true
      } else if (str.substr(str.length - 2) === '::') {
        blocks.pop()
        blocks.pop()

        foundOmissionBlock = true
      }

      for (var i = 0; i < blocks.length; ++i) {
        // test for a :: which can not be at the string start/end
        // since those cases have been handled above
        if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
          if (foundOmissionBlock) return false // multiple :: in address

          foundOmissionBlock = true
        } else if (foundIPv4TransitionBlock && i == blocks.length - 1) {
          // it has been checked before that the last
          // block is a valid IPv4 address
        } else if (!ipv6Block.test(blocks[i])) {
          return false
        }
      }

      if (foundOmissionBlock) {
        return blocks.length >= 1
      } else {
        return blocks.length === expectedNumberOfBlocks
      }
    }

    return false
  }

  var default_url_options = {
    protocols: ['http', 'https'],
    require_tld: true,
    require_protocol: false,
    require_valid_protocol: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false
  }

  function isURL(url, options) {
    if (!url || url.length >= 2083 || /\s/.test(url)) {
      return false
    }

    if (url.indexOf('mailto:') === 0) {
      return false
    }

    options = _lodash_survey.merge(options, default_url_options)

    var protocol, auth, host, hostname, port, port_str, split

    split = url.split('://')

    if (split.length > 1) {
      protocol = split.shift()

      if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
        return false
      }
    } else if (options.require_protocol) {
      return false
    } else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
      split[0] = url.substr(2)
    }

    url = split.join('://')
    split = url.split('#')
    url = split.shift()

    split = url.split('?')
    url = split.shift()

    split = url.split('/')
    url = split.shift()
    split = url.split('@')

    if (split.length > 1) {
      auth = split.shift()

      if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
        return false
      }
    }

    hostname = split.join('@')
    split = hostname.split(':')
    host = split.shift()

    if (split.length) {
      port_str = split.join(':')
      port = parseInt(port_str, 10)

      if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
        return false
      }
    }

    if (!isIP(host) && !isFQDN(host, options) && host !== 'localhost') {
      return false
    }

    if (options.host_whitelist && options.host_whitelist.indexOf(host) === -1) {
      return false
    }

    if (options.host_blacklist && options.host_blacklist.indexOf(host) !== -1) {
      return false
    }

    return true
  }

  function isWildcardMatch(input, pattern) {
    return makeRe(pattern, true).test(input)
  }

  var reCache = {}

  function makeRe(pattern, shouldNegate) {
    var cacheKey = pattern + shouldNegate

    if (reCache[cacheKey]) {
      return reCache[cacheKey]
    }

    var negated = false

    if (pattern[0] === '!') {
      negated = true
      pattern = pattern.slice(1)
    }

    pattern = escapeStringRegexp(pattern).replace(/\\\*/g, '.*')

    if (negated && shouldNegate) {
      pattern = '(?!' + pattern + ')'
    }

    var re = new RegExp('^' + pattern + '$', 'i')

    re.negated = negated

    reCache[cacheKey] = re

    return re
  }

  function escapeStringRegexp(str) {
    if (typeof str !== 'string') {
      return str
    } else {
      return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    }
  }

  function getViewportSize() {
    var x = 0,
      y = 0

    if (window.innerHeight) {
      x = window.innerWidth
      y = window.innerHeight
    } else if (document.documentElement && document.documentElement.clientHeight) {
      x = document.documentElement.clientWidth
      y = document.documentElement.clientHeight
    } else if (document.body) {
      x = document.body.clientWidth
      y = document.body.clientHeight
    }

    return {
      width: x,
      height: y
    }
  }
}
