/* global $, card, locals */

card.onReady = function () {
  var $card = $('#' + locals.card.id),
    $entries = $card.find('.entries'),
    $product = $card.find('select.product'),
    $physical = $card.find('select.physical'),
    $required = $card.find('select.required'),
    entries = [];

  var countOptions = '';
  for (var i = 0; i < 100; i++) {
    countOptions += '<option value="' + i + '">' + i + '</option>';
  }

  $physical.html(countOptions);
  $required.html(countOptions);

  // subscribe to any state changes
  card.state.onChange = function (val) {
    if (val) {
      if (val.cardId !== locals.card.id) {
        $card.find('.hdc-footer').remove();
        $card.find('.form').remove();

        entries = val.entries;
        clearForm();
        renderEntries();
      }
    }
  };

  // on add
  $card.find('.add').on('click', function () {
    entries.push({
      product: $product.val(),
      physical: parseInt(parseCount($physical), 10),
      required: parseInt(parseCount($required), 10)
    });

    clearForm();
    renderEntries();
  });

  function parseCount($el) {
    var value = parseInt($el.val(), 10);
    return isNaN(value) ? 0 : value;
  }

  // on clear
  $card.find('.clear').on('click', function () {
    entries = [];

    clearForm();
    renderEntries();
  });

  function clearForm() {
    $product.val('');
    $physical.val('');
    $required.val('');
  }

  function renderEntries() {
    if (entries.length > 0) {
      var html = '<ul>';

      for (var i = 0; i < entries.length; i++) {
        html += '<li>' +
          '<div class="counts">' +
          '<span class="physical">' + entries[i].physical + '</span>' +
          '<span class="required">' + entries[i].required + '</span>' +
          '</div>' +
          '<div class="name">' + entries[i].product + '</div>' +
          '</li>';
      }

      html += '</ul>';
      $entries.html(html);
    }
    else {
      $entries.html('<p class="empty">No Entries...</p>');
    }
  }

  function asString() {
    var arrString = [];

    for (var i = 0; i < entries.length; i++) {
      arrString.push(entries[i].product + '|P: ' + entries[i].physical + '|R: ' + entries[i].required);
    }

    return arrString.join('; ');
  }

  // on done
  $card.find('.done').on('click', function () {
    $card.find('.hdc-footer').remove();
    $card.find('.form').remove();

    // save state
    card.state.save({
      active: false,
      entries: entries,
      asString: asString()
    });
  });
};

