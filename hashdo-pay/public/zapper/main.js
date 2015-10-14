card.onReady = function () {
  var $card = $('#' + locals.card.id);
  
  card.state.onChange = function () {
    $('#zapper-description').text('Payment successful');
    $('#zapper-footer').text('Thank You');
    $card.parent().removeAttr('href');
    $card.off('click');
  };
  
  $card.on('click', function () {
    $('#zapper-description').text('Waiting for payment to be completed...');
    
    var saveState = function () {
      card.state.save({
        status: 'complete'
      },
      function (err) {
        if (err) {
          console.error(err);
          $('#zapper-description').text('Payment failed');
          
          setTimeout(function () {
            $('#zapper-description').text(locals.description);
          }, 3000);
        }
      });
    };
    
    var poll = function () {
      setTimeout(function () {
        $.ajax({ 
          url: 'http://qa.pointofsale.zapzapadmin.com/api/v2/merchants/' + locals.merchantId + '/sites/' + locals.siteId + '/payments?PosReference=' + locals.reference,
          method: 'GET',
          headers: {
            siteid: locals.siteId,
            poskey: locals.posKey,
            possecret: locals.posSecret,
            signature: locals.signature
          },
          complete: function (data) {
            console.log(data);
            
            // TODO: Validate the data here and continue to poll or save the state.
            if (!data) {
              poll();
            }
            else {
              saveState();
            }
          }
        });
      }, 3000);
    };
    
    // Start polling on click.
    poll();
  });
};
