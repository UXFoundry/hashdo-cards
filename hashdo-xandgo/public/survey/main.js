/* global card */

card.onReady = function () {
  var $card = $('#' + locals.card.id),
    $modal = $card.find('.survey-modal'),
    $q = $modal.find('.survey-question'),
    $title = $q.find('h3'),
    $input = $q.find('.survey-question-input'),
    $next = $q.find('.survey-question-next'),
    $back = $q.find('.survey-question-back'),
    currentIndex = 0;

  $card.find('.survey-footer').click(function () {
    // start or continue survey
    (locals.responseCount === 0 ? startSurvey : continueSurvey).call();
  });

  $next.click(function () {
    currentIndex++;
    renderQuestion();
  });

  $back.click(function () {
    currentIndex--;
    renderQuestion();
  });

  $modal.find('a[href="#close"]').click(function () {
    $modal.removeClass('open');
  });

  function startSurvey() {
    currentIndex = 0;
    renderQuestion();

    // open modal
    $modal.addClass('open');
  }

  function continueSurvey() {

  }

  function renderQuestion() {
    if (locals.questions && locals.questions[currentIndex]) {
      var question = locals.questions[currentIndex];

      $title.html(question.message);

      switch (question.replyType) {
        case 'userField':
          $input.html('<input type="text">').find('input').focus();
          break;
      }

      $next.hide();
      $back.hide();

      if ((currentIndex + 1) < locals.questions.length) {
        $next.show();
      }

      if (currentIndex > 0) {
        $back.show();
      }
    }
  }
};

