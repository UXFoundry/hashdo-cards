/* global $, card, locals */

card.onReady = function () {
  var $card = $('#' + locals.card.id);

  // subscribe to any state changes
  card.state.onChange = function (val) {
    if (val) {
      if (val.cardId !== locals.card.id) {
        $card.find('.hdc-footer').remove();

        $card.find('input[type=checkbox]').each(function () {
          var $this = $(this),
            userId = $this.attr('data-id');

          $this
            .attr('disabled', true)
            .prop('checked', isChecked(val.users, userId));
        });
      }
    }
  };

  // on done
  $card.find('.done').on('click', function () {
    $card.find('.hdc-footer').remove();

    // update state
    $card.find('input[type=checkbox]').each(function () {
      var $this = $(this),
        userId = $this.attr('data-id');

      updateUser(userId, $this.prop('checked'));
      $this.attr('disabled', true);
    });

    // save state
    card.state.save({
      active: false,
      users: locals.users,
      asString: asString()
    },
      function () {
        recordAnalytics();
      }
    );
  });

  function isChecked(users, userId) {
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === userId) {
        return users[i].status;
      }
    }

    return false;
  }

  function updateUser(userId, checked) {
    for (var i = 0; i < locals.users.length; i++) {
      if (locals.users[i].id === userId) {
        locals.users[i].status = checked;
        break;
      }
    }
  }

  function asString() {
    var arrString = [],
      present = [],
      absent = [];

    for (var i = 0; i < locals.users.length; i++) {
      var user = locals.users[i];

      if (user.status) {
        present.push(user.name);
      }
      else {
        absent.push(user.name);
      }
    }

    if (present.length > 0) {
      arrString.push('Present: ' + present.join(', '));
    }

    if (absent.length > 0) {
      arrString.push('Absent: ' + absent.join(', '));
    }

    return arrString.join('; ');
  }

  function recordAnalytics() {
    var events = [];

    for (var i = 0; i < locals.users.length; i++) {
      var user = locals.users[i];

      user.appId = locals.appId;

      if (user.status) {
        user.status = 'Present';
        events.push({key: 'present', data: user});
      }
      else {
        user.status = 'Absent';
        events.push({key: 'absent', data: user});
      }
    }

    if (events.length > 0) {
      card.analytics.record(events);
    }
  }
};

