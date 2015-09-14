/* global $, card, locals */

card.onReady = function () {
  var $card = $('#' + locals.card.id),
    $entries = $card.find('.entries'),
    $product = $card.find('select.product'),
    $space = $card.find('select.space'),
    entries = [];

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
      space: $space.val()
    });

    clearForm();
    renderEntries();
  });

  // on clear
  $card.find('.clear').on('click', function () {
    entries = [];

    clearForm();
    renderEntries();
  });

  function clearForm() {
    $product.val('');
    $space.val('');
  }

  function renderEntries() {
    if (entries.length > 0) {
      var html = '<ul>';

      for (var i = 0; i < entries.length; i++) {
        html += '<li>' +
          '<div class="space">' + entries[i].space + '</div>' +
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
      arrString.push(entries[i].product + ' - ' + entries[i].space);
    }

    return arrString.join('; ');
  }

  function recordAnalytics() {
    var events = [];

    for (var i = 0; i < entries.length; i++) {
      events.push({key: 'promotion', data: {
        appId: locals.appId,
        user: locals.user,
        product: entries[i].product,
        space: entries[i].space
      }});
    }

    if (events.length > 0) {
      card.analytics.record(events);
    }
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
    },
      function () {
        recordAnalytics();
      }
    );
  });
};

