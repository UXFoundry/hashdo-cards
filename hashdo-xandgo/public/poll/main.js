/* global card, locals, $, Fingerprint2 */

card.onReady = function () {
  var fp,
    $card = $('#' + locals.card.id);

  // require dependencies
  if (typeof Fingerprint2 === 'undefined' || typeof Fingerprint2 === 'undefined') {
    card.require('//cdn.jsdelivr.net/fingerprintjs2/0.8.0/fingerprint2.min.js', function () {
      new Fingerprint2().get(function (result) {
        fp = result;
      });
    });
  }

  // subscribe to any state changes
  card.state.onChange = function (val) {
    if (val.cardId !== locals.card.id) {
      updateResults(val.votes);
    }
  };

  // on vote
  $card.find('.vote').on('click', function () {
    var selectedIndex = $card.find('input[type=radio]:checked').parent().attr('data-index');

    // ensure we have a selection and a fingerprint has been generated.
    if (typeof selectedIndex !== 'undefined' && typeof fp !== 'undefined') {
      var now = new Date(),
        utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()).valueOf();

      // vote
      locals.votes = locals.votes || [];
      locals.votes.push({
        dateTimeStamp: utc,
        vote: selectedIndex,
        fp: fp
      });

      // render results
      renderResults(selectedIndex);

      // finally save state
      card.state.save(
        {
          votes: locals.votes
        },
        function () {
          // done
        }
      );
    }
  });

  function renderResults(selectedIndex) {
    $card.find('.hdc-footer').find('.vote').remove();

    // add this vote
    if (locals.voteCounts[selectedIndex]) {
      locals.voteCounts[selectedIndex].count++;
    }

    // recalculate percentages
    for (var i = 0; i < locals.voteCounts.length; i++) {
      locals.voteCounts[i].percentage = Math.floor((locals.voteCounts[i].count / (locals.totalVotes + 1)) * 100);
    }

    $card.find('.poll-option').each(function () {
      var $option = $(this),
        index = $option.attr('data-index'),
        option = $option.text();

      $option.addClass('result');

      if (index === selectedIndex) {
        $option.addClass('selected');
      }

      $option.find('.poll-option-percentage').text(locals.voteCounts[index].percentage + '%');
      $option.find('.poll-option-bar').width(((locals.voteCounts[index].percentage / 100) * 130) + 'px');
    });
  }

  function updateResults() {

  }
};