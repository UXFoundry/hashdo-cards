card.onReady = function () {
  var $card = $('#' + locals.card.id);

  // subscribe to any state changes.
  card.state.onChange = function (val) {
    if (val.cardId !== locals.card.id) {
      val.checked = val.checked || {};

      $card.find('input').each(function () {
        var $this = $(this);

        $this.prop('checked', val.checked['item-' + $this.attr('data-index')]);

        if ($this.prop('checked') == true) {
          $this.parents('li').first().addClass('checked');
        }
        else {
          $this.parents('li').first().removeClass('checked');
        }
      });
    }
  };

  // on item check
  $card.find('input').on('change', function () {
    var checked = {};

    var now = new Date(),
      utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()).valueOf();

    $card.find('input').each(function () {
      var $this = $(this);

      if ($this.prop('checked') == true) {
        checked['item-' + $this.attr('data-index')] = {dateTimeStamp: utc};
        $this.parents('li').first().addClass('checked');
      }
      else {
        checked['item-' + $this.attr('data-index')] = null;
        $this.parents('li').first().removeClass('checked');
      }
    });

    card.state.save({
        checked: checked
      },
      function (err) {
        // ignore
      }
    );
  });
};
