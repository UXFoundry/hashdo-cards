/* global card, locals, $, _lodash_survey */

// custom lodash build:
// lodash include=keys,isArray,trim,toNumber,isDate,inRange,merge,noConflict

card.onReady = function () {
  var currentQuestion, previousQuestionId,
    $modal, $q, $close, $title, $description, $input, $done, $next, $back,
    currentQuestionIndex = 0,
    responses = locals.responses || {},
    $card = $('#' + locals.card.id);

  // first survey loaded into document?
  if (typeof _lodash_survey === 'undefined') {

    // load css dependencies
    card.requireCSS('https://cdn.hashdo.com/css/survey.modal.css');

    // load js dependencies
    card.require('https://cdn.hashdo.com/js/lodash.survey.js', function () {

      // subscribe to any state changes
      subscribeToStateChanges();
    });
  }
  else {
    // subsequent survey cards just need to subscribe to state changes.
    // dependencies already loaded.

    subscribeToStateChanges();
  }

  function subscribeToStateChanges() {
    card.state.onChange = function (val) {
      var percentageComplete = 0;

      if (val && val.responses) {
        var responseCount = _lodash_survey.keys(val.responses).length,
          questionCount = getQuestionCount();

        percentageComplete = Math.floor((responseCount / questionCount) * 100);
      }

      if (val.complete) {
        percentageComplete = 100;
        $card.find('.hdc-survey-footer').removeClass('active').html('Completed').off('click');
      }

      if (percentageComplete > 0) {
        var $progress = $card.find('.hdc-survey-progress');

        $progress.find('h3').html(percentageComplete + '%');
        $progress.find('.hdc-survey-progress-percentage').css('width', percentageComplete + '%');
        $progress.show();

        if (percentageComplete < 100) {
          $card.find('.hdc-survey-footer').html('Continue');
        }
      }
    };
  }

  // summary footer click
  $card.find('.hdc-survey-footer.active').click(function () {
    // start or continue survey
    (_lodash_survey.keys(locals.responses).length === 0 ? startSurvey : continueSurvey).call();
  });

  // start a new survey
  function startSurvey() {
    currentQuestion = getQuestion(0);

    if (currentQuestion) {
      currentQuestionIndex = 0;

      openModal();
      renderQuestion();
    }
  }

  // continue an incomplete survey
  function continueSurvey() {
    // get latest response
    var latestId, latestResponse,
      max = 0;

    for (var i = 0; i < _lodash_survey.keys(locals.responses).length; i++) {
      if (locals.responses[_lodash_survey.keys(locals.responses)[i]].dateTimeStamp > max) {
        latestId = _lodash_survey.keys(locals.responses)[i];
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
    $(document).find('body').prepend('<div class="hdc-survey-modal open"><div><a href="#close" title="Close">&nbsp;</a><div class="hdc-survey-question"><h3>End Now</h3><div class="hdc-survey-question-description"></div><div class="hdc-survey-question-input"><div class="hdc-survey-input-options"><div class="hdc-survey-input-option"><input type="radio" data-choice="Yes" name="option-1" id="option-1-0"><label for="option-1-0"><span class="hdc-survey-input-option-dot"></span><span class="hdc-survey-input-option-text">Yes</span></label></div><div class="hdc-survey-input-option"><input type="radio" data-choice="No" name="option-1" id="option-1-1"><label for="option-1-1"><span class="hdc-survey-input-option-dot"></span><span class="hdc-survey-input-option-text">No</span></label></div></div></div><div class="hdc-survey-question-footer"><div class="hdc-survey-question-done" style="display: none;">Done</div><div class="hdc-survey-question-next" style="display: block;">Next</div><div class="hdc-survey-question-back" style="display: block;">Back</div></div></div></div></div>');

    $modal = $('.hdc-survey-modal');
    $q = $modal.find('.hdc-survey-question');
    $close = $modal.find('a[href="#close"]');
    $title = $q.find('h3');
    $description = $q.find('.hdc-survey-question-description');
    $input = $q.find('.hdc-survey-question-input');
    $done = $q.find('.hdc-survey-question-done');
    $next = $q.find('.hdc-survey-question-next');
    $back = $q.find('.hdc-survey-question-back');

    // attach event handlers for this survey instance
    $back.on('click', onBack);
    $next.on('click', onNext);
    $done.on('click', onDone);
    $close.on('click', closeModal);
  }

  function closeModal() {
    $modal.remove();

    $modal = undefined;
    $q = undefined;
    $close = undefined;
    $title = undefined;
    $description = undefined;
    $input = undefined;
    $done = undefined;
    $next = undefined;
    $back = undefined;
  }

  function resetModal() {
    $title.html('');
    $description.html('');
    $input.html('');

    $done.hide();
    $next.hide();
    $back.hide();
  }

  // on modal next
  function onNext() {
    var response = getResponse();

    if (validateResponse(response)) {
      previousQuestionId = currentQuestion.id;

      // save response
      responses[currentQuestion.id] = {
        response: response,
        dateTimeStamp: new Date().getTime()
      };

      // save current question's response
      card.state.save({
        responses: responses,
        previousQuestionId: previousQuestionId
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
  }

  // on modal back
  function onBack() {
    if (currentQuestionIndex > 0) {
      var previousQuestionIndex;

      previousQuestionId = previousQuestionId || locals.previousQuestionId;

      if (previousQuestionId && previousQuestionId !== currentQuestion.id) {
        previousQuestionIndex = getQuestionIndexById(previousQuestionId);
      }
      else {
        previousQuestionIndex = currentQuestionIndex - 1;
      }

      if (locals.questions[previousQuestionIndex]) {
        currentQuestionIndex = previousQuestionIndex;
        currentQuestion = locals.questions[previousQuestionIndex];
        previousQuestionId = currentQuestion.id;

        renderQuestion();
      }
    }
  }

  // on modal done
  function onDone() {
    endSurvey();
  }

  function getQuestionCount() {
    if (locals.questions && _lodash_survey.isArray(locals.questions)) {
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
        showBack = _lodash_survey.keys(responses).length > 0 && currentQuestionIndex > 0;

      resetModal();

      // populate question
      $title.html(currentQuestion.message);

      if (currentQuestion.replyType === 'end') {
        $done.show();

        if (showBack) {
          $back.show();
        }
      }
      else {
        switch (currentQuestion.replyType) {
          case 'text':
            inputHTML = '<input type="text">';
            break;

          case 'email':
            inputHTML = '<input type="email">';
            break;

          case 'website':
            inputHTML = '<input type="url" placeholder="http://">';
            break;

          case 'date':
            inputHTML = '<input type="date">';
            break;

          case 'multipleChoice':
            inputHTML = '<div class="hdc-survey-input-options">';

            if (_lodash_survey.isArray(currentQuestion.reply)) {
              for (var i = 0; i < currentQuestion.reply.length; i++) {
                var controlType = currentQuestion.multipleSelections ? 'checkbox' : 'radio';

                inputHTML +=
                  '<div class="hdc-survey-input-option">' +
                  '<input type="' + controlType + '" data-choice="' + currentQuestion.reply[i].choice + '" name="option-' + currentQuestionIndex + '" id="option-' + currentQuestionIndex + '-' + i + '">' +
                  '<label for="option-' + currentQuestionIndex + '-' + i + '">' +
                  '<span class="hdc-survey-input-option-dot"></span>' +
                  '<span class="hdc-survey-input-option-text">' + currentQuestion.reply[i].choice + '</span>' +
                  '</label>' +
                  '</div>';
              }
            }

            inputHTML += '</div>';

            break;

          case 'number':
            inputHTML = '<input type="number">';
            break;

          case 'rating':
            inputHTML = '<input type="number">';
            description = '(' + currentQuestion.reply.min + ' - ' + currentQuestion.reply.max + ')';
            break;

          case 'userField':
            inputHTML = '<input type="text">';
            value = getUserFieldValue(currentQuestion.reply.field);
            break;

          case 'userDetail':
            inputHTML = '<input type="text">';
            value = getUserDetailValue(currentQuestion.reply.detail);
            break;
        }

        // overwrite value with previous response if any
        if (locals.responses && locals.responses[currentQuestion.id]) {
          if (locals.responses[currentQuestion.id].response) {
            value = locals.responses[currentQuestion.id].response;
          }
        }

        // populate description, field, buttons / links and value
        $description.html(description);
        $input.html(inputHTML);

        // populate response, if any
        setResponse(value);

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
    switch (currentQuestion.replyType) {
      case 'text':
      case 'email':
      case 'website':
      case 'userField':
      case 'userDetail':
        return _lodash_survey.trim($input.find('input').val());

      case 'date':
        return $input.find('input').val().length > 0 ? new Date($input.find('input').val()) : '';

      case 'rating':
      case 'number':
        return _lodash_survey.toNumber($input.find('input').val()) || '';

      case 'multipleChoice':
        if (currentQuestion.multipleSelections) {
          var selections = [];

          $input.find('input[type=checkbox]:checked').each(function () {
            selections.push($(this).parent().find('.hdc-survey-input-option-text').text());
          });

          return selections.join(', ');
        }
        else {
          return $input.find('input[type=radio]:checked').parent().find('.hdc-survey-input-option-text').text();
        }
    }
  }

  function setResponse(response) {
    switch (currentQuestion.replyType) {
      case 'text':
      case 'email':
      case 'website':
      case 'number':
      case 'rating':
      case 'userField':
      case 'userDetail':
        $input.find('input').val(_lodash_survey.trim(response || ''));
        break;

      case 'date':
        var $el = $input.find('input');

        if ($el.length === 1) {
          $el[0].valueAsDate = new Date(response);
        }
        break;

      case 'multipleChoice':
        if (currentQuestion.multipleSelections) {
          var selections = response.split(', ');

          for (j = 0; j < selections.length; j++) {
            $input.find('.hdc-survey-input-options input[data-choice="' + selections[j] + '"]').prop('checked', true);
          }
        }
        else {
          $input.find('.hdc-survey-input-options input[data-choice="' + response + '"]').prop('checked', true);
        }
        break;
    }
  }

  function validateResponse(response) {
    var $response,
      clearEvent = 'keypress',
      valid = true;

    // validate response
    switch (currentQuestion.replyType) {
      case 'multipleChoice':
        $response = $input.find('.hdc-survey-input-options');
        clearEvent = 'change';

        if (_lodash_survey.isArray(currentQuestion.reply)) {
          var validOption = false;

          for (var i = 0; i < currentQuestion.reply.length; i++) {
            if (currentQuestion.multipleSelections) {
              var selections = response.split(', ');

              for (j = 0; j < selections.length; j++) {
                if (currentQuestion.reply[i].choice === selections[j]) {
                  validOption = true;
                  break;
                }
              }

              if (validOption) {
                break;
              }
            }
            else {
              if (currentQuestion.reply[i].choice === response) {
                validOption = true;
                break;
              }
            }
          }

          if (currentQuestion.required && !validOption) {
            valid = false;
          }
        }
        break;

      case 'text':
      case 'userField':
      case 'userDetail':
        $response = $input.find('input');
        clearEvent = 'keypress';

        if (currentQuestion.required && response.length === 0) {
          valid = false;
        }
        break;

      case 'email':
        $response = $input.find('input');
        clearEvent = 'keypress';

        if (currentQuestion.required) {
          if (response.length === 0) {
            valid = false;
          }

          if (!isEmail(response)) {
            valid = false;
          }
        }
        else {
          if (response) {
            if (!isEmail(response)) {
              valid = false;
            }
          }
        }
        break;

      case 'website':
        $response = $input.find('input');
        clearEvent = 'keypress';

        if (currentQuestion.required) {
          if (response.length === 0) {
            valid = false;
          }

          if (!isURL(response)) {
            valid = false;
          }
        }
        else {
          if (response) {
            if (!isURL(response)) {
              valid = false;
            }
          }
        }
        break;

      case 'date':
        $response = $input.find('input');
        clearEvent = 'keypress';

        if (currentQuestion.required) {
          if (!_lodash_survey.isDate(response)) {
            valid = false;
          }
        }
        else {
          if (response) {
            if (!_lodash_survey.isDate(response)) {
              valid = false;
            }
          }
        }
        break;

      case 'number':
        $response = $input.find('input');
        clearEvent = 'keypress';

        if (currentQuestion.required) {
          if (response.length === 0) {
            valid = false;
          }

          if (!_lodash_survey.isNumber(response)) {
            valid = false;
          }
        }
        else {
          if (response) {
            if (!_lodash_survey.isNumber(response)) {
              valid = false;
            }
          }
        }
        break;

      case 'rating':
        $response = $input.find('input');
        clearEvent = 'keypress';

        if (currentQuestion.required) {
          if (!_lodash_survey.inRange(response, currentQuestion.reply.min, currentQuestion.reply.max + 1)) {
            valid = false;
          }
        }
        else {
          if (response) {
            if (!_lodash_survey.inRange(response, currentQuestion.reply.min, currentQuestion.reply.max + 1)) {
              valid = false;
            }
          }
        }
        break;
    }

    if (!valid) {
      $response.addClass('invalid');

      function onClear() {
        $response.removeClass('invalid');
        $response.off(clearEvent, onClear);
      }

      $response.on(clearEvent, onClear);
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
    // remove events
    $card.find('.hdc-survey-footer').removeClass('active').html('Completed').off('click');

    // flag as complete
    card.state.save({
      complete: true,
      completeDateTimeStamp: new Date().getTime()
    });

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

      if (_lodash_survey.isArray(user.details)) {
        for (var i = 0; i < user.details.length; i++) {
          if (user.details[i].label === detail) {
            return user.details[i].value;
          }
        }
      }
    }
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
    var atSym = str.lastIndexOf('@');

    // no local-part
    if (atSym < 1) {
      return false;
    }

    // no domain
    if (atSym == str.length - 1) {
      return false;
    }

    // there may only be 64 octets in the local-part
    if (atSym > 64) {
      return false;
    }

    // there may only be 255 octets in the domain
    if (str.length - atSym > 255) {
      return false;
    }

    // Is the domain plausible?
    var lastDot = str.lastIndexOf('.');

    // Check if it is a dot-atom such as example.com
    if (lastDot > atSym + 1 && lastDot < str.length - 1) {
      return true;
    }

    //  Check if could be a domain-literal.
    if (str.charAt(atSym + 1) == '[' && str.charAt(str.length - 1) == ']') {
      return true;
    }

    return false;
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
  };

  function isFQDN(str, options) {
    options = _lodash_survey.merge(options, default_fqdn_options);

    /* Remove the optional trailing dot before checking validity */
    if (options.allow_trailing_dot && str[str.length - 1] === '.') {
      str = str.substring(0, str.length - 1);
    }

    var parts = str.split('.');

    if (options.require_tld) {
      var tld = parts.pop();

      if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
        return false;
      }
    }

    for (var part, i = 0; i < parts.length; i++) {
      part = parts[i];

      if (options.allow_underscores) {
        if (part.indexOf('__') >= 0) {
          return false;
        }

        part = part.replace(/_/g, '');
      }

      if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
        return false;
      }

      if (/[\uff01-\uff5e]/.test(part)) {
        // disallow full-width chars
        return false;
      }

      if (part[0] === '-' || part[part.length - 1] === '-') {
        return false;
      }

      if (part.indexOf('---') >= 0 && part.slice(0, 4) !== 'xn--') {
        return false;
      }
    }

    return true;
  }

  var ipv4Maybe = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
    ipv6Block = /^[0-9A-F]{1,4}$/i;

  function isIP(str, version) {
    version = version ? version + '' : '';

    if (!version) {
      return isIP(str, 4) || isIP(str, 6);
    }
    else if (version === '4') {
      if (!ipv4Maybe.test(str)) {
        return false;
      }

      var parts = str.split('.').sort(function (a, b) {
        return a - b;
      });

      return parts[3] <= 255;
    }
    else if (version === '6') {
      var blocks = str.split(':');
      var foundOmissionBlock = false; // marker to indicate ::

      // At least some OS accept the last 32 bits of an IPv6 address
      // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
      // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
      // and '::a.b.c.d' is deprecated, but also valid.
      var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
      var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

      if (blocks.length > expectedNumberOfBlocks)
        return false;

      // initial or final ::
      if (str === '::') {
        return true;
      }
      else if (str.substr(0, 2) === '::') {
        blocks.shift();
        blocks.shift();

        foundOmissionBlock = true;
      }
      else if (str.substr(str.length - 2) === '::') {
        blocks.pop();
        blocks.pop();

        foundOmissionBlock = true;
      }

      for (var i = 0; i < blocks.length; ++i) {
        // test for a :: which can not be at the string start/end
        // since those cases have been handled above
        if (blocks[i] === '' && i > 0 && i < blocks.length -1) {
          if (foundOmissionBlock)
            return false; // multiple :: in address

          foundOmissionBlock = true;
        }
        else if (foundIPv4TransitionBlock && i == blocks.length - 1) {
          // it has been checked before that the last
          // block is a valid IPv4 address
        }
        else if (!ipv6Block.test(blocks[i])) {
          return false;
        }
      }

      if (foundOmissionBlock) {
        return blocks.length >= 1;
      }
      else {
        return blocks.length === expectedNumberOfBlocks;
      }
    }

    return false;
  }

  var default_url_options = {
    protocols: ['http', 'https'],
    require_tld: true,
    require_protocol: false,
    require_valid_protocol: true,
    allow_underscores: false,
    allow_trailing_dot: false,
    allow_protocol_relative_urls: false
  };

  function isURL(url, options) {
    if(!url || url.length >= 2083 || /\s/.test(url)) {
      return false;
    }

    if (url.indexOf('mailto:') === 0) {
      return false;
    }

    options = _lodash_survey.merge(options, default_url_options);

    var protocol, auth, host, hostname, port, port_str, split;

    split = url.split('://');

    if (split.length > 1) {
      protocol = split.shift();

      if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
        return false;
      }
    }
    else if (options.require_protocol) {
      return false;
    }
    else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
      split[0] = url.substr(2);
    }

    url = split.join('://');
    split = url.split('#');
    url = split.shift();

    split = url.split('?');
    url = split.shift();

    split = url.split('/');
    url = split.shift();
    split = url.split('@');

    if (split.length > 1) {
      auth = split.shift();

      if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
        return false;
      }
    }

    hostname = split.join('@');
    split = hostname.split(':');
    host = split.shift();

    if (split.length) {
      port_str = split.join(':');
      port = parseInt(port_str, 10);

      if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
        return false;
      }
    }

    if (!isIP(host) && !isFQDN(host, options) && host !== 'localhost') {
      return false;
    }

    if (options.host_whitelist && options.host_whitelist.indexOf(host) === -1) {
      return false;
    }

    if (options.host_blacklist && options.host_blacklist.indexOf(host) !== -1) {
      return false;
    }

    return true;
  }
};