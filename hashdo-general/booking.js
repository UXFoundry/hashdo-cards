var moment = require('moment');

module.exports = {
  name: 'Booking',
  description: 'Make a booking request',
  icon: 'http://cdn.hashdo.com/icons/question.png',
  clientStateSupport: true,

  inputs: {
    // Booking card config
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
    // timezone: {
    //   example: +2,
    //   description: 'Timezone of the booking company',
    //   required: false
    // },
    startHour: {
      example: 8,
      description: 'Starting working hour',
      required: false
    },
    workingHours: {
      example: 8,
      description: 'Number of working hours per day',
      required: false
    },
    bookingInterval: {
      example: 60,
      description: 'Booking session length in minutes',
      required: false
    },
    // will prevent another booking for a week for the same user
    useLocalStorage: {
      example: 'no',
      description: 'Use localstorage to prevent bookings',
      required: false
    },
    what: {
      example: "Mens haircut",
      description: 'Type of booking service',
      required: false
    },
    where: {
      example: "Sesame St, Middleburg, FL 32068, USA",
      description: 'Booking company location',
      required: false
    },
    description: {
      example: "Please arrive 10 minutes before you time begin",
      description: 'Booking session description',
      required: false
    },
    // User data (will get from X&GO or user will manually input)
    userName: {
      example: 'Ivan Rogic',
      description: 'Name of the user performing the booking action',
      required: false,
      secure: true
    },
    userEmail: {
      example: 'rogic89@gmail.com',
      description: 'Email of the user performing the booking action',
      required: false,
      secure: true
    },
    // Client timekit data
    timekitAppName: {
      example: 'hashdo-booking',
      description: 'Name of the timekit app',
      required: true,
      secure: true
    },
    // TODO ERROR -  if provided with value '', all secured inputs are replaced by random IDs
    timekitApiToken: {
      example: 'TJDQsKBOM2uSVxLorOXIRD9kbTEuGL49',
      description: 'User timekit API token',
      required: false,
      secure: true
    },
    timekitCalendarId: {
      example: 'cc4657b1-fc68-4f05-bc73-7f21ee033464',
      description: 'User timekit CalendarID',
      required: false,
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
    }
  },

  getCardData: function (inputs, state, callback) {
    var now = new Date(),
        month = now.getMonth(),
        year = now.getFullYear(),
        months = parseMonths(month, year),
        timezone = '+2',  //parseInt(inputs.timezone, 10) || now.getTimezoneOffset() / 60,
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
      config: {
        timezone: timezone,  // will use default value of +2 for now
        bookingInterval: parseInt(inputs.bookingInterval, 10),
        startHour: parseInt(inputs.startHour, 10),
        workingHours: parseInt(inputs.workingHours, 10),
        useLocalStorage: inputs.useLocalStorage === 'yes'
      },
      info: {
        what: inputs.what || false,
        where: inputs.where || false,
        description: inputs.description || false,
      },
      timekit: {
        app: inputs.timekitAppName,
        email: inputs.timekitEmail,
        password: inputs.timekitPassword,
        apiToken: inputs.timekitApiToken,
        calendarId: inputs.timekitCalendarId
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

