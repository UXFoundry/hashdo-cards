/* global $, card, locals */

card.onReady = function () {
  var $card = $('#' + locals.card.id);

  card.state.onChange = function (val) {
    if (val) {
      $card.find('p.instruction').html('Paid!');
      $card.find('.snapscan-footer').html('Thank You');
      $card.parent().removeAttr('href');
    }
  };
};

