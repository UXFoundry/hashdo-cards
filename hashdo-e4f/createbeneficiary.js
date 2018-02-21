var async = require('async');

module.exports = {
    name: 'CreateBeneficiary',
    description: 'E4F Create a Beneficiary',
    icon: 'http://cdn.hashdo.com/icons/e4f.png',
    clientStateSupport: true,
    clientProxySupport: true,

    inputs: {
        partnerId: {
            example: '01',
            description: 'API Partner ID.',
            secure: true,
            required: true
        },
        partnerUsername: {
            example: 'username',
            description: 'API Partner Username.',
            secure: true,
            required: true
        },
        partnerPassword: {
            example: 'password',
            description: 'API Partner Password.',
            secure: true,
            required: true
        },
        E4FUserId: {
            example: '132785',
            description: 'Authenticated User Token.',
            secure: true,
            required: true
        },
        requestId: {
            example: '552fa62425186c6012edcf18',
            description: 'The current request\'s ID.',
            required: true
        }
    },

    getCardData: function (inputs, state, callback) {
        if (state.localData) {
            async.waterfall([
                handovertoHashDo
            ], function (err) {
                console.log("ERROR #################################");
                console.log(err);
            });

        }

        else {
            console.log('No state data');
            async.waterfall([
                handovertoHashDo
            ], function (err) {
                console.log("ERROR #################################");
                console.log(err);
            });
        }

        function handovertoHashDo(dataIn) {
            var viewModel = {
                title: 'Create a Beneficiary'
            };
            var clientLocals = {
                userID: inputs.LoggedInUserID,
                stateData: state.localData
            };
            callback(null, viewModel, clientLocals);

        }


    }
};

