/* global card */

card.onReady = function () {
  var $card = $('#' + locals.card.id),
    $modal = $card.find('.survey-modal');

  $card.find('.survey-footer').click(function () {
    // start or continue survey
    (locals.responseCount === 0 ? startSurvey : continueSurvey).call();

    // open modal
    $modal.addClass('open');
  });

  $modal.find('a[href="#close"]').click(function () {
    $modal.removeClass('open');
  });

  function startSurvey() {

  }

  function continueSurvey() {

  }
};

