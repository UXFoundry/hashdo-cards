card.onReady = function () {
  var $card = $('#' + locals.card.id);

  var desc = $('#zapper-description').text();

  card.state.onChange = function () {
    $('#zapper-description').text('Payment successful');
    $('#zapper-footer').text('Thank You');
    $card.parent().removeAttr('href');
    $card.off('click');
  };

  $card.on('click', function () {
    $('#zapper-description').text('Waiting for payment to be completed...');

    function saveState(response) {
      card.state.save({
        status: 'complete',
        response: response
      },
      function (err) {
        if (err) {
          console.error(err);
          $('#zapper-description').text('Payment failed');

          setTimeout(function () {
            $('#zapper-description').text(desc);
          }, 3000);
        }
      });
    }

    function poll() {
      setTimeout(function () {
        $.ajax({
          url: locals.posApiUrl,
          dataType: 'json',
          method: 'GET',
          headers: locals.posApiHeaders,
          success: function (response) {
            // Validate the data here and continue to poll or save the state.
            if (!response.data || response.data.length === 0) {
              poll();
            }
            else {
              // TODO: Check payment data to validate it wasn't tampered with.             
              saveState(response);
            }
          }
        });
      }, 5000);
    }
    
    // Start polling on click.
    poll();
  });
};
