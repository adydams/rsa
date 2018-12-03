angular.module('mainApp')
    .factory('editProfileService', ['$http',
        function ($http) {
            let factory = {};
            factory.editUserProfile = async function (updateUserDetails, userId) {
                var userEditObject = {
                    email: updateUserDetails.email,
                    phoneNumber: updateUserDetails.phoneNumber,
                    accountNumber: updateUserDetails.accountNumber,
                    bankName: updateUserDetails.bankName
                }
                let url = `http://localhost:3000/users/update/${userId}`
                var userDetails = {};
                await $http.post(url, userEditObject).then(function (response) {
                    if (response.data.status == true) {
                        userDetails = response.data.user;

                        var userId = userDetails.userId;
                        var account_number = userDetails.accountNumber;
                        var bankName = userDetails.bankName;
                        var account_bank = userDetails.userId

                        //getting the bank_name codes
                        var bankCode = function (bankName) {
                            if (bankName == "ACCESS BANK NIGERIA") {
                                return account_bank = "044"
                            }
                            if (bankName == "ACCESS MOBILE") {
                                return account_bank = "323"
                            }
                            if (bankName == "AFRIBANK NIGERIA PLC") {
                                return account_bank = "014"
                            }
                            if (bankName == "Aso Savings and Loans") {
                                return account_bank = "401"
                            }
                            if (bankName == "DIAMOND BANK PLC") {
                                return account_bank = "063"
                            }
                            if (bankName == "Ecobank Mobile") {
                                return account_bank = "307"
                            }
                            if (bankName == "ECOBANK NIGERIA PLC") {
                                return account_bank = "050"
                            }
                            if (bankName == "ENTERPRISE BANK LIMITED") {
                                return account_bank = "084"
                            }
                            if (bankName == "FBN MOBILE") {
                                return account_bank = "309"
                            }
                            if (bankName == "FIDELITY BANK PLC") {
                                return account_bank = "070"
                            }
                            if (bankName == "FIRST BANK PLC") {
                                return account_bank = "011"
                            }
                            if (bankName == "FIRST CITY MONUMENT BANK PLC") {
                                return account_bank = "214"
                            }
                            if (bankName == "GTBank Mobile Money") {
                                return account_bank = "315"
                            }
                            if (bankName == "GTBANK PLC") {
                                return account_bank = "058"
                            }
                            if (bankName == "HERITAGE BANK") {
                                return account_bank = "030"
                            }
                            if (bankName == "KEYSTONE BANK PLC") {
                                return account_bank = "082"
                            }
                            if (bankName == "Parkway") {
                                return account_bank = "311"
                            }
                            if (bankName == "PAYCOM") {
                                return account_bank = "305"
                            }
                            if (bankName == "SKYE BANK PLC") {
                                return account_bank = "076"
                            }
                            if (bankName == "STANBIC IBTC BANK PLC") {
                                return account_bank = "221"
                            }
                            if (bankName == "Stanbic Mobile") {
                                return account_bank = "304"
                            }
                            if (bankName == "STANDARD CHARTERED BANK NIGERIA LIMITED") {
                                return account_bank = "068"
                            }
                            if (bankName == "STERLING BANK PLC") {
                                return account_bank = "232"
                            }
                            if (bankName == "UNION BANK OF NIGERIA PLC") {
                                return account_bank = "032"
                            }
                            if (bankName == "UNITED BANK FOR AFRICA PLC") {
                                return account_bank = "033"
                            }
                            if (bankName == "UNITY BANK PLC") {
                                return account_bank = "215"
                            }
                            if (bankName == "WEMA BANK PLC") {
                                return account_bank = "035"
                            }
                            if (bankName == "ZENITH BANK PLC") {
                                return account_bank = "057"
                            }
                            if (bankName == "ZENITH Mobile") {
                                return account_bank = "322"
                            }
                            if (bankName == "Coronation Merchant Bank") {
                                return account_bank = "599"
                            }
                            if (bankName == "FSDH Merchant Bank Limited") {
                                return account_bank = "601"
                            }
                            if (bankName == "PARRALEX BANK") {
                                return account_bank = "526"
                            }
                        }

                        var account_bank = bankCode(bankName);

                        var fetchTransferRecipients = {
                            method: 'POST',
                            url: 'https://ravesandboxapi.flutterwave.com/v2/gpx/transfers/beneficiaries/create',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: {
                                "account_number": account_number,
                                "account_bank": account_bank,
                                "seckey": "FLWSECK-d56276b3a6526d0c11b4c9e1014268c1-X"
                            }
                        }
                        $http.post(fetchTransferRecipients.url, fetchTransferRecipients.data).then(function (response) {

                        }, function (Error) {
                            console.log(Error);
                        });
                    } else {
                        alert(response.data.message);
                    }
                })
                return userDetails;
            }
            return factory;
        }
    ])