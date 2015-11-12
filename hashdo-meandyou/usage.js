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
        date: state.date
      };

      callback(null, viewModel);
    }
    else {
      MeAndYou.getSimBalance(inputs.apiUrl, inputs.customerId, inputs.merchantId, inputs.session, inputs.apiKey, inputs.MSISDN, function (err, data) {
        var valueBundles = '',
          dataBundles = '';

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

        function getValueBundleTemplate(bundleValue, billLimit, totalOutOfBundle) {
          var available = parseFloat(bundleValue.Available),
            creditAvailable = parseFloat(billLimit) - parseFloat(totalOutOfBundle),
            allocated = parseFloat(bundleValue.Allocation),
            used = allocated - available,
            progress = (100 - ((available / allocated) * 100)),
            creditProgress = totalOutOfBundle > 0 ? ((parseFloat(totalOutOfBundle) / parseFloat(billLimit)) * 100) : 0,
            totalUsed = progress >= 10 ? 'R' + used.toFixed(2) : '',
            totalUsedCredit = creditProgress >= 10 ? 'R' + totalOutOfBundle.toFixed(2) : '';

          creditProgress = creditProgress > 50 ? 50 : creditProgress;

          return '<h3><span class="_jsRatePlan">' + bundleValue.Name + '</span><b class="pull-right _jsNextRatePlan"></b></h3>' +
            '<p class="miniNotice _jsRatePlanRemaining">R' + available.toFixed(2) + ' bundle remaining</p>' +

            '<div class="progress valueBundleProgress">' +
            '<div class="progress-bar" id="valueBundle" style="width: ' + progress + '%">' +
            '<span class="">' + totalUsed + '</span>' +
            '</div>' +
            '</div>' +

            '<h3><span class="_jsRatePlan">R' + billLimit + ' credit limit</span><b class="pull-right _jsNextRatePlan"></b></h3>' +
            '<p class="miniNotice _jsRatePlanRemaining">R' + creditAvailable.toFixed(2) + ' credit remaining</p>' +

            '<div class="progress valueBundleProgress">' +
            '<div class="progress-bar" style="width: ' + creditProgress + '%">' +
            '<span class="">' + totalUsedCredit + '</span>' +
            '</div>' +
            '</div>'
        }

        function getDataBundleTemplate(bundleData) {
          var available = parseFloat(bundleData.Available) / 1048576.0,
            allocated = parseFloat(bundleData.Allocation) / 1048576.0,
            progress = 100 - ((available / allocated) * 100),
            totalUsed = progress.toFixed() >= 10 ? (allocated - available).toFixed() + 'MB used' : '';

          return '<div class="_jsDataBundleContainer">' +
            '<h3>' + bundleData.Name + ' <b class="pull-right _jsNextData"></b></h3>' +
            '<p class="miniNotice _jsDataRemaining">' + available.toFixed() + 'MB data remaining</p>' +
            '<div class="progress">' +
            '<div class="progress-bar" id="dataBundle" style="width: ' + progress.toFixed() + '%">' +
            '<span class="">' + totalUsed + '</span>' +
            '</div>' +
            '</div>' +
            '</div>';
        }

        var viewModel = {
          name: inputs.SIMName.length > 20 ? inputs.SIMName.substr(0, 20) + '...' : inputs.SIMName,
          number: inputs.MSISDN,
          valueBundles: valueBundles,
          dataBundles: dataBundles,
          date: Moment.utc().format('Do MMMM YYYY')
        };

        state.name = viewModel.name;
        state.number = viewModel.number;
        state.valueBundles = viewModel.valueBundles;
        state.dataBundles = viewModel.dataBundles;
        state.date = viewModel.date;

        callback(null, viewModel);
      });
    }
  }
};

