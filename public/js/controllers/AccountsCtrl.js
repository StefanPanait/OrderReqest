'use strict';
angular.module('orderRequest')
    .controller("AccountsCtrl", ['$scope', 'tableView', 'notifications',
        function($scope, tableView, notifications) {

            currentAccounts = JSON.parse(currentAccounts.replace(/&quot;/g, '"'));
            pendingAccounts = JSON.parse(pendingAccounts.replace(/&quot;/g, '"'));
            var accounts = {
                currentAccounts: currentAccounts,
                pendingAccounts: pendingAccounts
            }

            $scope.selectedAccount = {};
            $scope.dataLength = accounts.currentAccounts.length;
            $scope.pendingAccountsLength = pendingAccounts.length;
            $scope.selectedDisplay = "currentAccounts";
            $scope.isApproving = false;
            $scope.approvalBtnLabel = 'Approve';

            if (pendingAccounts.length > 0) {
                $scope.pendingAccountsAlert = true;
            }

            $scope.tableView = tableView;
            tableView.createTable({
                name: "main",
                columns: columnsAcct,
                rows: accounts.currentAccounts,
                onClickRow: onClickRow
            });

            $scope.notifications = notifications;
            notifications.create({
                name: "main-notification",
                message: "",
                type: "",
                visible: false,
                scope: $scope
            });


            //when modals are closed
            $('#account-edit-modal').on('hidden.bs.modal', function() {
                if (($scope.selectedAccount) && ($scope.selectedAccount._id)) {
                    var index = findCurrentAccountIndexById($scope.selectedAccount._id);
                    if (index !== -1) { //if the vendor exists
                        $scope.$apply(function() { // refresh data
                            currentAccounts[index].isSelected = false;
                        });
                    }
                }
                $scope.selectedAccount = false;
            });
            $('#account-approve-modal').on('hidden.bs.modal', function() {
                if (($scope.selectedAccount) && ($scope.selectedAccount._id)) {
                    var index = findPendingAccountIndexById($scope.selectedAccount._id);
                    if (index !== -1) { //if the vendor exists
                        $scope.$apply(function() { // refresh data
                            pendingAccounts[index].isSelected = false;
                        });
                    }
                }
                $scope.selectedWorkflow = false;
            });

            function findCurrentAccountIndexById(id) {
                var index = -1;
                for (var i = 0; i < currentAccounts.length; i++) {
                    if (currentAccounts[i]._id === id) {
                        index = i;
                        break;
                    }
                }
                return index;
            }

            function findPendingAccountIndexById(id) {
                var index = -1;
                for (var i = 0; i < pendingAccounts.length; i++) {
                    if (pendingAccounts[i]._id === id) {
                        index = i;
                        break;
                    }
                }
                return index;
            }


            function onClickRow(selectedRow) {
                $scope.notifications['main-notification'].setVisible(false);

                if ($scope.selectedDisplay === "currentAccounts") {
                    $scope.selectedAccount = jQuery.extend(true, {}, selectedRow); //deep copy selectedAccount
                    $('#account-edit-modal').modal('show'); //display modal
                } else {
                    $scope.selectedAccount = selectedRow;
                    $('#account-approve-modal').modal('show'); //display modal
                }

                //save index of this object
                var index = -1;
                for (var i = 0, len = accounts[$scope.selectedDisplay].length; i < len; i++) {
                    if (accounts[$scope.selectedDisplay][i]._id === selectedRow._id) {
                        index = i;
                        break;
                    }
                }
                $scope.selectedAccount.index = index;
            }

            $scope.clearSearch = function() {
                $scope.searchString = "";
            }

            $scope.setTableData = function(dataName) {
                $scope.selectedDisplay = dataName;

                if (dataName === "currentAccounts") {
                    $scope.tableView['main'].setRows(accounts.currentAccounts);
                    $scope.tableView['main'].setColumns(columnsAcct);
                } else if (dataName === "pendingAccounts") {
                    $scope.tableView['main'].setRows(accounts.pendingAccounts);
                    $scope.tableView['main'].setColumns(columnsPendingAcct);
                }
                $scope.dataLength = accounts[$scope.selectedDisplay].length;
            }
            $scope.toggleDetails = function() {
                $scope.displayDetails = !$scope.displayDetails;
            }

            $scope.updateAccount = function() {
                $.ajax({
                    type: "POST",
                    url: "/manage/accounts/update",
                    data: $scope.selectedAccount,
                    success: success
                });

                function success(status) {
                    var index = $scope.selectedAccount.index;
                    $scope.notifications['main-notification'].setMessage("Account: " + $scope.selectedAccount.username + " were successfully updated!");
                    $scope.notifications['main-notification'].setClass("alert-success");


                    $scope.$apply(function() { // refresh data
                        accounts[$scope.selectedDisplay][index] = $scope.selectedAccount;
                        $scope.notifications['main-notification'].setVisible(true);
                    });
                    $('#account-edit-modal').modal('hide');
                }
            }

            $scope.approveAccount = function() {
                $scope.isApproving = true;
                $scope.approvalBtnLabel = "Approving"

                $.ajax({
                    type: "POST",
                    url: "/manage/accounts/approve",
                    data: $scope.selectedAccount,
                    success: success
                });

                function success(data) {
                    if (data.error) { //if error exists display message
                        console.log(data.error.message);
                        $scope.notifications['main-notification'].setMessage(data.error.message);
                        $scope.notifications['main-notification'].setClass("alert-danger");
                    } else {

                        $scope.notifications['main-notification'].setMessage("Changes were successfully saved!");
                        $scope.notifications['main-notification'].setClass("alert-success");

                        $scope.$apply(function() { // refresh data
                            accounts.currentAccounts.push(data.newAccount);
                            accounts[$scope.selectedDisplay].splice(index, 1);
                            $scope.pendingAccountsLength = pendingAccounts.length;
                            var index = $scope.selectedAccount.index;
                            $scope.selectedAccount = undefined;
                        });
                    }
                    $scope.$apply(function() { // refresh data
                        $scope.notifications['main-notification'].setVisible(true);
                    });
                    $scope.isApproving = false;
                    $scope.approvalBtnLabel = "Approve"

                    $('#account-approve-modal').modal('hide');
                }
            }

            $scope.rejectAccount = function() {
                $.ajax({
                    type: "POST",
                    url: "/manage/accounts/reject",
                    data: $scope.selectedAccount,
                    success: success
                });

                function success(status) {
                    var index = $scope.selectedAccount.index;

                    $scope.notifications['main-notification'].setMessage("Changes were successfully saved!");
                    $scope.notifications['main-notification'].setClass("alert-success");

                    $scope.$apply(function() { // refresh data
                        accounts[$scope.selectedDisplay].splice(index, 1);
                        $scope.pendingAccountsLength = pendingAccounts.length;
                        $scope.notifications['main-notification'].setVisible(true);
                        $scope.selectedAccount = undefined;
                    });
                    $('#account-approve-modal').modal('hide');
                }

            }

            $scope.deleteAccount = function() {
                console.log("running");
                $.ajax({
                    type: "POST",
                    url: "/manage/accounts/delete",
                    data: $scope.selectedAccount,
                    success: success
                });

                function success(status) {
                    var index = $scope.selectedAccount.index;

                    $scope.notifications['main-notification'].setMessage("Changes were successfully saved!");
                    $scope.notifications['main-notification'].setClass("alert-success");


                    $scope.$apply(function() { // refresh data
                        accounts[$scope.selectedDisplay].splice(index, 1);
                        $scope.notifications['main-notification'].setVisible(true);
                        $scope.selectedAccount = undefined;
                    });
                    $('#account-edit-modal').modal('hide');
                }
            }
        }
    ]);

var columnsPendingAcct = [{
    "name": "username",
    "display": "E-mail",
    "visible": true
}, {
    "name": "note",
    "display": "Notes",
    "visible": true
}, {
    "name": "dateRequested",
    "display": "Date Requested",
    "visible": true
}];

var columnsAcct = [{
    "name": "username",
    "display": "Email",
    "visible": true
}, {
    "name": "firstName",
    "display": "First Name",
    "visible": true
}, {
    "name": "lastName",
    "display": "Last Name",
    "visible": true
}, {
    "name": "title",
    "display": "Title",
    "visible": true
}];
