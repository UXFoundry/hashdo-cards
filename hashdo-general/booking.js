var moment = require('moment');

module.exports = {
  name: 'Booking',
  description: 'Make a booking request',
  icon: 'http://cdn.hashdo.com/icons/question.png',
  clientStateSupport: true,

  inputs: {
    img: {
      example: 'http://interim.uxfoundry.co.za/img/intro/booking.jpg',
      description: 'main image URL',
      required: true,
    },
    title: {
      example: 'Indigo Fields Spa',
      description: 'Title of the booking company',
      required: true
    },
    timekitEmail: {
      example: 'ivan.rogic@toptal.com',
      description: 'Email of timekit user account',
      required: true,
      secure: true
    },
    timekitPassword: {
      example: 'password',
      description: 'Password of timekit user account',
      required: true,
      secure: true
    },
  },

  getCardData: function (inputs, state, callback) {
    var timekit = require('timekit-sdk');

    timekit.configure({
        app:                        'hashdo-booking',           // app name registered with timekit (get in touch)
        apiBaseUrl:                 'https://api.timekit.io/',  // API endpoint (do not change)
        apiVersion:                 'v2',                       // version of API to call (do not change)
        inputTimestampFormat:       'Y-m-d h:ia',               // default timestamp format that you supply
        outputTimestampFormat:      'Y-m-d h:ia',               // default timestamp format that you want the API to return
        timezone:                   'Europe/Zagreb',            // override user's timezone for custom formatted timestamps in another timezone
        convertResponseToCamelcase: false,                      // should keys in JSON response automatically be converted from snake_case to camelCase?
        convertRequestToSnakecase:  true                        // should keys in JSON requests automatically be converted from camelCase to snake_case?
    });

    timekit.auth({
      email: inputs.timekitEmail,
      password: inputs.timekitPassword
    }).then(function(response) {
      console.log(response.data.api_token);
    }).catch(function(response){
      console.log(response);
    });

    var now = new Date(),
        month = now.getMonth(),
        year = now.getFullYear(),
        months = parseMonths(month, year),
        hours = [ '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00' ];

    // locals sent to server-side jade
    var viewModel = {
      img: inputs.img,
      title: inputs.title,
      months: months,
      hours: hours,
    };

    // locals sent to client-side javascript
    var clientLocals = {

    };

    callback(null, viewModel, clientLocals);
  }
};

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function parseMonths(curMonth, curYear) {
  var months = moment.monthsShort().map(function(month, i) {
    var year = curMonth > i ? curYear + 1 : curYear;
    return {
      index: getDaysInMonth(i, year) + '-' + i + '-' + year,
      name: month,
    };
  });

  // reorder months and add year
  return months.slice(curMonth).concat(curYear + 1).concat(months.slice(0, curMonth));
}

