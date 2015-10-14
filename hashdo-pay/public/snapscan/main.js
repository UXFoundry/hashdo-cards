/* global $, card, locals */

card.onReady = function () {
  var $card = $('#' + locals.card.id);

  card.state.onChange = function (val) {
    if (val) {
      $card.find('p.instruction').text('Paid!');
      $card.find('.snapscan-footer').text('Thank You');
      $card.parent().removeAttr('href');
    }
  };
};

