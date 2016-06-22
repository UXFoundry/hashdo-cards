/* global card, locals, $ */

card.onReady = function () {
  var $card = $('#' + locals.card.id),
      $hdcInner = $card.find('.hdc-inner'),
      $shiftMonths = $hdcInner.find('.shifting-select.months'),
      $shiftDays = $hdcInner.find('.shifting-select.days'),
      $shiftHours = $hdcInner.find('.shifting-select.hours'),
      // selected values
      now = new Date(),
      curMonth = now.getMonth(),
      curDay = now.getDate(),
      selectedHour = false,
      selectedDay = false,
      selectedMonth = false,
      selectedMonthIndex = false,
      selectedYear = false,
      // action buttons
      $priAction = $card.find('button#pri'),
      $secAction = $card.find('button#sec'),
      // booking config
      timezone = locals.config.timezone,        // GMT (+2)
      bookingInterval = locals.config.bookingInterval,   // In minutes
      startHour = locals.config.startHour,          // Client starts working (hours)
      workingHours = locals.config.workingHours,       // Client working hours
      calendarId = false,


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
        m_min = $card.width() - $inner.width() - 2;     // minimum possible margin-left

    $inner.css('margin-left', 0);                       // reset to default

    if (m_min < 0) {  // if there is need for slider
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
    }

    $inner.find('a').on('click', function(ev) {
      ev.preventDefault();
      $inner.find('a.selected').removeClass('selected');
      var elem = $(this);
      elem.addClass('selected');
      handleClick(elem);
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
    selectedHour = false;     // reset selected day
    updateBookingAction();    // disable book action

    $shiftHours.find('.inner').html('<span>Checking available hours...</span>');  // loader

    timekit.findTime({
      "emails": [
          locals.timekit.email
      ],
      "start": selectedYear + '-' + (selectedMonthIndex + 1) + '-' + selectedDay + 'T' + startHour + ':00:00' + timezone,
      "filters": {
        "and": [
          { "specific_time": {"start": startHour, "end": startHour + workingHours}}
        ]
      },
      "future": workingHours + " hours",
      "length": bookingInterval + " minutes",
      "sort": "asc",
      "ignore_all_day_events": false,
      "all_solutions": false
    }).then(function(response) {
      updateHours(response.data);
    }).catch(function(response) {
      $shiftHours.find('.inner').html('<span>Error, please try again!</span>');
    });
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

    updateShifting($shiftDays, html, dayClick);
  },

  updateHours = function(availableHours) {
    var hours = availableHours.map(function(h) { return h.start }),  // parse timekit hours
        html = '';

    if (curMonth === selectedMonthIndex && curDay === selectedDay) { // if selected day is today then check time
      var bookingHours = new Date().getHours() + 2,            // add 2 more hours, no point in booking thats right now
          indexOfHour = hours.indexOf(bookingHours + ':00');

      if (indexOfHour !== -1) {
        hours = hours.slice(indexOfHour);               // cut of unavailable hours
      } else {
        hours = [];
      }
    }

    if (hours.length > 0) {
      hours.forEach(function(hour) {
        html += '<a href="#">' + hour + '</a>';
      });
    } else {
      return $shiftHours.find('.inner').html('<span>No available hours!</span>');
    }

    updateShifting($shiftHours, html, hourClick);
  },

  updateShifting = function($shiftModule, html, handleClick) {
    $shiftModule.addClass("changed").find('.inner').html(html);  // add/remove class in delayed fashion

    setTimeout(function() {
      $shiftModule.removeClass("changed");
    }, 1000);

    setUpHammer($shiftModule, handleClick);   // update hammer
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
    $card.find('.booking-summary .date').text(selectedMonth + ' ' + selectedDay);
    $card.find('.booking-summary .time').text(selectedHour);
  },

  updateBookingAction = function() {
    var $bookingActionElem = $card.find('.make-booking');
    if (selectedHour && selectedDay && selectedMonth && selectedYear) { // enable action if all values are selected
      $bookingActionElem.removeClass('disabled').on('click', function(ev) {
        ev.preventDefault();
        renderBookingSummary();
        flip('back');
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
  },

  setUpTimekit = function() {

    timekit.configure({
      app:                        locals.timekit.app,           // app name registered with timekit (get in touch)
      apiBaseUrl:                 'https://api.timekit.io/',    // API endpoint (do not change)
      apiVersion:                 'v2',                         // version of API to call (do not change)
      // inputTimestampFormat:       'Y-m-d h:ia',              // default timestamp format that you supply
      outputTimestampFormat:      'H:i',                        // default timestamp format that you want the API to return
      // timezone:                   timezone,                  // override user's timezone for custom formatted timestamps in another timezone
    });

    timekit.auth({
      email: locals.timekit.email,
      password: locals.timekit.password
    }).then(function(response) {
      timekit.setUser(locals.timekit.email, response.data.api_token);
      getTimekitCalendarId();
    }).catch(function(response) {
      setTimeout(function() {
        setUpTimekit();
      }, 3000);
    });

    function getTimekitCalendarId() {
      timekit.getCalendars().then(function(response) {
        calendarId = response.data[0].id;
      }).catch(function(response) {
        setTimeout(function() {
          getTimekitCalendarId();
        }, 3000);
      });
    }
  },

  setUpCreateBookingAction = function() {
    $priAction.attr('class', 'btn-blue').text('Create').on('click', function(ev) {
      var $inputName = $card.find('input#name');
          $inputEmail = $card.find('input#email'),
          nameValue = $inputName.val().trim(),
          emailValue = $inputEmail.val().trim(),
          enableSubmit = true;

      if (!nameValue) {          // if input is invalid
        $inputName.addClass('invalid');
        enableSubmit = false;
      } else {
        $inputName.removeClass('invalid');
      }

      if (!isEmail(emailValue)) {  // if input is invalid
        $inputEmail.addClass('invalid');
        enableSubmit = false;
      } else {
        $inputEmail.removeClass('invalid');
      }

      if (enableSubmit) {  // if submit is enabled
        var bookingTime = parseBookingTime();

        $priAction.text('Creating booking...').addClass('block').off('click');
        $secAction.addClass('hide').off('click');

        timekit.createBooking({
          "graph": "confirm_decline",
          "action": "create",
          "event": {
            "start": bookingTime.start,
            "end": bookingTime.end,
            "what": locals.info.what,
            "where": locals.info.where,
            "description": locals.info.description,
            "calendar_id": calendarId,
          },
          "customer": {
            "name": nameValue,
            "email": emailValue
          }
        }).then(function(response) {
          setUpConfirmBookingAction(response.data.id, nameValue, emailValue);
          setUpDeclineBookingAction(response.data.id);
        }).catch(function(response) {
          $priAction.attr('class', 'btn-red block').text('Error, click to try again').on('click', function() {
            setUpCreateBookingAction();
            setUpGoBackAction();
          });
        });

        function parseBookingTime() {
          var eventDate = selectedYear + '-' + (selectedMonthIndex + 1) + '-' + selectedDay + 'T',
              parseEndHour = function() {
                var splitTime = selectedHour.split(':'),
                    hours = parseInt(splitTime[0], 10),
                    minutes = parseInt(splitTime[1], 10) + bookingInterval;

                if (minutes >= bookingInterval) {
                  minutes = minutes - bookingInterval;
                  hours++;

                  if (minutes < 10) {
                    minutes = '0' + minutes;
                  }
                }

                return hours + ':' + minutes;
              };

          return {
            start: eventDate + selectedHour + ':00' + timezone,
            end: eventDate + parseEndHour() + ':00' + timezone
          };
        }
      }
    });
  },

  setUpGoBackAction = function() {
    $secAction.attr('class', 'btn-white go-back').text('<').on('click', function(ev) {
      flip('front');
    });
  },

  setUpConfirmBookingAction = function(bookingId, name, email) {
    $priAction.attr('class', 'btn-green').text('Confirm').on('click', function(ev) {

      $priAction.text('Confirming booking...').addClass('block').off('click');
      $secAction.addClass('hide').off('click');

      timekit.updateBooking({
        "id": bookingId,
        "action": "confirm"
      }).then(function(response) {
        $priAction.text('Booking confirmed!');

        //add data to localStorage
        locals.config.useLocalStorage && localStorage.setItem('hashdo-booking-timestamp', JSON.stringify({
          timestamp: new Date(selectedYear, selectedMonthIndex, selectedDay).getTime(),
          selectedMonth: selectedMonth,
          selectedDay: selectedDay,
          selectedHour: selectedHour,
          name: name,
          email: email
        }));

      }).catch(function(response) {
        $priAction.attr('class', 'btn-red block').text('Error, please try again').on('click', function() {
          setUpConfirmBookingAction(bookingId);
          setUpDeclineBookingAction(bookingId);
        });
      });

    });
  },

  setUpDeclineBookingAction = function(bookingId) {
    $secAction.attr('class', 'btn-red').text('Decline').on('click', function(ev) {

      $secAction.text('Declining booking...').addClass('block').off('click');
      $priAction.addClass('hide').off('click');

      timekit.updateBooking({
        "id": bookingId,
        "action": "decline"
      }).then(function(response) {
        $secAction.attr('class', 'btn-green block').text('Booking declined!').on('click', function() {
          setUpCreateBookingAction();
          setUpGoBackAction();
        });
      }).catch(function(response) {
        $secAction.attr('class', 'btn-red block').text('Error, please try again').on('click', function() {
          setUpConfirmBookingAction(bookingId);
          setUpDeclineBookingAction(bookingId);
        });
      });

    });
  },

  isBookingAllowed = function() {
    if (!locals.config.useLocalStorage) {
      return true;
    }

    var lsItem = JSON.parse(localStorage.getItem('hashdo-booking-timestamp'));
    if (lsItem && new Date().getTime() - lsItem.timestamp < 0) { // if the scheduled booking has passed
      // set values
      selectedHour = lsItem.selectedHour;
      selectedDay = lsItem.selectedDay;
      selectedMonth = lsItem.selectedMonth;
      $card.find('input#name').val(lsItem.name);
      $card.find('input#email').val(lsItem.email);
      // disable button
      $priAction.text('Booking confirmed!').attr('class', 'btn-green block').off('click');
      $secAction.addClass('hide').off('click');
      // render and flip
      renderBookingSummary();
      flip('back');
      return false;
    }

    localStorage.removeItem('hashdo-booking-timestamp');
    return true;
  };

  // check localStorage if booking has already been made
  if (isBookingAllowed()) {
    setUpCreateBookingAction();
    setUpGoBackAction();
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
    } else {
      setUpHammer($shiftMonths, monthClick);
      setUpHammer($shiftDays, dayClick);
      setUpHammer($shiftHours, hourClick);
    }

    if (typeof timekit === 'undefined') {
      card.require('https://cdnjs.cloudflare.com/ajax/libs/timekit-js-sdk/1.5.0/timekit-sdk.min.js', function () {
        setUpTimekit();
      });
    } else {
        setUpTimekit();
    }
  }
};
