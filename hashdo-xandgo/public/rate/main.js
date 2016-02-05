/* global $, card, locals */
card.onReady = function () {
  var $card = $('#' + locals.card.id);

  card.state.onChange = function (val) {
    if (val.cardId !== locals.card.id) {
      setRating(val.rating);
    }
  };

  $card.find('fieldset').find('input.star').on('change', function () {
    var rating = Number($(this).val()),
      title = $card.find('.hdc-title').text();

    card.proxy.post('http://xandgo.com/api/request/rate', {rating: rating}, function (err, response) {
      if (response && response.success) {
        setRating(rating);

        card.state.save({
          rating: rating
        });
      }
      else {
        $card.find('.hdc-title').addClass('error').text('Error. Please try again in a moment.');
        $card.find('input.star').prop('checked', false);

        setTimeout(function () {
          $card.find('.hdc-title').removeClass('error').text(title);
        }, 2000);
      }
    });
  });

  function setRating(rating) {
    $card.find('#star' + rating + '-' + locals.card.id).prop('checked', true);

    $card.find('.hdc-title').text('Thank you.');
    $card.find('fieldset').addClass('readonly hdc-animated hdc-pulse');
    $card.find('input.star').attr('disabled', 'disabled');

    setTimeout(function () {
      $card.find('.hdc-hdr').remove();
    }, 3000);
  }
};

