/* global $, card, locals */
card.onReady = function () {
  var $card = $('#' + locals.card.id);
  var question = $card.find('.hdc-title').text()

  card.state.onChange = function (val) {
    if (val.cardId !== locals.card.id) {
      setResponse(val.response);
    }
  };

  function handler () {
    var response = $(this).hasClass('yes') ? 101 : 100;

    card.proxy.post('https://xandgo.com/api/request/rate', {rating: response}, function (err, resp) {
      if (resp && resp.success) {
        setResponse(response);

        card.state.save({
          response: response
        });
      }
      else {
        $card.find('.hdc-title').addClass('error').text('Error. Please try again in a moment.');
        
        setTimeout(function () {
          $card.find('.hdc-title').removeClass('error').text(question);
        }, 2000);
      }
    });
  }

  $card.find('.cell').on('click', handler);
  $card.find('.cell').on('tap', handler);

  function setResponse (response) {
    var selected = (response === 101) ? 'yes' : 'no'
    var unselected = (response === 101) ? 'no' : 'yes'

    $card.find('.hdc-title').text('Thank you.');
    $card.find('.' + selected).addClass('done hdc-animated hdc-pulse');

    setTimeout(function () {
      $card.find('.hdc-title').text(question);
      $card.find('.' + unselected).hide();
    }, 3000);
  }
};
