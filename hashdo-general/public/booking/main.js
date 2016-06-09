/* global card, locals, $ */

card.onReady = function () {
  var $card = $('#' + locals.card.id),
      $hdcInner = $card.find('.hdc-inner'),
      $shiftMonths = $hdcInner.find('.shifting-select.months'),
      $shiftDays = $hdcInner.find('.shifting-select.days'),
      $shiftHours = $hdcInner.find('.shifting-select.hours'),
      $bookingSummary = $card.find('.booking-summary'),
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

  document.getElementById('go-back').addEventListener('click', function(ev) {
    flip('front');
  });

  document.getElementById('submit').addEventListener('click', function(ev) {
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
      console.log('SUBMIT');
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
