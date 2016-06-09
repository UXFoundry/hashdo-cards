/* global card, locals, $ */

card.onReady = function () {
  var $card = $('#' + locals.card.id),
      $hdcInner = $card.find('.hdc-inner'),
      $shiftMonths = $hdcInner.find('.shifting-select.months'),
      $shiftDays = $hdcInner.find('.shifting-select.days'),
      $shiftHours = $hdcInner.find('.shifting-select.hours'),
      $bookingSummary = $card.find('.booking-summary'),
      now = new Date(),
      curMonth = now.getMonth(),
      curDay = now.getDate(),
      selectedHour = false,
      selectedDay = false,
      selectedMonth = false,
      selectedMonthIndex = false,
      selectedYear = false,

  containM = function (m, m_min) {
    if (m > 0) m = 0;
    else if (m < m_min) m = m_min;
    return m;
  },

  setUpHammer = function ($shiftModule, handleClick) {
    var ht = new Hammer($shiftModule[0]),
        $inner = $shiftModule.find('.inner'),
        m_current = 0,                                  // current active margin-left
        m_last = 0,                                     // last recorded margin-left
        m_min = $card.width() - $inner.width() - 4;     // minimum possible margin-left (4 is border width)

    $inner.css('margin-left', 0);                       // reset to default

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
    var data = elem.attr('data-date').split('-');
    selectedMonth = data[1];
    selectedMonthIndex = parseInt(elem.attr('data-index'), 10);  // to easily compare months when rendering days
    selectedYear = data[2];

    updateDays(data[0]);  // re-render days
    updateBookingAction();
  },

  dayClick = function(elem) {
    selectedDay = parseInt(elem.text(), 10);
    updateHours();
    updateBookingAction();
  },

  hourClick = function(elem) {
    selectedHour = elem.text();
    updateBookingAction();
  },

  updateDays = function(days) {
    selectedDay = false;  // reset selected day

    var i = curMonth === selectedMonthIndex ? curDay : 1,  // if its current month, days start from todays day
        html = '';

    for (; i <= days; i++) {
      html += '<a href="#">' + i + '</a>';
    }

    updateShifing($shiftDays, html, dayClick);
  },

  updateHours = function() {
    selectedHour = false;  // reset selected day

    var hours = locals.hours,
        html = '';

    if (curMonth === selectedMonthIndex && curDay === selectedDay) { // if selected day is today then check time
      var bookingHours = now.getHours() + 2,            // add 2 more hours, no point in booking thats right now
          indexOfHour = locals.hours.indexOf(bookingHours + ':00');

      if (indexOfHour !== -1) {
        hours = hours.slice(indexOfHour);  // cut of unavailable hours
      } else {
        html = 'No available hours!';                  // no hours available

        return $shiftHours.find('.inner').html('<span class="unavailable">' + html + '</span>');
      }
    }

    hours.forEach(function(hour, i) {
      html += '<a href="#">' + hour + '</a>';
    });

    updateShifing($shiftHours, html, hourClick);
  },

  updateShifing = function($shiftingModule, html, handleClick) {
    $shiftingModule.addClass("changed").find('.inner').html(html);  // add/remove class in delayed fashion

    setTimeout(function() {
      $shiftingModule.removeClass("changed");
    }, 1000);

    setUpHammer($shiftingModule, handleClick);   // update hammer
  },

  flip = function(side) {
    $hdcInner.addClass("scale");  // add/remove class in delayed fashion

    setTimeout(function() {
      side === 'back' ? $hdcInner.addClass("flip") : $hdcInner.removeClass("flip");
    }, 500);

    setTimeout(function() {
      $hdcInner.removeClass("scale");
    }, 1000);
  },

  renderBookingSummary = function() {
    $bookingSummary.find('.date').text(selectedMonth + ' ' + selectedDay);
    $bookingSummary.find('.time').text(selectedHour);
  },

  updateBookingAction = function() {
    var $bookingActionElem = $card.find('.make-booking');
    if (selectedHour && selectedDay && selectedMonth && selectedYear) { // enable action if all values are selected
      $bookingActionElem.removeClass('disabled').on('click', function(ev) {
        flip('back');
        renderBookingSummary();
      });
    } else {
      $bookingActionElem.addClass('disabled').off('click');
    }
  },

  isEmail = function(str) {
    var atSym = str.lastIndexOf('@');

    // no local-part
    if (atSym < 1) {
      return false;
    }

    // no domain
    if (atSym == str.length - 1) {
      return false;
    }

    // there may only be 64 octets in the local-part
    if (atSym > 64) {
      return false;
    }

    // there may only be 255 octets in the domain
    if (str.length - atSym > 255) {
      return false;
    }

    // Is the domain plausible?
    var lastDot = str.lastIndexOf('.');

    // Check if it is a dot-atom such as example.com
    if (lastDot > atSym + 1 && lastDot < str.length - 1) {
      return true;
    }

    //  Check if could be a domain-literal.
    if (str.charAt(atSym + 1) == '[' && str.charAt(str.length - 1) == ']') {
      return true;
    }

    return false;
  }

  // instantiate submit and go-back buttons
  $card.find('button#go-back').on('click', function(ev) {
    flip('front');
  });

  $card.find('button#submit').on('click', function(ev) {
    var $inputName = $card.find('input#name');
        $inputEmail = $card.find('input#email'),
        enableSubmit = true;

    if (!$inputName.val()) {          // if input is invalid
      $inputName.addClass('invalid');
      enableSubmit = false;
    } else {
      $inputName.removeClass('invalid');
    }

    if (!isEmail($inputEmail.val())) {  // if input is invalid
      $inputEmail.addClass('invalid');
      enableSubmit = false;
    } else {
      $inputEmail.removeClass('invalid');
    }

    if (enableSubmit) {  // if submit is enabled
      console.log('SUBMIT');  // connect to timekit API
    }
  });


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
