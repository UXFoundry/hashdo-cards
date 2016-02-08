/* global card, locals, $, Fingerprint2 */

card.onReady = function () {
  var $card = $('#' + locals.card.id),
    isActive = true,
    now = new Date(),
    renderUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()).valueOf();

  // previously voted?
  if (localStorage) {
    var previousIndex = localStorage.getItem('hashdo-poll-' + locals.id);

    if (previousIndex) {
      renderResults(previousIndex, true);
    }
  }

  // expired?
  if (locals.expired) {
    renderResults(null, true);
  }

  // subscribe to any state changes
  card.state.onChange = function (val) {
    if (!isActive) {
      if (val.cardId !== locals.card.id) {
        updateResults(val.votes);
      }
    }
  };

  // on vote
  $card.find('.vote').on('click', function () {
    var selectedIndex = $card.find('input[type=radio]:checked').parent().attr('data-index');

    // ensure we have a selection
    if (typeof selectedIndex !== 'undefined') {
      var voteNow = new Date(),
        voteUTC = new Date(voteNow.getUTCFullYear(), voteNow.getUTCMonth(), voteNow.getUTCDate(), voteNow.getUTCHours(), voteNow.getUTCMinutes(), voteNow.getUTCSeconds(), voteNow.getUTCMilliseconds()).valueOf();

      // vote
      locals.votes = locals.votes || [];
      locals.votes.push({
        dateTimeStamp: voteUTC,
        vote: selectedIndex
      });

      // render results
      renderResults(selectedIndex);

      // finally save state
      card.state.save({votes: locals.votes});

      // prevent abuse
      if (localStorage) {
        localStorage.setItem('hashdo-poll-' + locals.id, selectedIndex);
      }
    }
  });

  function renderResults(selectedIndex, isOld) {
    isActive = false;
    $card.find('.hdc-footer').find('.vote').remove();

    // add this vote
    if (selectedIndex && locals.voteCounts[selectedIndex]) {
      if (!isOld) {
        locals.totalVotes++;
        locals.voteCounts[selectedIndex].count++;

        // recalculate percentages
        for (var i = 0; i < locals.voteCounts.length; i++) {
          locals.voteCounts[i].percentage = Math.floor((locals.voteCounts[i].count / locals.totalVotes) * 100);
        }
      }

      $card.find('.poll-vote-count').text(locals.totalVotes + (locals.totalVotes === 1 ? ' Vote' : ' Votes'));
    }

    $card.find('.poll-option').each(function () {
      var $option = $(this),
        index = $option.attr('data-index'),
        option = $option.text();

      $option.addClass('result');
      $option.find('label').removeAttr('for');

      if (index === selectedIndex) {
        $option.addClass('selected');

        if (isOld) {
          $option.find('input').prop('checked', true);
        }
      }

      $option.find('.poll-option-percentage').text(locals.voteCounts[index].percentage + '%');
      $option.find('.poll-option-bar').width(((locals.voteCounts[index].percentage / 100) * 130) + 'px');
    });
  }

  function updateResults(votes) {
    if (votes) {
      for (var i = 0; i < votes.length; i++) {
        if (votes[i].dateTimeStamp && votes[i].dateTimeStamp > renderUTC) {
          renderResults(votes[i].vote);
        }
      }
    }
  }
};