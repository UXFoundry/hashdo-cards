module.exports = {
  name: 'My account usage',
  description: 'My me&you account usage.',
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
    },
    maintenanceFrom: {
      example: '23 April 2016 16:00',
      description: 'Maintenance from datetime (UTC)',
      label: 'Maintenance From (UTC)'
    },
    maintenanceTo: {
      example: '24 April 2016 05:00',
      description: 'Maintenance from datetime (UTC)',
      label: 'Maintenance To (UTC)'
    }
  },

  getCardData: function (inputs, state, callback) {
    var MeAndYou = require('./lib/meandyou'),
      Moment = require('moment');

    if (state.name) {
      var viewModel = {
        name: state.name,
        number: state.number,
        valueBundles: state.valueBundles,
        dataBundles: state.dataBundles,
        date: state.date,
        billDateInfo: state.billDateInfo
      };

      callback(null, viewModel);
    }
    else {
      // maintenance
      if (inputs.maintenanceFrom && inputs.maintenanceTo) {
        if (Moment.utc().isAfter(Moment.utc(inputs.maintenanceFrom, 'D MMMM YYYY HH:mm')) && Moment.utc().isBefore(Moment.utc(inputs.maintenanceTo, 'D MMMM YYYY HH:mm'))) {
          callback(null, {maintenance: true});
          return;
        }
      }

      // CDRatror changes
      var cdrMode = false;
      // if (Moment.utc().isAfter(Moment.utc('24 April 2016 05:00', 'D MMMM YYYY HH:mm')) && Moment.utc().isBefore(Moment.utc('01 May 2016 05:00', 'D MMMM YYYY HH:mm'))) {
      //   cdrMode = true;
      // }

      MeAndYou.getSimBalance(inputs.apiUrl, inputs.customerId, inputs.merchantId, inputs.session, inputs.apiKey, inputs.MSISDN, function (err, data) {
        var valueBundles = '',
          dataBundles = '',
          billDateInfo;

        if (data && data.Bundles) {
          var billLimit = data.OutOfBundle.BillLimit;
          billLimit = parseInt(billLimit, 10) == 1 ? 0 : billLimit;

          if (data.Bundles.ValueBundles) {
            for (var i = 0; i < data.Bundles.ValueBundles.length; i++) {
              var valueBundle = data.Bundles.ValueBundles[i];

              if (valueBundle.Name) {
                valueBundles += getValueBundleTemplate(valueBundle, billLimit, data.OutOfBundle.Total);
              }
            }
          }

          if (data.Bundles.DataBundles) {
            for (var j = 0; j < data.Bundles.DataBundles.length; j++) {
              dataBundles += getDataBundleTemplate(data.Bundles.DataBundles[j]);
            }
          }
        }

        if (data) {
          billDateInfo = data.billdate_info;
        }

        function getValueBundleTemplate(bundleValue, billLimit, totalOutOfBundle) {
          var available = parseFloat(bundleValue.Available),
            creditAvailable = parseFloat(billLimit) - parseFloat(totalOutOfBundle),
            allocated = parseFloat(bundleValue.Allocation),
            used = allocated - available,
            progress = (100 - ((available / allocated) * 100)),
            creditProgress = totalOutOfBundle > 0 ? ((parseFloat(totalOutOfBundle) / parseFloat(billLimit)) * 100) : 0,
            totalUsed = 'R' + used.toFixed(2),
            totalUsedCredit = 'R' + totalOutOfBundle.toFixed(2);

          creditProgress = creditProgress > 50 ? 50 : creditProgress;

          return '<h3><span class="_jsRatePlan">' + bundleValue.Name + '</span><b class="pull-right _jsNextRatePlan"></b></h3>' +
            '<p class="miniNotice _jsRatePlanRemaining">R' + available.toFixed(2) + ' remaining</p>' +
            '<p class="miniUsed">' + totalUsed + ' used</p>' +

            '<div class="progress valueBundleProgress">' +
            '<div class="progress-bar" id="valueBundle" style="width: ' + progress + '%">' +
            '</div>' +
            '</div>' +

            '<h3><span class="_jsRatePlan">R' + billLimit + ' credit limit</span><b class="pull-right _jsNextRatePlan"></b></h3>' +
            '<p class="miniNotice _jsRatePlanRemaining">R' + creditAvailable.toFixed(2) + ' remaining</p>' +
            '<p class="miniUsed">' + totalUsedCredit + ' used</p>' +

            '<div class="progress valueBundleProgress">' +
            '<div class="progress-bar" style="width: ' + creditProgress + '%">' +
            '</div>' +
            '</div>'
        }

        function getDataBundleTemplate(bundleData) {
          var available = parseFloat(bundleData.Available) / 1048576.0,
            allocated = parseFloat(bundleData.Allocation) / 1048576.0,
            progress = 100 - ((available / allocated) * 100),
            totalUsed = (allocated - available).toFixed() + 'MB used',
            bundleExpiryDate = bundleData.ExpiryDate,
            formattedBundleExpiryDate = Moment(bundleExpiryDate).format('DD MMMM YYYY');

          return '<div class="_jsDataBundleContainer">' +
            '<h3>' + bundleData.Name + ' <b class="pull-right _jsNextData"></b></h3>' +
            '<p class="miniNotice">Expiry Date: ' + formattedBundleExpiryDate + '</p>' +
            '<p class="miniNotice _jsDataRemaining">' + available.toFixed() + 'MB remaining</p>' +
            '<p class="miniUsed">' + totalUsed + '</p>' +
            '<div class="progress">' +
            '<div class="progress-bar" id="dataBundle" style="width: ' + progress.toFixed() + '%">' +
            '</div>' +
            '</div>' +
            '</div>';
        }

        var viewModel = {
          name: inputs.SIMName.length > 20 ? inputs.SIMName.substr(0, 20) + '...' : inputs.SIMName,
          number: inputs.MSISDN,
          valueBundles: valueBundles,
          dataBundles: dataBundles,
          date: Moment.utc().format('Do MMMM YYYY'),
          cdrMode: cdrMode
        };

        if (billDateInfo) {
          viewModel.billDateInfo = billDateInfo;
        }

        state.name = viewModel.name;
        state.number = viewModel.number;
        state.valueBundles = viewModel.valueBundles;
        state.dataBundles = viewModel.dataBundles;
        state.date = viewModel.date;

        if (billDateInfo) {
          state.billDateInfo = viewModel.billDateInfo;
        }

        callback(null, viewModel);
      });
    }
  }
};

