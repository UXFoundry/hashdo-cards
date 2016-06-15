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
    timekitApp: {
      example: 'hashdo-booking',
      description: 'Name of the timekit app',
      required: true,
      secure: true
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
    userName: {  // will be suplied
      example: 'Ivan Rogic',
      description: 'Name of the user performing the booking action',
      secure: true
    },
    userEmail: {
      example: 'rogic89@gmail.com',
      description: 'Email of the user performing the booking action',
      secure: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var now = new Date(),
        month = now.getMonth(),
        year = now.getFullYear(),
        months = parseMonths(month, year),
        hours = [ '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00' ];

    // locals sent to server-side jade
    viewModel = {
      img: inputs.img,
      title: inputs.title,
      months: months,
      hours: hours,
      userName: inputs.userName,
      userEmail: inputs.userEmail
    },

    // locals sent to client-side javascript
    clientLocals = {
      timekit: {
        app: inputs.timekitApp,
        email: inputs.timekitEmail,
        password: inputs.timekitPassword
      }
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
      index: i,
      date: getDaysInMonth(i, year) + '-' + month + '-' + year,
      name: month,
    };
  });

  // reorder months and add year
  return months.slice(curMonth).concat(curYear + 1).concat(months.slice(0, curMonth));
}

