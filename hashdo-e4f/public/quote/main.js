/* global card, locals, $ */

card.onReady = function () {
  var $modal, $close,
    $card = $('#' + locals.card.id);

  // first quote loaded into document?
  if (typeof _e4f_quote === 'undefined') {

    // load css dependencies
    card.requireCSS('https://cdn.hashdo.com/css/quote.v11.css');

    // load js dependencies
    card.require('https://cdn.hashdo.com/js/survey.v3.js', function () {
      // start or continue
      attachStartOrContinueHandler();

      // subscribe to any state changes
      subscribeToStateChanges();
    });
  }

  function openModal() {
    $(document).find('body').prepend('<div class="hdc-e4f-quote-modal open"><div><a href="#close" title="Close">&nbsp;</a><div class="hdc-e4f-quote"><div class="hdc-e4f-quote-title"></div></div><div class="hdc-survey-question-footer"><div class="hdc-survey-question-done" style="display: none;">Done</div><div class="hdc-survey-question-next" style="display: block;">Next</div><div class="hdc-survey-question-back" style="display: block;">Back</div></div></div></div></div>');

    $modal = $('.hdc-e4f-quote-modal');
  }

  function closeModal() {
    if ($modal) {
      $modal.remove();
    }

    $modal = $close = undefined;
  }
};