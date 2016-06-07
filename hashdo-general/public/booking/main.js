/* global card, locals, $ */

card.onReady = function () {
  var $card = $('#' + locals.card.id),
      $shiftMonths = $card.find('.shifting-select.months'),
      $shiftDays = $card.find('.shifting-select.days'),
      $shiftHours = $card.find('.shifting-select.hours'),
      selectedHour = false,
      selectedDay = false,
      selectedMonth = false,
      selectedYear = false,

  containM = function (m, m_min) {
    if (m > 0) m = 0;
    else if (m < m_min) m = m_min;
    return m;
  },

  setUpHammer = function ($shiftModule, handleClick) {
    var ht = new Hammer($shiftModule[0]),
        $inner = $shiftModule.find('.inner'),
        m_current = 0,                              // current active margin-left
        m_last = 0,                                 // last recorded margin-left
        m_min = $card.width() - $inner.width();     // minimum possible margin-left

    $inner.css('margin-left', 0);                   // reset to default

    ht.on('pan', function (ev) {
      m_current = containM(m_last + ev.deltaX, m_min);
      $inner.css('margin-left', m_current);

      ev.srcEvent.stopPropagation();
    });

    ht.on('panend', function (ev) {
      var v = -ev.velocityX * -m_min / 3;
      m_last = m_current;
      m_current = containM(m_current + v, m_min);

      ev.srcEvent.stopPropagation();
    });

    $inner.find('a').on('click', function(ev) {
      ev.preventDefault();
      $inner.find('a.selected').removeClass('selected');
      var elem = $(this);
      elem.addClass('selected');
      handleClick && handleClick(elem);
    });
  },

  monthClick = function(elem) {
    var data = elem.attr('data-index').split('-');
    selectedMonth = data[1];
    selectedYear = data[2];

    updateDays(data[0]);  // re-render days
    updateBookingAction();
  },

  dayClick = function(elem) {
    selectedDay = elem.text();
    updateBookingAction();
  },

  hourClick = function(elem) {
    selectedHour = elem.text();
    updateBookingAction();
  },

  updateDays = function(days) {
    selectedDay = false;  // reset selected day

    for (var i = 1, html = ''; i <= days; i++) {
      html += '<a href="#">' + i + '</a>';
    }

    $shiftDays.addClass("changed").find('.inner').html(html);  // add/remove class in delayed fashion

    setTimeout(function() {
      $shiftDays.removeClass("changed");
    }, 1000);

    setUpHammer($shiftDays, dayClick);   // update hammer with new days
  },

  updateBookingAction = function() {
    var bookingActionElem = $card.find('.make-booking');
    if (selectedHour && selectedDay && selectedMonth && selectedYear) { // enable action if all values are selected
      bookingActionElem.removeClass('disabled').on('click', function(ev) {
        console.log('BOOKING ACTION CLICKED');
      });
    } else {
      bookingActionElem.addClass('disabled').off('click');
    }
  };

  if (typeof Hammer === 'undefined') {
    var disabledAmd = false;

    if (typeof define == 'function' && define.amd) {
      disabledAmd = true;
      define.amd = false;
    }

    card.require('https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.4/hammer.min.js', function () {
      if (disabledAmd) {
        define.amd = true;
      }

      setUpHammer($shiftMonths, monthClick);
      setUpHammer($shiftDays, dayClick);
      setUpHammer($shiftHours, hourClick);
    });
  }
  else {
    setUpHammer($shiftMonths, monthClick);
    setUpHammer($shiftDays, dayClick);
    setUpHammer($shiftHours, hourClick);
  }
};
