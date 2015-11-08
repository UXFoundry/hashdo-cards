module.exports = {
  name: 'My bill so far',
  description: 'My me&you bill so far.',
  icon: 'http://cdn.hashdo.com/icons/meandyou.png',

  inputs: {
    customerId: {
      example: '123456789',
      description: 'A me&you customer id.',
      required: true,
      secure: true
    },
    MSISDN: {
      example: '27831234567',
      description: 'A valid MSISDN number.',
      required: true
    },
    SIMName: {
      example: 'My SIM',
      description: 'SIM Name',
      required: true
    },
    merchantId: {
      example: 'merchant',
      description: 'A valid me&you API merchant id.',
      required: !process.env.ME_YOU_MERCHANT_ID,
      secure: true
    },
    session: {
      example: '324235dsfsdg324',
      description: 'A valid me&you API session key.',
      required: true,
      secure: true
    },
    apiUrl: {
      example: 'http://api.com',
      description: 'A valid API endpoint url.',
      required: !process.env.ME_YOU_HOST_URL,
      secure: true
    },
    apiKey: {
      example: 'dfsdf324234DSfddd',
      description: 'A valid me&you API key',
      required: !process.env.ME_YOU_API_KEY,
      secure: true
    }
  },

  getCardData: function (inputs, state, callback) {
    var MeAndYou = require('./lib/meandyou'),
      Moment = require('moment');

    if (state.html) {
      var viewModel = {
        name: state.name,
        number: state.number,
        html: state.html,
        date: state.date
      };

      callback(null, viewModel);
    }
    else {
      MeAndYou.getSimBalance(inputs.apiUrl, inputs.customerId, inputs.merchantId, inputs.session, inputs.apiKey, inputs.MSISDN, function (err, data) {
        var serviceData = {
          itemizedBilling: 0,
          softLock: false,
          roaming: false,
          dialing: false,
          baseData: '',
          baseValue: '',
          ServiceName: ''
        };

        var myBillSoFarHtml = '<table><thead><tr><th>Service</th><th style="text-align:right;">Amount</th></tr></thead><tbody>';
        var myBillSoFarTotal = 0;

        if (data && data.Services) {
          for (var i = 0; i < data.Services.length; i++) {
            var service = data.Services[i];

            if (service.ServiceCode.toLowerCase() == 'itemizedbill') {
              serviceData.itemizedBilling = parseFloat(service.ServiceCharge);
            }

            if (service.ServiceCode.toLowerCase() == 'baoccr') {
              serviceData.softLock = true;
            }

            if (service.ServiceCode.toLowerCase() == 'ssiro') {
              serviceData.roaming = true;
            }

            if (service.ServiceCode.toLowerCase() == 'recbi') {
              serviceData.dialing = true;
            }

            if (service.ServiceName.toLowerCase().indexOf('data') != -1 && service.ServiceName.toLowerCase().indexOf('monthly') != -1) {
              serviceData.baseData = service.ServiceCode.replace('MAY', '').replace('-BASE', '').replace('PR', '');
            }

            if (service.ServiceName.toLowerCase().indexOf('bundle') != -1 || service.ServiceName.toLowerCase().indexOf('talk') != -1) {
              serviceData.ServiceName = service.ServiceName;
              serviceData.baseValue = service.ServiceCharge;
            }

            if (service.ServiceCharge != null && service.ServiceCode != 'ItemizedBill') {
              if (service.ServiceName == 'R50 Free Bundle') {
                service.ServiceCharge = '0.00';
              }

              if (service.ServiceName.toLowerCase().indexOf('once off') == -1) {
                myBillSoFarTotal = myBillSoFarTotal + parseInt(service.ServiceCharge);
                myBillSoFarHtml += '<tr><td>' + service.ServiceName + '</td><td align="right"><span>R</span> ' + parseInt(service.ServiceCharge).toFixed(2) + '</td></tr>';
              }
              else {
                myBillSoFarHtml += '<tr><td>' + service.ServiceName + '</td><td align="right"><span>R</span> ' + parseInt(service.ServiceCharge).toFixed(2) + '</td></tr>';
                myBillSoFarHtml += '<tr><td>' + service.ServiceName + ' (payment)</td><td align="right"><span>-R</span> ' + parseInt(service.ServiceCharge).toFixed(2) + '</td></tr>';
              }
            }
          }
        }

        var smsTOTAL = 0.00,
          smsCOUNT = 0,
          mmsTOTAL = 0.00,
          mmsCOUNT = 0,
          dataTOTAL = 0.00,
          dataCOUNT = 0,
          talkTOTAL = 0.00,
          talkCOUNT = 0;

        if (data && data.OutOfBundle && data.OutOfBundle.Items) {
          for (var j = 0; j < data.OutOfBundle.Items.length; j++) {
            var chItems = data.OutOfBundle.Items[j];

            if (chItems.Amount != '0.00') {
              myBillSoFarTotal = myBillSoFarTotal + parseFloat(chItems.Amount);

              if (chItems.EventAbbreviation.toLowerCase() == 'mosms') {
                chItems.EventAbbreviation = 'SMS';
                smsCOUNT++;
                smsTOTAL = smsTOTAL + parseFloat(chItems.Amount);
              }
              else if (chItems.EventAbbreviation.toLowerCase() == 'momms') {
                chItems.EventAbbreviation = 'MMS';
                mmsCOUNT++;
                mmsTOTAL = mmsTOTAL + parseFloat(chItems.Amount);
              }
              else if (chItems.EventAbbreviation.toLowerCase() == 'data') {
                chItems.EventAbbreviation = 'Out of bundle data';
                dataCOUNT++;
                dataTOTAL = dataTOTAL + parseFloat(chItems.Amount);
              }
              else if (chItems.EventAbbreviation.toLowerCase() == 'moc') {
                chItems.EventAbbreviation = 'Out of bundle talk';
                talkCOUNT++;
                talkTOTAL = talkTOTAL + parseFloat(chItems.Amount);
              }
              else {
                myBillSoFarHtml += '<tr><td>' + chItems.EventAbbreviation + '</td><td align="right"><span>R</span> ' + chItems.Amount + '</td></tr>';
              }
            }
          }
        }

        if (talkCOUNT != 0) {
          myBillSoFarHtml += '<tr><td>Out of bundle talk </td><td align="right"><span>R</span> ' + parseFloat(talkTOTAL).toFixed(2) + '</td></tr>';
        }

        if (dataCOUNT != 0) {
          myBillSoFarHtml += '<tr><td>Out of bundle data </td><td align="right"><span>R</span> ' + parseFloat(dataTOTAL).toFixed(2) + '</td></tr>';
        }

        if (smsCOUNT != 0) {
          myBillSoFarHtml += '<tr><td>SMS </td><td align="right"><span>R</span> ' + parseFloat(smsTOTAL).toFixed(2) + '</td></tr>';
        }

        if (mmsCOUNT != 0) {
          myBillSoFarHtml += '<tr><td>MMS </td><td align="right"><span>R</span> ' + parseFloat(mmsTOTAL).toFixed(2) + '</td></tr>';
        }

        if (serviceData.itemizedBilling != 0) {
          myBillSoFarTotal = myBillSoFarTotal + parseInt(29);
          myBillSoFarHtml += '<tr><td>Itemised bill</td><td align="right"><span>R</span> 29.00</td></tr>';
        }

        myBillSoFarHtml += '<tr class="totalbill"><td>TOTAL</td><td align="right"><span>R</span> ' + parseFloat(myBillSoFarTotal).toFixed(2) + '</td></tr>';
        myBillSoFarHtml += '</tbody></table>';

        var viewModel = {
          name: inputs.SIMName.length > 20 ? inputs.SIMName.substr(0, 20) + '...' : inputs.SIMName,
          number: inputs.MSISDN,
          html: myBillSoFarHtml,
          date: Moment.utc().format('Do MMMM YYYY')
        };

        state.name = viewModel.name;
        state.number = viewModel.number;
        state.html = viewModel.html;
        state.date = viewModel.date;

        callback(null, viewModel);
      });
    }
  }
};

