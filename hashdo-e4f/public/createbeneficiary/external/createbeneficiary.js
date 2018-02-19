var __e4fcreateben = {

    createbeneficiary: {

        onReady: function (c, dc, loc) {
            $card = dc;
            card = c;
            locals = loc;
            importcreateBeneficiary();
        }
    }
};

var $card;
var card;
var locals;

function importcreateBeneficiary() {

    console.log(locals);

    if (locals)
        if (locals.stateData)
            if (locals.stateData.completed)
                locals = locals.stateData;

    if (locals.completed) {

        displayLoading();
        resetUItoHidden(function () {

            $card.find('.beneficiarycountry').addClass('hidden');
            $card.find('.beneficiaryCurrencyLabel').addClass('hidden');
            $card.find('.beneficiarycurrency').addClass('hidden');
            $card.find('.reasonfortransfer').addClass('hidden');
            $card.find('.beneficiarypayoutmethod').addClass('hidden');
            $card.find('.beneficiarytype').addClass('hidden');
            $card.find('.beneficiaryComplete').removeClass('hidden');
            $card.find('.beneficiaryCompleteDetails').removeClass('hidden');
            $card.find('.beneficiaryCompleteNametxt').val(locals.beneficiaryName);
            $card.find('.beneficiaryCompleteCountrytxt').val(locals.beneficiaryCountry);
            $card.find('.beneficiaryCompleteAccountNumbertxt').val(locals.beneficiaryAccountNumber);


        })

        hideLoading();

    }

    else {

        console.log('Imported');
        getPayOutCountryList();
        getBankAccountTypeList();

    }

    function sortPayOutCountriesbyName(x, y) {
        return ((x.destinationCountryName == y.destinationCountryName) ? 0 : ((x.destinationCountryName > y.destinationCountryName) ? 1 : -1));
    }

    var over = '<div id="overlay"><img id="loading" src="http://www.exchange4free.com/xandgo/images/loader.gif"></div>';

    function displayLoading() {
        $card.find('.hdc-content').append(over);
    }

    function hideLoading() {
        $('#overlay').remove();
    }

    function showError(text) {

        console.log(text);

        if (text.includes('obtain the country pay out options:')) {

        }
        else if (text.includes('DEFAULT')) {

        }
        else {
            $modal = card.modal.open('<br><div class="hdc-error-text">' + text + '</div>' + '<div class="hdc-errormodal-footer"><br><div class="hdc-errormodal-done" style="display: block;"><button type="button">OK</button></div></div>');

            $ok = $modal.find('.hdc-errormodal-done');
            $ok.on('click', function () {
                card.modal.close();
            });
        }
    }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    var allCountryList;
    var selectedCountryInformation;

    function getAllCountryList(callback) {
        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getAllCountryList/', {}, function (err, response) {
            if (response) {
                if (response.returnData) {
                    allCountryList = response.returnData;
                    callback();
                }
                else {
                    callback();
                }

            }
            else {
                callback();

            }
        });

    }

    $card.find('.telephonetxt').on('blur', function () {


    });

    function updateSelectedCountryInformation() {
        getAllCountryList(function () {
            var selectedContryCode = $card.find('.beneficiarycountrySelect').val();

            allCountryList.forEach(function (entry) {
                if (entry.countryCode == selectedContryCode) {
                    console.log(entry);
                    selectedCountryInformation = entry;

                    $card.find('.telephoneintltxt').val('Dialling Code: +' + entry.dialingCode);
                    console.log($card.find('.telephoneintltxt').val());
                }
            });

        })
    }

    $card.find('.beneficiarycountrySelect').on('change', function () {
        displayLoading();
        updateSelectedCountryInformation();


        resetUItoHidden(function () {
            getCountryPayOutCurrency();
            if ($card.find('.beneficiarycountrySelect').val() == "ZAF") {
                getZAFInformation_Province();
                configureUIforSelectedCountry();

            }
            populateCompanyTypeList();
            getTransferReasonList();
            $card.find('.beneficiaryCurrencyLabel').removeClass('hidden');
            $card.find('.beneficiarycurrency').removeClass('hidden');

            $card.find('.beneficiaryDetails').addClass('hidden');




        });

        hideLoading();




    });


    //beneficiaryprovinceZARSelect

    $card.find('.beneficiaryprovinceZARSelect').on('change', function () {
        displayLoading();
        if ($card.find('.beneficiarycountrySelect').val() == "ZAF") {

            getZAFInformation_ProvinceCity();
            $card.find('.beneficiarycityZAR').removeClass('hidden');
        }
        hideLoading();



    });

    //beneficiarycityZARSelect


    $card.find('.beneficiarycityZARSelect').on('change', function () {
        displayLoading();
        if ($card.find('.beneficiarycountrySelect').val() == "ZAF") {

            getZAFInformation_CitySuburb();
            $card.find('.beneficiarysuburbZAR').removeClass('hidden');
        }
        hideLoading();



    });

    //

    $card.find('.beneficiarysuburbZARSelect').on('change', function () {
        displayLoading();
        if ($card.find('.beneficiarycountrySelect').val() == "ZAF") {

            getZAFInformation_CitySuburbPostalCode();
            $card.find('.beneficiarypostCodeZAR').removeClass('hidden');
        }

        hideLoading();

    });

    function resetUItoHidden(callback) {
        $card.find('.beneficiarysuburbZAR').addClass('hidden');
        $card.find('.beneficiaryDetails').addClass('hidden');
        $card.find('.beneficiarytype').addClass('hidden');
        $card.find('.beneficiaryBankCode').addClass('hidden');
        $card.find('.beneficiarypersonaldetails').addClass('hidden');
        $card.find('.beneficiaryFirstName').addClass('hidden');
        $card.find('.beneficiaryLastName').addClass('hidden');
        $card.find('.beneficiaryIDType').addClass('hidden');
        $card.find('.beneficiaryid').addClass('hidden');
        $card.find('.beneficiarytemporaryresidentid').addClass('hidden');
        $card.find('.beneficiarydateofbirth').addClass('hidden');
        $card.find('.beneficiaryforeignid').addClass('hidden');
        $card.find('.beneficiaryforeignidcountry').addClass('hidden');
        $card.find('.beneficiarygender').addClass('hidden');
        $card.find('.beneficiaryBankContactFirstName').addClass('hidden');
        $card.find('.beneficiaryBankCompanyType').addClass('hidden');
        $card.find('.beneficiaryBankCompanyActivity').addClass('hidden');
        $card.find('.beneficiaryemail').addClass('hidden');
        $card.find('.beneficiarytelephone').addClass('hidden');
        $card.find('.benefeciaryAddress').addClass('hidden');
        $card.find('.beneficiarystreetName').addClass('hidden');
        $card.find('.beneficiaryprovinceZAR').addClass('hidden');
        $card.find('.beneficiarycityZAR').addClass('hidden');
        $card.find('.beneficiarypostCodeZAR').addClass('hidden');
        $card.find('.beneficiarycity').addClass('hidden');
        $card.find('.beneficiarypostCode').addClass('hidden');
        $card.find('.bankingdetails').addClass('hidden');
        $card.find('.beneficiaryBankName').addClass('hidden');
        $card.find('.beneficiaryBankBranchName').addClass('hidden');
        $card.find('.beneficiaryBankAccountHolderName').addClass('hidden');

        $card.find('.beneficiaryBankAccountNumber').addClass('hidden');
        $card.find('.beneficiaryBankCPF').addClass('hidden');
        $card.find('.beneficiaryBankRegistrationNumber').addClass('hidden');
        $card.find('.beneficiaryBankEarthVanPort').addClass('hidden');
        $card.find('.beneficiaryBankSortCode').addClass('hidden');
        $card.find('.beneficiaryBankBranchCode').addClass('hidden');
        $card.find('.beneficiaryBankAddress').addClass('hidden');

        $card.find('.beneficiaryBankIBAN').addClass('hidden');
        $card.find('.beneficiaryBankABA').addClass('hidden');
        $card.find('.beneficiaryBankPrefix').addClass('hidden');
        $card.find('.beneficiaryBankAgencyNumber').addClass('hidden');
        $card.find('.beneficiaryBankClabeNumber').addClass('hidden');
        $card.find('.beneficiaryBankClearingCode').addClass('hidden');

        $card.find('.beneficiaryBankCPFCNPINumber').addClass('hidden');
        $card.find('.beneficiaryBankHoldingBranch').addClass('hidden');
        $card.find('.beneficiaryBankIFSCCode').addClass('hidden');
        $card.find('.beneficiaryBankSuffix').addClass('hidden');
        $card.find('.beneficiaryBankTransitNumber').addClass('hidden');
        $card.find('.beneficiaryBankNibNumber').addClass('hidden');
        $card.find('.beneficiaryBankCashCollectionPassport').addClass('hidden');

        $card.find('.benefeciaryControls').addClass('hidden');

        $card.find('.beneficiaryComplete').addClass('hidden');

        $card.find('.beneficiaryCompleteDetails').addClass('hidden');

        $card.find('.beneficiarystreetNumber').addClass('hidden');

        $card.find('.beneficiaryBankCity').addClass('hidden');

        $card.find('.beneficiaryBankSwiftCode').addClass('hidden');

        $card.find('.beneficiaryBankContactLastName').addClass('hidden');
        $card.find('.beneficiaryBankCompanyName').addClass('hidden');

        $card.find('.beneficiaryBankBSBCode').addClass('hidden');







        callback();
    }

    function configureUIforSelectedCountry() {
        var selectedCountry = $card.find('.beneficiarycountrySelect').val();

        console.log(selectedCountry);
        resetUItoHidden(function () {
            $card.find('.beneficiarytype').removeClass('hidden');
            if (selectedCountry === 'ZAF') {

            }

        });




    }



    function populateCompanyTypeList() {
        //beneficiaryBankCompanyTypeSelect

        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getInstitutionalSectorList/', {}, function (err, response) {
            if (response) {
                if (response.returnData) {

                    beneficiaryBankCompanyTypeSelect = $card.find('.beneficiaryBankCompanyTypeSelect');

                    beneficiaryBankCompanyTypeSelect[0].options.length = 0;
                    beneficiaryBankCompanyTypeSelect.append($("<option />").val('Default').text('Select Company Type'));
                    response.returnData.forEach(function (entry) {

                        beneficiaryBankCompanyTypeSelect.append($("<option />").val(entry.institutionalID).text(entry.institutionalName));

                    });


                }
                else {
                    showError('An error occured whilst attempting to obtain the Industrial Type List: ' + response.message);
                }
                hideLoading();


            }
            else {
                showError('An error occured whilst attempting to obtain the Industrial Type List: ' + err);
                hideLoading();
            }
        });

        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getIndustrialClassificationList/', {}, function (err, response) {
            if (response) {
                if (response.returnData) {

                    beneficiaryBankCompanyActivitySelect = $card.find('.beneficiaryBankCompanyActivitySelect');

                    beneficiaryBankCompanyActivitySelect[0].options.length = 0;
                    beneficiaryBankCompanyActivitySelect.append($("<option />").val('Default').text('Select Company Activity'));
                    response.returnData.forEach(function (entry) {

                        beneficiaryBankCompanyActivitySelect.append($("<option />").val(entry.classificationID).text(entry.classificationName));

                    });


                }
                else {
                    showError('An error occured whilst attempting to obtain the Industrial Classification: ' + response.message);
                }
                hideLoading();


            }
            else {
                showError('An error occured whilst attempting to obtain the Industrial Classification: ' + err);
                hideLoading();
            }
        });

    }

    function getZAFInformation_CitySuburbPostalCode() {

        var provinceID = $card.find('.beneficiaryprovinceZARSelect').val();
        var cityName = $card.find('.beneficiarycityZARSelect').val();
        var suburb = $card.find('.beneficiarysuburbZARSelect').val();
        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getZAFSuburbPostCode/', { provinceID: provinceID, cityName: cityName, suburb: suburb }, function (err, response) {
            if (response) {
                if (response.returnData) {

                    beneficiarypostCodeZARSelect = $card.find('.beneficiarypostCodeZARSelect');

                    beneficiarypostCodeZARSelect[0].options.length = 0;
                    beneficiarypostCodeZARSelect.append($("<option />").val('Default').text('Select Postal Code'));
                    response.returnData.forEach(function (entry) {

                        beneficiarypostCodeZARSelect.append($("<option />").val(entry.postCode).text(entry.postCode));

                    });

                    beneficiarypostCodeZARSelect[0].options.selectedIndex = 1;

                }
                else {
                    showError('An error occured whilst attempting to obtain the ZAF Postal Code List: ' + response.message);
                }
                hideLoading();


            }
            else {
                showError('An error occured whilst attempting to obtain the ZAF Postal Code List: ' + err);
                hideLoading();
            }
        });

    }



    function getZAFInformation_CitySuburb() {

        var provinceID = $card.find('.beneficiaryprovinceZARSelect').val();
        var cityName = $card.find('.beneficiarycityZARSelect').val();
        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getZAFCitySuburbList/', { provinceID: provinceID, cityName: cityName }, function (err, response) {
            if (response) {
                if (response.returnData) {

                    beneficiarysuburbZARSelect = $card.find('.beneficiarysuburbZARSelect');


                    beneficiarysuburbZARSelect[0].options.length = 0;
                    beneficiarysuburbZARSelect.append($("<option />").val('Default').text('Select Suburb'));
                    response.returnData.forEach(function (entry) {

                        beneficiarysuburbZARSelect.append($("<option />").val(entry.suburb).text(entry.suburb));

                    });



                }
                else {
                    showError('An error occured whilst attempting to obtain the ZAF Suburb List: ' + response.message);
                }
                hideLoading();


            }
            else {
                showError('An error occured whilst attempting to obtain the ZAF Suburb List: ' + err);
                hideLoading();
            }
        });

    }

    function getZAFInformation_ProvinceCity() {

        var provinceID = $card.find('.beneficiaryprovinceZARSelect').val();
        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getZAFProvinceCityList/', { provinceID: provinceID }, function (err, response) {
            if (response) {
                if (response.returnData) {

                    beneficiarycityZARSelect = $card.find('.beneficiarycityZARSelect');


                    beneficiarycityZARSelect[0].options.length = 0;
                    beneficiarycityZARSelect.append($("<option />").val('Default').text('Select City'));
                    response.returnData.forEach(function (entry) {

                        beneficiarycityZARSelect.append($("<option />").val(entry.city).text(entry.city));

                    });



                }
                else {
                    showError('An error occured whilst attempting to obtain the ZAF Province List: ' + response.message);
                }
                hideLoading();


            }
            else {
                showError('An error occured whilst attempting to obtain the ZAF Province List: ' + err);
                hideLoading();
            }
        });

    }



    function getZAFInformation_Province() {
        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getZAFCountryProvinceList/', {}, function (err, response) {
            if (response) {
                if (response.returnData) {

                    beneficiaryprovinceZARSelect = $card.find('.beneficiaryprovinceZARSelect');
                    beneficiaryprovinceZARSelect[0].options.length = 0;
                    beneficiaryprovinceZARSelect.append($("<option />").val('Default').text('Select Province'));
                    response.returnData.forEach(function (entry) {
                        beneficiaryprovinceZARSelect.append($("<option />").val(entry.id).text(entry.provinceName));
                    });
                }
                else {
                    showError('An error occured whilst attempting to obtain the ZAF Province List: ' + response.message);
                }
                hideLoading();


            }
            else {
                showError('An error occured whilst attempting to obtain the ZAF Province List: ' + err);
                hideLoading();
            }
        });

    }

    $card.find('.beneficiarycurrencySelect').on('change', function () {
        displayLoading();
        console.log('Currency Changed');
        getCountryPayOutOptions();
        $card.find('.beneficiarypayoutmethod').removeClass('hidden');
        hideLoading();
        var selectedCountry = $card.find('.beneficiarycountrySelect').val();
        if (selectedCountry == 'NGA') {
            $card.find('.beneficiaryBankNameSelect').addClass('hidden');
        } else {
            getBankNameOptions();

        }


    });

    $card.find('.beneficiaryBankNameSelect').on('change', function () {
        $card.find('.beneficiaryBankNametxt').val($card.find('.beneficiaryBankNameSelect').val());


    });

    function getBankNameOptions() {
        var request = {
            beneficiaryCurrencyCode: $card.find('.beneficiarycurrencySelect').val(),
            beneficiaryCountryCode: $card.find('.beneficiarycountrySelect').val()

        }

        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getBeneficiaryBankNameList/', request, function (err, response) {
            if (response) {
                console.log(response);
                if (response.returnData) {
                    console.log(response.returnData);
                    $card.find('.beneficiaryBankNametxt').addClass('hidden');
                    beneficiaryBankNameSelect = $card.find('.beneficiaryBankNameSelect');
                    if (beneficiaryBankNameSelect[0])
                        beneficiaryBankNameSelect[0].options.length = 0;
                    beneficiaryBankNameSelect.append($("<option />").val('Default').text('Select Bank'));
                    response.returnData.forEach(function (entry) {
                        beneficiaryBankNameSelect.append($("<option />").val(entry.bankName).text(entry.bankName));
                    });


                }
                else {
                    $card.find('.beneficiaryBankNametxt').removeClass('hidden');
                    $card.find('.beneficiaryBankNameSelect').addClass('hidden');
                }
            }
            else {
                $card.find('.beneficiaryBankNametxt').removeClass('hidden');
                $card.find('.beneficiaryBankNameSelect').addClass('hidden');
            }
        });



    }

    $card.find('.idtypeSelect').on('change', function () {
        displayLoading();
        var idType = $card.find('.idtypeSelect').val();
        if (idType === 'SAIDNumber') {
            $card.find('.beneficiaryid').removeClass('hidden');
            $card.find('.beneficiarydateofbirth').addClass('hidden');
            $card.find('.beneficiaryforeignid').addClass('hidden');
            $card.find('.beneficiaryforeignidcountry').addClass('hidden');

        }
        else if (idType === 'ForeignIDNumber') {
            $card.find('.beneficiaryid').addClass('hidden');
            $card.find('.beneficiarytemporaryresidentid').addClass('hidden');
            $card.find('.beneficiarydateofbirth').removeClass('hidden');
            $card.find('.beneficiaryforeignid').removeClass('hidden');
            $card.find('.beneficiaryforeignidcountry').removeClass('hidden');
        }

        else if (idType === 'TemporaryResidentNumber') {
            $card.find('.beneficiarydateofbirth').removeClass('hidden');
            $card.find('.beneficiaryforeignid').removeClass('hidden');
            $card.find('.beneficiarytemporaryresidentid').removeClass('hidden');

        }
        hideLoading();

    });

    $card.find('.beneficiarypayoutmethodSelect').on('change', function () {
        displayLoading();

        //locals.payoutoptions;

        /*
            Check if Cash Payout On-the-fly
        */

        var selectedIndex = $card.find('.beneficiarypayoutmethodSelect')[0].options.selectedIndex - 1;
        console.log(selectedIndex);
        console.log($card.find('.beneficiarypayoutmethodSelect').val());
        console.log(locals.payoutoptions[selectedIndex]);
        if (locals.payoutoptions[selectedIndex]) {
            if (locals.payoutoptions[selectedIndex].providerType) {
                locals.providerType=locals.payoutoptions[selectedIndex].providerType;
            }
        }
        var cont = true;
        if ($card.find('.beneficiarypayoutmethodSelect').val() == '3') {
            
            if (locals.payoutoptions[selectedIndex]) {
                if (locals.payoutoptions[selectedIndex].payoutOption)
                    if (locals.payoutoptions[selectedIndex].payoutOption != '0') {
                        
                        resetUItoHidden(function () {
                            $card.find('.beneficiaryPayoutMethodNotRequired').removeClass('hidden');
                            $card.find('.beneficiarycountry').removeClass('hidden');
                            $card.find('.beneficiaryCurrencyLabel').removeClass('hidden');
                            $card.find('.beneficiarycurrency').removeClass('hidden');
                            $card.find('.beneficiarypayoutmethod').removeClass('hidden');

                        })
                        cont = false;

                    }
                    else {
                        $card.find('.beneficiaryPayoutMethodNotRequired').addClass('hidden');
                    }
                else {
                    $card.find('.beneficiaryPayoutMethodNotRequired').addClass('hidden');
                }

            }
            else {

            }

        } else {
            $card.find('.beneficiaryPayoutMethodNotRequired').addClass('hidden');

        }


        if (cont) {
            resetUItoHidden(function () {
                $card.find('.beneficiarycountry').removeClass('hidden');
                $card.find('.beneficiaryCurrencyLabel').removeClass('hidden');
                $card.find('.beneficiarycurrency').removeClass('hidden');
                $card.find('.beneficiarypayoutmethod').removeClass('hidden');
                $card.find('.beneficiarytype').removeClass('hidden');
            });


            getBeneficiaryTypeList();


            $card.find('.beneficiarytype').removeClass('hidden');
        }


        hideLoading();




    });

    function saveClientState(progressState) {

        console.log('Saving Client State');

        locals.lastSaveDateTimeStamp = new Date().getTime();
        card.state.save({
            localData: locals
        });


    }

    var enabledCountries = [
        'COD',
        'BWP',
        'ZAF',
        'CPV',
        'CIV',
        'ETH',
        'GMB',
        'GHA',
        'KEN',
        'LSO',
        'MDG',
        'MWI',
        'MLI',
        'MUS',
        'MAR',
        'MOZ',
        'NER',
        'NGA',
        'RWA',
        'MAR',
        'SEN',
        'SYC',
        'SLE',
        'SWZ',
        'TZA',
        'TGO',
        'UGA',
        'ZWE',
        'USA',
        'CAN',
        'IND',
        'AUS',
        'NZL',
        'CHE',
        'FRA',
        'GBR',
        'IRL'

    ]


    $card.find('.beneficiarytypeSelect').on('change', function () {

        displayLoading();

        $card.find('.beneficiaryBankContactFirstName').addClass('hidden');
        $card.find('.beneficiaryBankContactLastName').addClass('hidden');
        $card.find('.beneficiaryBankCompanyType').addClass('hidden');
        $card.find('.beneficiaryFirstName').addClass('hidden');
        $card.find('.beneficiaryLastName').addClass('hidden');
        $card.find('.beneficiaryIDType').addClass('hidden');
        $card.find('.beneficiaryid').addClass('hidden');
        $card.find('.beneficiaryBankCashCollectionPassport').addClass('hidden');
        $card.find('.beneficiarytemporaryresidentid').addClass('hidden');
        $card.find('.beneficiarydateofbirth').addClass('hidden');
        $card.find('.beneficiaryforeignid').addClass('hidden');
        $card.find('.beneficiaryforeignidcountry').addClass('hidden');
        $card.find('.beneficiarygenderSelect').addClass('hidden');

        $card.find('.beneficiaryforeignidcountry').addClass('hidden');
        $card.find('.beneficiarygenderSelect').addClass('hidden');

        $card.find('.beneficiaryBankCompanyType').addClass('hidden');
        $card.find('.beneficiaryBankRegistrationNumber').addClass('hidden');
        $card.find('.beneficiaryBankCompanyName').addClass('hidden');




        var benType = $card.find('.beneficiarytypeSelect').val();
        var sourceCountry = $card.find('.beneficiarycountrySelect').val();
        var payoutmethod = $card.find('.beneficiarypayoutmethodSelect').val();
        console.log(sourceCountry + '/' + benType + '/' + payoutmethod);

        if ($card.find('.beneficiarypayoutmethodSelect').val() === '3') { //Cash Collection
            $card.find('.beneficiaryid').removeClass('hidden');
            $card.find('.beneficiaryBankCashCollectionPassport').removeClass('hidden');
        }
        else if ($card.find('.beneficiarypayoutmethodSelect').val() === '7') { //Mobile Wallet

        }

        else {
            $card.find('.bankingdetails').removeClass('hidden');
            $card.find('.beneficiaryBankAccountNumber').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');

            $card.find('.benefeciaryControls').removeClass('hidden');
            $card.find('.beneficiaryBankAccountHolderName').removeClass('hidden');

        }

        $card.find('.beneficiaryDetails').removeClass('hidden');

        $card.find('.beneficiaryemail').removeClass('hidden');
        $card.find('.beneficiarystreetNumber').removeClass('hidden');
        $card.find('.beneficiarystreetName').removeClass('hidden');
        $card.find('.beneficiarytelephone').removeClass('hidden');

        if (sourceCountry != 'ZAF') {
            $card.find('.beneficiarycity').removeClass('hidden');
            $card.find('.beneficiarypostCode').removeClass('hidden');
        }


        if (benType === '1') { //Person

            $card.find('.beneficiaryFirstName').removeClass('hidden');
            $card.find('.beneficiaryLastName').removeClass('hidden');

            $card.find('.beneficiaryFirstName').removeClass('hidden');





        } else {

            $card.find('.beneficiaryBankContactFirstName').removeClass('hidden');
            $card.find('.beneficiaryBankContactLastName').removeClass('hidden');

            if ($card.find('.beneficiarypayoutmethodSelect').val() === '3') { //Cash Collection
                $card.find('.beneficiaryid').removeClass('hidden');
                $card.find('.beneficiaryBankCashCollectionPassport').removeClass('hidden');
            }

            $card.find('.beneficiaryBankCompanyType').removeClass('hidden');
            $card.find('.beneficiaryBankCompanyActivity').removeClass('hidden');

            $card.find('.beneficiaryBankRegistrationNumber').removeClass('hidden');
            $card.find('.beneficiaryBankCompanyName').removeClass('hidden');
            $card.find('.benefeciaryControls').removeClass('hidden');

        }

        if (sourceCountry === 'COD') {
            populateForm_COD(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'BWP') {
            populateForm_BWP(benType, payoutmethod, function () { });
        }


        if (sourceCountry === 'ZAF') {
            populateForm_ZAF(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'CPV') {
            populateForm_CPV(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'CIV') {
            populateForm_CIV(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'ETH') {
            populateForm_ETH(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'GMB') {
            populateForm_GMB(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'GHA') {
            populateForm_GHA(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'KEN') {
            populateForm_KEN(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'LSO') {
            populateForm_LSO(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'MDG') {
            populateForm_LSO(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'MWI') {
            populateForm_MWI(benType, payoutmethod, function () { });
        }


        if (sourceCountry === 'MLI') {
            populateForm_MLI(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'MUS') {
            populateForm_MUS(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'MAR') {
            populateForm_MUS(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'MOZ') {
            populateForm_MOZ(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'NER') {
            populateForm_NER(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'NGA') {
            populateForm_NGA(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'RWA') {
            populateForm_RWA(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'SEN') {
            populateForm_SEN(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'SYC') {
            populateForm_SYC(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'SLE') {
            populateForm_SLE(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'SWZ') {
            populateForm_SWZ(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'TZA') {
            populateForm_TZA(benType, payoutmethod, function () { });
        }


        if (sourceCountry === 'TGO') {
            populateForm_TGO(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'UGA') {
            populateForm_UGA(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'ZWE') {
            populateForm_ZWE(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'USA') {
            populateForm_USA(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'CAN') {
            populateForm_CAN(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'IND') {
            populateForm_IND(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'AUS') {
            populateForm_AUS(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'NZL') {
            populateForm_NZL(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'CHE') {
            populateForm_CHE(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'GBR') {
            populateForm_GBR(benType, payoutmethod, function () { });
        }

        if (sourceCountry === 'IRL') {
            populateForm_IRL(benType, payoutmethod, function () { });
        }
        hideLoading();
    });

    function populateForm_GBR(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');
        }


        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_IRL(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');


        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');





        }



        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }


    function populateForm_CHE(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');


            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankIBAN').removeClass('hidden');
            $card.find('.beneficiaryBankSortCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankIBAN').removeClass('hidden');
            $card.find('.beneficiaryBankSortCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');


        }



        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }



    function populateForm_NZL(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');


        }



        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_AUS(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankBSBCode').removeClass('hidden');
        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankBSBCode').removeClass('hidden');

        }



        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_IND(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankIFSCCode').removeClass('hidden');
        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankIFSCCode').removeClass('hidden');

        }



        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_CAN(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankTransitNumber').removeClass('hidden');
        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankTransitNumber').removeClass('hidden');

        }


        $card.find('.beneficiaryBankCompanyType').addClass('hidden');
        $card.find('.beneficiaryBankCompanyActivity').addClass('hidden');


        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_USA(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankBIC').removeClass('hidden');
            $card.find('.beneficiaryBankABA').removeClass('hidden');
        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankBIC').removeClass('hidden');
            $card.find('.beneficiaryBankABA').removeClass('hidden');

        }



        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_ZWE(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');




        }

        else if (payoutmethod == 7) { //Mobile Wallet
            $card.find('.beneficiaryid').removeClass('hidden');

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');

        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_ZMB(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankSortCode').removeClass('hidden');




        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankSortCode').removeClass('hidden');

        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }


    function populateForm_UGA(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');

            $card.find('.beneficiaryBankContactFirstName').addClass('hidden');
            $card.find('.beneficiaryBankContactLastName').addClass('hidden');
        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankContactFirstName').addClass('hidden');
            $card.find('.beneficiaryBankContactLastName').addClass('hidden');

        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }


    function populateForm_TGO(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');




        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');

        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_TZA(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');




        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');

        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }


    function populateForm_SWZ(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');

            //

            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');


        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_SLE(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');

        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_SYC(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');


        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_SEN(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');



            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');


        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }


    function populateForm_RWA(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');



            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');


        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populatebankCodeSelection() {
        card.proxy.post('http://127.0.0.1:3100/e4f/getBankEntityCode/', { providerType:'NGN::Bank' }, function (err, response) {
            
                    if (response) {
                        if (response.returnData) {
                            var bankCodeSelection = $card.find('.beneficiaryBankCodeSelect');
                            bankCodeSelection[0].options.length = 0;
                            bankCodeSelection.append($("<option />").val('DEFAULT').text('Bank Code'));
                            console.log(response.returnData);
                            
                            response.returnData.forEach(function (entry) {
            
                                bankCodeSelection = $card.find('.beneficiaryBankCodeSelect');
                                bankCodeSelection.append($("<option />").val(entry.entityCode).text(entry.bankName + '('+entry.entityCode+')'));
                            });
                            
            
                            /*
                                               
                            */
                        }
            
                    }
                });
    }


    function populateForm_NGA(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').addClass('hidden');
            //$card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankCode').removeClass('hidden');
            $card.find('.beneficiaryBankCodetxt').addClass('hidden');
            $card.find('.beneficiaryBankCodeSelect').removeClass('hidden');
            populatebankCodeSelection();


        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');           
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_NER(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');



            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');


        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');



            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_NAD(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');



            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');

            //


        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');



            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_MOZ(entityType, payoutmethod, callback) {
        console.log(payoutmethod);
        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');



            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankNibNumber').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');

            //


        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');



            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankNibNumber').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }


    function populateForm_MAR(entityType, payoutmethod, callback) {
        console.log(payoutmethod);
        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');



            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');


        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');



            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }


    function populateForm_MUS(entityType, payoutmethod, callback) {
        console.log(payoutmethod);
        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');




            $card.find('.beneficiaryBankIBAN').removeClass('hidden');


        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');




            $card.find('.beneficiaryBankIBAN').removeClass('hidden');
        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_MLI(entityType, payoutmethod, callback) {
        console.log(payoutmethod);
        if ((entityType == 1) && (payoutmethod != 3)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankSortCode').removeClass('hidden');
            $card.find('.beneficiaryBankCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

        }

        else if (payoutmethod != 3) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankSortCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_MWI(entityType, payoutmethod, callback) {
        console.log(payoutmethod);
        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchName').removeClass('hidden');
            //

            //beneficiaryBankAccountType



        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');



        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }



    function populateForm_MDG(entityType, payoutmethod, callback) {
        if (entityType == 1) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankIBAN').removeClass('hidden');
            //beneficiaryBankIBAN

        }

        else {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankIBAN').removeClass('hidden');

        }

        $card.find('.benefeciaryControls').removeClass('hidden');

        callback();


    }

    function populateForm_BWP(entityType, payoutmethod, callback) {
        if (entityType == 1) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankSortCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


        }

        else {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankSortCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');


        }

        $card.find('.benefeciaryControls').removeClass('hidden');

        callback();


    }

    function populateForm_KEN(entityType, payoutmethod, callback) {
        console.log(payoutmethod);
        if ((entityType == 1) && (payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchName').removeClass('hidden');

        }

        else if (payoutmethod == 7) { //Mobile Wallet

        }

        else if ((payoutmethod != 3) && (payoutmethod != 7)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');
            $card.find('.beneficiaryBankBranchName').removeClass('hidden');

        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_LSO(entityType, payoutmethod, callback) {

        if ((entityType == 1) && (payoutmethod != 3)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankIBAN').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
        }

        else if (payoutmethod != 3) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

            $card.find('.beneficiaryBankIBAN').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }


    function populateForm_GHA(entityType, payoutmethod, callback) {
        console.log(payoutmethod);
        if ((entityType == 1) && (payoutmethod != 3)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');

            $card.find('.beneficiaryBankCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

        }

        else if (payoutmethod != 3) {
            $card.find('.beneficiaryBankName').removeClass('hidden');

            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_GMB(entityType, payoutmethod, callback) {
        console.log(payoutmethod);
        if ((entityType == 1) && (payoutmethod != 3)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');

            $card.find('.beneficiaryBankSortCode').removeClass('hidden');
            $card.find('.beneficiaryBankCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

        }

        else if (payoutmethod != 3) {
            $card.find('.beneficiaryBankName').removeClass('hidden');

            $card.find('.beneficiaryBankSortCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_ETH(entityType, payoutmethod, callback) {
        console.log(payoutmethod);
        if ((entityType == 1) && (payoutmethod != 3)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');

            $card.find('.beneficiaryBankSortCode').removeClass('hidden');
            $card.find('.beneficiaryBankCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

        }

        else if (payoutmethod != 3) {
            $card.find('.beneficiaryBankName').removeClass('hidden');

            $card.find('.beneficiaryBankSortCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();

    }

    function populateForm_COD(entityType, payoutmethod, callback) {

        $card.find('.beneficiaryBankName').removeClass('hidden');
        $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
        $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
        $card.find('.beneficiaryBankSortCode').removeClass('hidden');
        $card.find('.beneficiaryBankCode').removeClass('hidden');
        $card.find('.beneficiaryBankCity').removeClass('hidden');

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();


    }

    function populateForm_CPV(entityType, payoutmethod, callback) {

        $card.find('.beneficiaryBankName').removeClass('hidden');
        $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
        $card.find('.beneficiaryBankSortCode').removeClass('hidden');
        $card.find('.beneficiaryBankCode').removeClass('hidden');
        $card.find('.beneficiaryBankCity').removeClass('hidden');

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();


    }

    function populateForm_CIV(entityType, payoutmethod, callback) {
        console.log(payoutmethod);
        if ((entityType == 1) && (payoutmethod != 3)) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankSortCode').removeClass('hidden');
            $card.find('.beneficiaryBankCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

        }

        else if (payoutmethod != 3) {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankSwiftCode').removeClass('hidden');
            $card.find('.beneficiaryBankSortCode').removeClass('hidden');
            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            $card.find('.beneficiaryBankCity').removeClass('hidden');

        }

        $card.find('.benefeciaryControls').removeClass('hidden');
        callback();


    }

    function getBankAccountTypeList() {
        /*
                beneficiaryBankAccountTypeSelect = $card.find('.beneficiaryBankAccountTypeSelect');
                beneficiaryBankAccountTypeSelect[0].options.length = 0;
                beneficiaryBankAccountTypeSelect.append($("<option />").val('Current').text('Current'));*/
        /*
        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getZAFBankAccountTypeList/', {}, function (err, response) {
            if (response) {
                if (response.returnData) {
                    beneficiaryBankAccountTypeSelect = $card.find('.beneficiaryBankAccountTypeSelect');
                    beneficiaryBankAccountTypeSelect[0].options.length = 0;
                    beneficiaryBankAccountTypeSelect.append($("<option />").val('Current').text('Current'));
                    response.returnData.forEach(function (entry) {
                        beneficiaryBankAccountTypeSelect.append($("<option />").val(entry.bankAccountTypeName).text(entry.bankAccountTypeName));
                    });
                }
                else {
                    showError('An error occured whilst attempting to obtain the Bank Account Type: ' + response.message);
                }
                hideLoading();
            }
            else {
                showError('An error occured whilst attempting to obtain the Bank Account Type: ' + err);
                hideLoading();
            }
        });*/

    }




    function populateForm_ZAF(entityType, payoutmethod, callback) {

        if (entityType == 1) {
            $card.find('.beneficiaryIDType').removeClass('hidden');
            $card.find('.idtypeSelect').change();
            $card.find('.idtypeSelect').selectedIndex = 1;
            $card.find('.beneficiarygender').removeClass('hidden');
            $card.find('.benefeciaryAddress').removeClass('hidden');
            $card.find('.beneficiaryprovinceZAR').removeClass('hidden');
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankBranchName').removeClass('hidden');

            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            callback();
        }

        else {
            $card.find('.beneficiaryBankName').removeClass('hidden');
            $card.find('.beneficiaryBankBranchName').removeClass('hidden');
            $card.find('.beneficiaryBankAccountHolderName').removeClass('hidden');
            $card.find('.beneficiaryprovinceZAR').removeClass('hidden');

            $card.find('.beneficiaryBankAccountNumber').removeClass('hidden');

            $card.find('.beneficiaryBankBranchCode').removeClass('hidden');
            callback();
        }

        $card.find('.benefeciaryControls').removeClass('hidden');

        callback();

    }

    function getBeneficiaryTypeList() {
        var destinationCountryCode = $card.find('.beneficiarycountrySelect').val();
        var payOutMethod = $card.find('.beneficiarypayoutmethodSelect').val();

        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getBeneficiaryTypeList/', { destinationCountryCode: destinationCountryCode, payoutMethodValue: payOutMethod }, function (err, response) {
            if (response) {
                if (response.returnData) {
                    beneficiarytypeSelect = $card.find('.beneficiarytypeSelect');
                    beneficiarytypeSelect[0].options.length = 0;
                    beneficiarytypeSelect.append($("<option />").val('Default').text('Beneficiary Type'));
                    response.returnData.forEach(function (entry) {
                        beneficiarytypeSelect.append($("<option />").val(entry.beneficiaryTypeValue).text(entry.beneficiaryTypeName));
                    });
                }
                else {
                    showError('An error occured whilst attempting to obtain the ZAF Province List: ' + response.message);
                }
                hideLoading();


            }
            else {
                showError('An error occured whilst attempting to obtain the ZAF Province List: ' + err);
                hideLoading();
            }
        });
    }

    function getCountryPayOutOptions() {
        //https://code.jquery.com/jquery-2.2.3.min.js

        var destinationCountryCode = $card.find('.beneficiarycountrySelect').val();
        var destinationCurrencyCode = $card.find('.beneficiarycurrencySelect').val();


        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayoutMethodList/', { destinationCountryCode: destinationCountryCode, destinationCurrencyCode: destinationCurrencyCode }, function (err, response) {
            if (response) {
                if (response.returnData) {
                    beneficiarypayoutmethod = $card.find('.beneficiarypayoutmethodSelect');
                    locals.payoutoptions = [];

                    beneficiarypayoutmethod[0].options.length = 0;
                    beneficiarypayoutmethod.append($("<option />").val('Default').text('Select Pay Out Method'));
                    response.returnData.forEach(function (entry) {
                        if (entry.payoutMethodName != 'AirTime TopUp') {
                            locals.payoutoptions.push(entry);
                            beneficiarypayoutmethod.append($("<option />").val(entry.payoutMethodValue).text(entry.payoutMethodName));
                        }



                    });

                    beneficiarypayoutmethod[0].selectedIndex = 1;
                    beneficiarypayoutmethod.change();


                }
                else {
                    showError('An error occured whilst attempting to obtain the country pay out options via the web service: ' + response.message);
                }
                hideLoading();


            }
            else {
                //showError('An error occured whilst attempting to obtain the country pay out options: ' + err);
                hideLoading();
            }
        });
    }


    function getCountryPayOutCurrency() {
        //https://code.jquery.com/jquery-2.2.3.min.js

        var srccountryCode = '';
        var srcCurrencyCode = '';
        var countryCode = $card.find('.beneficiarycountrySelect').val();


        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayoutCurrencyList/', { sourceCountryCode: srccountryCode, sourceCurrencyCode: srcCurrencyCode, destinationCountryCode: countryCode }, function (err, response) {
            if (response) {

                beneficiarycurrencySelect = $card.find('.beneficiarycurrencySelect');

                beneficiarycurrencySelect[0].options.length = 0;
                beneficiarycurrencySelect.append($("<option />").val("Default").text("Select Pay Out Currency"));
                if (response.returnData) {
                    response.returnData.forEach(function (entry) {

                        beneficiarycurrencySelect = $card.find('.beneficiarycurrencySelect');
                        beneficiarycurrencySelect.append($("<option />").val(entry.destinationCurrencyCode).text(entry.destinationCurrencyName));

                    });

                    beneficiarycurrencySelect[0].selectedIndex = 1;
                    beneficiarycurrencySelect.change();

                }


                else {
                    showError('An error occured whilst obtaining the currency options for the pay out country: ' + response.message);
                }
                hideLoading();


            }
            else {
                showError('An error occured whilst obtaining the currency options for the pay out country: ' + err);
                hideLoading();
            }
        });



    }

    function getPayOutCountryList() {

        displayLoading();

        card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getPayOutCountryList/', {}, function (err, response) {

            if (response) {
                if (response.returnData) {

                    var destinationCountries = response.returnData;
                    destinationCountries.sort(sortPayOutCountriesbyName);


                    beneficiaryforeignidcountrySelect = $card.find('.beneficiaryforeignidcountrySelect');
                    if (beneficiaryforeignidcountrySelect[0])
                        beneficiaryforeignidcountrySelect[0].options.length = 0;

                    beneficiarycountrySelect = $card.find('.beneficiarycountrySelect');
                    if (beneficiarycountrySelect[0])
                        beneficiarycountrySelect[0].options.length = 0;
                    beneficiarycountrySelect.append($("<option />").val('Default').text('Beneficiary Country'));
                    response.returnData.forEach(function (entry) {
                        if (enabledCountries.indexOf(entry.destinationCountryCode) >= 0) {

                            beneficiarycountrySelect = $card.find('.beneficiarycountrySelect');
                            beneficiaryforeignidcountrySelect = $card.find('.beneficiaryforeignidcountrySelect');
                            var $str = entry.destinationCountryName;
                            beneficiarycountrySelect.append($("<option />").val(entry.destinationCountryCode).text($str));
                            beneficiaryforeignidcountrySelect.append($("<option />").val(entry.destinationCountryCode).text($str));
                        }

                    });

                    hideLoading();
                }

                else {
                    hideLoading()
                }

            }
            else {
                hideLoading();
            }
        });

    }

    //
    $card.find('.confirmFinal').on('click', function () {
        createBeneficiary();
    })

    function removeNullsInObject(obj) {
        if (typeof obj === 'string') { return; }
        $.each(obj, function (key, value) {
            if (value === "" || value === null) {
                delete obj[key];
            } else if ($.isArray(value)) {
                if (value.length === 0) { delete obj[key]; return; }
                $.each(value, function (k, v) {
                    removeNullsInObject(v);
                });
            } else if (typeof value === 'object') {
                if (Object.keys(value).length === 0) {
                    delete obj[key]; return;
                }
                removeNullsInObject(value);
            }
        });
    }


    function createBeneficiary() {

        console.log($card.find('.beneficiaryBankAccountNumbertxt').val());
        var additionalRsaBeneficiary = '';
        var cashCollectionTransactionInformation = '';
        if ($card.find('.beneficiarycountrySelect').val() == "ZAF") {


            additionalRsaBeneficiary = {
                provinceId: $card.find('.beneficiaryprovinceZARSelect').val(),
                suburb: $card.find('.beneficiarysuburbZARSelect').val(),
                taxNumber: $card.find('.beneficiarycountrySelect').val(),
                foreignIDNumber: $card.find('.foreignidtxt').val(),
                foreignIDCountryCode: $card.find('.beneficiaryforeignidcountrySelect').val(),
                dateOfBirth: $card.find('.dateofbirthtxt').val(),
                passportCountry: $card.find('.beneficiaryforeignidcountrySelect').val(),
                tempResPermitNumber: $card.find('.temporaryresidentidtxt').val(),
                passportNumber: $card.find('.beneficiaryBankCashCollectionPassporttxt').val(),
                loanAuthorizationNumber: '',
                natureOfBusiness: ''
            }

            if (($card.find('.idtypeSelect').val() == "SAIDNumber") || ($card.find('.beneficiarytypeSelect').val() != '1')) {
                additionalRsaBeneficiary.foreignIDNumber = '';
                additionalRsaBeneficiary.foreignIDCountryCode = '';
                additionalRsaBeneficiary.passportCountry = '';

            }
        }


        if ($card.find('.beneficiarypayoutmethodSelect').val() == '3') {
            //populateCashPayoutInformation

            if ($card.find('.beneficiaryBankCashCollectionPassporttxt').val()) {
                cashCollectionTransactionInformation = {
                    passportNumber: $card.find('.beneficiaryBankCashCollectionPassporttxt').val()

                }
            }

            else {
                cashCollectionTransactionInformation = {
                    passportNumber: $card.find('.idtxt').val()
                }

            }



        }




        var createBeneficiaryRequest = {


            entityType: $card.find('.beneficiarytypeSelect').val(),
            beneficiaryFirstName: $card.find('.firstNametxt').val(),
            beneficiarySurname: $card.find('.lastNametxt').val(),
            idNumber: $card.find('.idtxt').val(),
            beneficiaryEmail: $card.find('.emailtxt').val(),
            providerType: locals.providerType,
            beneficiaryCurrencyCode: $card.find('.beneficiarycurrencySelect').val(),
            beneficiaryCountryCode: $card.find('.beneficiarycountrySelect').val(),
            type: $card.find('.beneficiarypayoutmethodSelect').val(), //getPayoutMethodList
            beneficiaryTelephone: $card.find('.telephonetxt').val(),
            bankingInformation: {
                bankName: $card.find('.beneficiaryBankNametxt').val(),
                branchName: $card.find('.beneficiaryBankBranchNametxt').val(),
                bankCity: $card.find('.beneficiaryBankCitytxt').val(),
                accountHolderName: $card.find('.beneficiaryBankAccountHolderNametxt').val(),
                accountType: 'Current',
                accountNumber: $card.find('.beneficiaryBankAccountNumbertxt').val(),
                bankCPF: $card.find('.beneficiaryBankCPFtxt').val(),
                correspondentBankDetails: '',
                registrationNumber: $card.find('.beneficiaryBankRegistrationNumbertxt').val(),
                companyName: $card.find('.beneficiaryBankCompanyNametxt').val(),
                referenceToAppear: 'E4F Money Transfers',
                earthportVanNumber: $card.find('.beneficiaryBankEarthVanPorttxt').val(),
                swiftCode: $card.find('.beneficiaryBankSwiftCodetxt').val(),
                sortCode: $card.find('.beneficiaryBankSortCodetxt').val(),
                branchCode: $card.find('.beneficiaryBankBranchCodetxt').val(),
                address: $card.find('.beneficiaryBankAddresstxt').val(),
                ibanNumber: $card.find('.beneficiaryBankIBANtxt').val(),
                bicCode: $card.find('.beneficiaryBankSwiftCode').val(),
                abaRouting: $card.find('.beneficiaryBankABAtxt').val(),
                bsbNumber: $card.find('.beneficiaryBankBSBCodetxt').val(),
                bankCode: $card.find('.beneficiaryBankCodetxt').val(),
                prefix: $card.find('.beneficiaryBankPrefixtxt').val(),
                bankAgencyNumber: $card.find('.beneficiaryBankAgencyNumbertxt').val(),
                clabeNumber: $card.find('.beneficmberiaryBankClabeNumbertxt').val(),
                clearingCode: $card.find('.beneficiaryBankClearingCodetxt').val(),
                cpfOrCnpjNumber: $card.find('.beneficiaryBankCPFCNPINumbertxt').val(),
                giroNumber: '',
                holdingBranch: $card.find('.beneficiaryBankHoldingBranchtxt').val(),
                ifscCode: $card.find('.beneficiaryBankIFSCCodetxt').val(),
                suffix: $card.find('.beneficiaryBankSuffixtxt').val(),
                transitNumber: $card.find('.beneficiaryBankTransitNumbertxt').val(),
                nibNumber: $card.find('.beneficiaryBambernkNibNumbetxtr').val(),
                additionalRsaBeneficiary: additionalRsaBeneficiary,
                contactFirstName: $card.find('.beneficiaryBankContactFirstNametxt').val(),
                contactLastName: $card.find('.beneficiaryBankContactLastNametxt').val(),
                companyType: $card.find('.beneficiaryBankCompanyTypeSelect').val(),
                companyActivity: $card.find('.beneficiaryBankCompanyActivitySelect').val(),
            },
            cashCollectionTransactionInformation: cashCollectionTransactionInformation
        }

        createBeneficiaryRequest.beneficiaryAddress = $card.find('.streetnumbertxt').val() + ' ' + $card.find('.streetnametxt').val();
        console.log($card.find('.beneficiarycountrySelect').val());
        if ($card.find('.beneficiarycountrySelect').val() == 'ZAF')
            createBeneficiaryRequest.transferReasonId = '184';

        if ($card.find('.beneficiarycountrySelect').val() == 'GBR') {
            createBeneficiaryRequest.bankingInformation.sortCode = $card.find('.beneficiaryBankBranchCodetxt').val();
        }


        if ($card.find('.beneficiarypostCodeZARSelect').val()) {
            createBeneficiaryRequest.beneficiaryPostCode = $card.find('.beneficiarypostCodeZARSelect').val();
        } else {
            createBeneficiaryRequest.beneficiaryPostCode = $card.find('.beneficiarypostCodetxt').val();
        }

        if ($card.find('.beneficiarycityZARSelect').val()) {
            createBeneficiaryRequest.beneficiaryCity = $card.find('.beneficiarycityZARSelect').val();

        }
        else {
            createBeneficiaryRequest.beneficiaryCity = $card.find('.beneficiarycitytxt').val();
        }

        if ($card.find('.beneficiarycountrySelect') == 'ZAF')
            createBeneficiaryRequest.gender = $card.find('.beneficiarygenderSelecttxt').val()
        else
            createBeneficiaryRequest.gender = '';

        removeNullsInObject(createBeneficiaryRequest);
        console.dir(createBeneficiaryRequest);

        validateData(function (hasError) {

            if (hasError) {

            }

            else {

                displayLoading();
                card.proxy.post('http://guinness.exchange4free.com:3000/e4f/createBeneficiary/', { createBeneficiaryRequest: createBeneficiaryRequest }, function (err, response) {

                    if (response) {

                        if (response.returnData) {
                            //Beneficiary Successfully Created
                            resetUItoHidden(function () {

                                $card.find('.beneficiarycountry').addClass('hidden');
                                $card.find('.beneficiaryCurrencyLabel').addClass('hidden');
                                $card.find('.beneficiarycurrency').addClass('hidden');
                                $card.find('.reasonfortransfer').addClass('hidden');
                                $card.find('.beneficiarypayoutmethod').addClass('hidden');
                                $card.find('.beneficiarytype').addClass('hidden');
                                $card.find('.beneficiaryComplete').removeClass('hidden');
                                $card.find('.beneficiaryCompleteDetails').removeClass('hidden');

                                if ($card.find('.beneficiarytypeSelect').val() == '1') {
                                    $card.find('.beneficiaryCompleteNametxt').val($card.find('.firstNametxt').val() + ' ' + $card.find('.lastNametxt').val());
                                    $card.find('.beneficiaryCompleteCountrytxt').val(selectedCountryInformation.countryName);
                                    $card.find('.beneficiaryCompleteAccountNumbertxt').val($card.find('.beneficiaryBankAccountNumbertxt').val());



                                    locals.completed = true;
                                    locals.beneficiaryAccountNumber = $card.find('.beneficiaryBankAccountNumbertxt').val();
                                    locals.beneficiaryName = $card.find('.firstNametxt').val() + ' ' + $card.find('.lastNametxt').val();
                                    locals.beneficiaryCountry = selectedCountryInformation.countryName;
                                    locals.beneficiaryAccountNumber = $card.find('.beneficiaryBankAccountNumbertxt').val();
                                    saveClientState();

                                }

                                else {
                                    $card.find('.beneficiaryCompleteNametxt').val($card.find('.beneficiaryBankCompanyNametxt').val());
                                    $card.find('.beneficiaryCompleteCountrytxt').val(selectedCountryInformation.countryName);
                                    $card.find('.beneficiaryCompleteAccountNumbertxt').val($card.find('.beneficiaryBankAccountNumbertxt').val());
                                    locals.completed = true;
                                    locals.beneficiaryName = $card.find('.beneficiaryBankCompanyNametxt').val();
                                    locals.beneficiaryCountry = selectedCountryInformation.countryName;
                                    locals.beneficiaryAccountNumber = $card.find('.beneficiaryBankAccountNumbertxt').val();
                                    saveClientState();

                                }

                                hideLoading();

                            })



                        }

                        else {
                            hideLoading();
                            showError('An error occured creating the beneficiary: ' + response.message);

                        }

                    }

                    else {

                        hideLoading();
                    }
                });

            }


        });


    }

    function validateData(callback) {

        var errorList = 'The following errors have been identified - please correct before proceeding:<br> ';

        var mobilenum = $card.find('.telephonetxt').val();
        var firstdigit = mobilenum.charAt(0);
        var email = $card.find('.emailtxt').val();
        console.log('lostfocus');

        if (((/^\d{13}$/.test(mobilenum)) && (firstdigit == '0')) || (/^\d{7}$/.test(mobilenum)) || (/^\d{8}$/.test(mobilenum)) || (/^\d{9}$/.test(mobilenum)) || (/^\d{10}$/.test(mobilenum)) || (/^\d{11}$/.test(mobilenum)) || (/^\d{12}$/.test(mobilenum))) {
            //console.log('Number Fine')
        } else {
            errorList += '<br>Mobile Number not valid. Please ensure no leading zero or country code.';
        }

        if (validateEmail(email)) {

        }
        else {
            errorList += '<br>Email Address is not valid. Please check your entered email address.';

        }


        if ($card.find('.beneficiaryBankIBAN').hasClass('hidden')) {

        }
        else {
            console.log('Checking IBAN')
            if (checkiban($card.find('.beneficiaryBankIBANtxt').val())) {

            }
            else {
                errorList += '<br>IBAN is not valid. Please check your entered IBAN.';
            }

        }

        var reasonforTransfer = $card.find('.reasonfortransferSelect').val();


        if (errorList != 'The following errors have been identified - please correct before proceeding:<br> ') {
            showError(errorList);
            callback(true);
        }
        else {
            callback(false);
        }
    }



    //Check IBAN




}



function getTransferReasonList() {

    var destCountry = $card.find('.beneficiarycountrySelect').val();

    card.proxy.post('http://guinness.exchange4free.com:3000/e4f/getTransferReasonList/', { destinationCountryCode: destCountry }, function (err, response) {

        if (response) {
            if (response.returnData) {
                reasonfortransferSelect = $card.find('.reasonfortransferSelect');
                reasonfortransferSelect[0].options.length = 0;
                reasonfortransferSelect.append($("<option />").val('DEFAULT').text('Reason for Transfer'));
                console.log(response.returnData);
                response.returnData.forEach(function (entry) {

                    reasonfortransferSelect = $card.find('.reasonfortransferSelect');
                    reasonfortransferSelect.append($("<option />").val(entry.transferReasonID).text(entry.transferReason));
                });

                /*
                                   
                */
            }

        }
    });

}

Array.prototype.in_array = function (value) {
    var found = false;
    for (var i = 0; i < this.length; i++) {
        if (this[i] == value) {
            found = i;
            break;
        }
    }
    return found;
}

// add ISO13616Prepare method to strings
String.prototype.ISO13616Prepare = function () {
    var isostr = this.toUpperCase();
    isostr = isostr.substr(4) + isostr.substr(0, 4);
    for (var i = 0; i <= 25; i++) {
        while (isostr.search(String.fromCharCode(i + 65)) != -1) {
            isostr = isostr.replace(String.fromCharCode(i + 65), String(i + 10));
        }
    }
    return isostr;
}

// add ISO7064Mod97_10 method to strings
String.prototype.ISO7064Mod97_10 = function () {
    var parts = Math.ceil(this.length / 7);
    var remainer = "";
    for (var i = 1; i <= parts; i++) {
        remainer = String(parseFloat(remainer + this.substr((i - 1) * 7, 7)) % 97);
    }

    return remainer;
}

// replacement of === for javascript version < 1.2
function is_ident(a, b) {
    var identical = false;
    if (typeof (a) == typeof (b)) {
        if (a == b) {
            identical = true;
        }
    }
    return identical;
}

// country codes, fixed length for those countries, inner structure, appliance of EU REGULATION 924/2009, IBAN requirement and IBAN example
var ilbced = new Array("AD", 24, "F04F04A12", "n", "n", "AD1200012030200359100100",
    "AE", 23, "F03F16", "n", "n", "AE070331234567890123456",
    "AL", 28, "F08A16", "n", "n", "AL47212110090000000235698741",
    "AT", 20, "F05F11", "y", "n", "AT611904300234573201",
    "BA", 20, "F03F03F08F02", "n", "n", "BA391290079401028494",
    "BE", 16, "F03F07F02", "y", "n", "BE68539007547034",
    "BG", 22, "U04F04F02A08", "y", "n", "BG80BNBG96611020345678",
    "BH", 22, "U04A14", "n", "n", "BH67BMAG00001299123456",
    "CH", 21, "F05A12", "n", "n", "CH9300762011623852957",
    "CR", 21, "F03F14", "n", "n", "CR0515202001026284066",
    "CY", 28, "F03F05A16", "y", "n", "CY17002001280000001200527600",
    "CZ", 24, "F04F06F10", "y", "n", "CZ6508000000192000145399",
    "DE", 22, "F08F10", "y", "n", "DE89370400440532013000",
    "DK", 18, "F04F09F01", "y", "n", "DK5000400440116243",
    "DO", 28, "A04F20", "n", "n", "DO28BAGR00000001212453611324",
    "EE", 20, "F02F02F11F01", "y", "n", "EE382200221020145685",
    "ES", 24, "F04F04F01F01F10", "y", "n", "ES9121000418450200051332",
    "FI", 18, "F06F07F01", "y", "n", "FI2112345600000785",
    "FO", 18, "F04F09F01", "n", "n", "FO6264600001631634",
    "FR", 27, "F05F05A11F02", "y", "n", "FR1420041010050500013M02606",
    "GB", 22, "U04F06F08", "y", "n", "GB29NWBK60161331926819",
    "GE", 22, "U02F16", "n", "n", "GE29NB0000000101904917",
    "GI", 23, "U04A15", "y", "n", "GI75NWBK000000007099453",
    "GL", 18, "F04F09F01", "n", "n", "GL8964710001000206",
    "GR", 27, "F03F04A16", "y", "n", "GR1601101250000000012300695",
    "HR", 21, "F07F10", "n", "n", "HR1210010051863000160",
    "HU", 28, "F03F04F01F15F01", "y", "n", "HU42117730161111101800000000",
    "IE", 22, "U04F06F08", "y", "n", "IE29AIBK93115212345678",
    "IL", 23, "F03F03F13", "n", "n", "IL620108000000099999999",
    "IS", 26, "F04F02F06F10", "y", "n", "IS140159260076545510730339",
    "IT", 27, "U01F05F05A12", "y", "n", "IT60X0542811101000000123456",
    "KW", 30, "U04A22", "n", "y", "KW81CBKU0000000000001234560101",
    "KZ", 20, "F03A13", "n", "n", "KZ86125KZT5004100100",
    "LB", 28, "F04A20", "n", "n", "LB62099900000001001901229114",
    "LI", 21, "F05A12", "y", "n", "LI21088100002324013AA",
    "LT", 20, "F05F11", "y", "n", "LT121000011101001000",
    "LU", 20, "F03A13", "y", "n", "LU280019400644750000",
    "LV", 21, "U04A13", "y", "n", "LV80BANK0000435195001",
    "MC", 27, "F05F05A11F02", "y", "n", "MC5811222000010123456789030",
    "ME", 22, "F03F13F02", "n", "n", "ME25505000012345678951",
    "MK", 19, "F03A10F02", "n", "n", "MK07250120000058984",
    "MR", 27, "F05F05F11F02", "n", "n", "MR1300020001010000123456753",
    "MT", 31, "U04F05A18", "y", "n", "MT84MALT011000012345MTLCAST001S",
    "MU", 30, "U04F02F02F12F03U03", "n", "n", "MU17BOMM0101101030300200000MUR",
    "NL", 18, "U04F10", "y", "n", "NL91ABNA0417164300",
    "NO", 15, "F04F06F01", "y", "n", "NO9386011117947",
    "PL", 28, "F08F16", "y", "y", "PL27114020040000300201355387",
    "PT", 25, "F04F04F11F02", "y", "n", "PT50000201231234567890154",
    "RO", 24, "U04A16", "y", "n", "RO49AAAA1B31007593840000",
    "RS", 22, "F03F13F02", "n", "n", "RS35260005601001611379",
    "SA", 24, "F02A18", "n", "y", "SA0380000000608010167519",
    "SE", 24, "F03F16F01", "y", "n", "SE4550000000058398257466",
    "SI", 19, "F05F08F02", "y", "n", "SI56191000000123438",
    "SK", 24, "F04F06F10", "y", "n", "SK3112000000198742637541",
    "SM", 27, "U01F05F05A12", "n", "n", "SM86U0322509800000000270100",
    "TN", 24, "F02F03F13F02", "n", "n", "TN5914207207100707129648",
    "TR", 26, "F05A01A16", "n", "y", "TR330006100519786457841326");
// we have currently # countries

var ctcnt = ilbced.length / 6;

// rearange country codes and related info
var ilbc = new Array();
for (j = 0; j < 6; j++) {
    for (i = 0; i < ctcnt; i++) {
        ilbc[ilbc.length] = ilbced[j + i * 6];
    }
}

// the magic core routine
function checkibancore(iban) {
    var standard = -1;
    illegal = /\W|_/; // contains chars other than (a-zA-Z0-9) 

    // TEST ILLEGAL CHARACTERS
    if (illegal.test(iban)) { return "0"; }

    else {

        illegal = /^\D\D\d\d.+/; // first chars are letter letter digit digit

        // CHECK FIRST 2 CHARACTERS
        if (illegal.test(iban) == false) { return "0"; }

        else {
            illegal = /^\D\D00.+|^\D\D01.+|^\D\D99.+/; // check digit are 00 or 01 or 99
            if (illegal.test(iban)) { return "0"; }

            else { // no, continue
                lofi = ilbc.slice(0, ctcnt).in_array(iban.substr(0, 2).toUpperCase()); // test if country respected
                if (is_ident(false, lofi)) { ctck = -1; lofi = 6; }  // country not respected
                else {
                    ctck = lofi; lofi = ilbc[lofi + ctcnt * 1];

                } // country respected

                // COUNTRY CODE NOT FOUND
                if (lofi == 6) {
                    lofi = iban.length;
                }  // but continue

                // COUNTRY CODE IS FOUND, WRONG STRING LENGTH
                if ((iban.length - lofi) != 0) { return "0"; } // yes, continue

                if (ctck >= 0) { illegal = buildtest("B04" + ilbc[ctck + ctcnt * 2], standard); } // fetch sub structure of respected country
                else { illegal = /.+/; } // or take care of not respected country

                if (illegal.test(iban) == false) { // fits sub structure to country

                    return "0";
                }

                else { // yes, continue
                    return iban.ISO13616Prepare().ISO7064Mod97_10();
                }
            }
        }
    }
} // calculate and return the remainer


// perform the check, 
function checkiban(iban) {
    if (checkibancore(iban) == "1") { return true }
    else { return false }
}


function buildtest(structure, kind) {
    var result = "";
    var testpattern = structure.match(/([ABCFLUW]\d{2})/g);

    var patterncount = testpattern.length;
    for (var i = 0; i < patterncount; ++i) {
        if (((kind >= 0) && (i != kind)) || (kind == -2)) {
            result += testpart(testpattern[i], "any");
        }
        else {
            result += testpart(testpattern[i], "standard");
        }
    }

    return new RegExp(result);
}

function testpart(pattern, kind) {
    var testpattern = "(";
    if (kind == "any") {
        testpattern += ".";
    }
    else {
        testpattern += "[";
        if (kind == "reverse") {
            testpattern += "^";
        }
        switch (pattern.substr(0, 1)) {
            case "A": testpattern += "0-9A-Za-z"; break;
            case "B": testpattern += "0-9A-Z"; break;
            case "C": testpattern += "A-Za-z"; break;
            case "F": testpattern += "0-9"; break;
            case "L": testpattern += "a-z"; break;
            case "U": testpattern += "A-Z"; break;
            case "W": testpattern += "0-9a-z"; break;
        }
        testpattern += "]";
    }
    if (((pattern.substr(1, 2) * 1) > 1) && (kind != "reverse")) {
        testpattern += "{" + String(pattern.substr(1, 2) * 1) + "}";
    }
    testpattern += ")";
    return testpattern;
}

