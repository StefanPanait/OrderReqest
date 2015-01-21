'use strict';
angular.module('orderRequest')
    .controller("WorkflowCtrl", ['$scope', '$location', 'tableView', 'notifications',
        function($scope, $location, tableView, notifications) {
            //Data expected
            workflows = workflows.replace(/&quot;/g, '"');
            workflows = JSON.parse(workflows);
            accounts = accounts.replace(/&quot;/g, '"');
            accounts = JSON.parse(accounts);

            $scope.test = "AS";
            //Vars
            // Table Data
            $scope.accounts = accounts;
            $scope.workflows = workflows;
            // Table Header
            $scope.columnsWF = columnsWF;
            $scope.columnsNewAcct = columnsNewAcct;
            $scope.columnsAcct = columnsAcct;
            // Table Behaviour
            $scope.accountFilterBy = columnsAcct[0].name;

            $scope.orderNumberOptions = [];
            $scope.selectedWorkflow = {
                approvers: []
            };

            //setup tableView
            $scope.tableView = tableView;
            tableView.createTable({
                name: "main",
                columns: columnsWF,
                rows: workflows,
                onClickRow: selectRowFuncWF
            });
            tableView.createTable({
                name: "approverOrder",
                columns: columnsAcct,
                rows: $scope.selectedWorkflow.approvers
            });
            tableView.createTable({
                name: "newApproverOrder",
                columns: columnsAcct,
                rows: $scope.newApprovers
            });
            notifications.create({
                name: "main-notification",
                message: "",
                type: "",
                visible: false,
                scope: $scope
            });
            $scope.notifications = notifications

            $scope.formBodyLocations = [
                "/partials/workflow/create.html",
                "/partials/workflow/configure.html"
            ];
            $scope.currentPage = 0;

            $('#workflow-edit-modal').on('hidden.bs.modal', function() {
                var index = findWorkflowIndexById($scope.selectedWorkflow._id);
                console.log(index);
                if (index !== -1) { //if the vendor exists
                    $scope.$apply(function() { // refresh data
                        workflows[index].isSelected = false;
                    });
                }
                $scope.selectedWorkflow = false;
            })

            function findWorkflowIndexById(id) {
                var index = -1;
                for (var i = 0; i < workflows.length; i++) {
                    if (workflows[i]._id === id) {
                        index = i;
                    }
                }
                return index;
            }

            $scope.openCreateWFForm = function() {
                console.log("running this");
                $scope.selectedWorkflow = {
                    approvers: []
                };
                $scope.orderNumberOptions = [];
                $scope.currentPage = 0;
                $('#workflow-create-modal').modal('show');
            }

            /* Workflow Create Function */
            $scope.submitForm = function(isValid) {
                // check to make sure the form is completely valid
                if (isValid) {
                    if ($scope.currentPage === $scope.formBodyLocations.length) {
                        // Create the workflow
                    } else {
                        nextPage();
                    }
                }
            }
            $scope.previousPage = function() {
                if ($scope.currentPage > 0) {
                    $scope.currentPage--;
                }
                // if ($scope.currentPage == 1) updateAcctColumns(true);
                // else updateAcctColumns(false);
            }
            $scope.onClickSearch = function($item, $model, $label) {
                var approver = {
                    order: undefined,
                    username: $item.username,
                    account: $item
                }

                for (var i = 0; i < $scope.selectedWorkflow.approvers.length; i++) {
                    if ($scope.selectedWorkflow.approvers[i].username === $item.username) {
                        return; //cannot add the same person twice
                    }
                }

                if ($scope.selectedWorkflow.approvers.length === 0) $scope.selectedWorkflow.approvers = [];

                approver.order = $scope.orderNumberOptions.length;
                $scope.selectedWorkflow.approvers.push(approver);
                $scope.orderNumberOptions.push($scope.orderNumberOptions.length);

            }
            $scope.onClickRemove = function(accountUsername) {
                $scope.orderNumberOptions.splice($scope.orderNumberOptions.length - 1, 1)
                for (var i = 0; i < $scope.selectedWorkflow.approvers.length; i++) {
                    if ($scope.selectedWorkflow.approvers[i].username === accountUsername) {
                        $scope.selectedWorkflow.approvers.splice(i, 1);
                        return;
                    }
                }
            }

            function selectRowFuncWF(currentSeletedRow) {
                $scope.selectedWorkflow = jQuery.extend(true, {}, currentSeletedRow); //deep copy selected workflow
                tableView['approverOrder'].rows = $scope.selectedWorkflow.approvers; // set data for approver rows
                //get updated account data for the approver
                var approvers = $scope.selectedWorkflow.approvers;
                $scope.orderNumberOptions = [];
                for (var i = 0; i < approvers.length; i++) {
                    approvers[i].account = findAccountByUsername(approvers[i].username);
                    $scope.orderNumberOptions.push(i);
                }
                $('#workflow-edit-modal').modal('show');
            }

            // function generateOrderLayer(numberOfLayers) {
            //     $scope.orderLayers = [];
            //     for (var i = 0; i < numberOfLayers; i++) {
            //         $scope.orderLayers.push({
            //             "name": i,
            //             "display": i
            //         });
            //     }
            // }

            function nextPage() {
                if ($scope.currentPage < $scope.formBodyLocations.length - 1) {
                    $scope.currentPage++;
                }
                //if ($scope.currentPage == 1) generateOrderLayer($scope.selectedWorkflow.approvalLayers);
            }

            function findAccountByUsername(username) {
                for (var i = 0; i < accounts.length; i++) {
                    if (accounts[i].username === username) {
                        return accounts[i];
                    }
                }
            }

            $scope.updateWorkflow = function() {
                $.ajax({
                    type: "POST",
                    url: "/manage/workflow/update",
                    data: $scope.selectedWorkflow,
                    success: success
                });

                function success(data) {
                    $scope.notifications['main-notification'].setMessage("Workflow: " + $scope.selectedWorkflow.name + " was successfully saved!");
                    $scope.notifications['main-notification'].setClass("alert-success");

                    $scope.$apply(function() { // force angular refresh
                        workflows[findWorkflowIndexById($scope.selectedWorkflow._id)] = $scope.selectedWorkflow; //update locally
                        $scope.notifications['main-notification'].setVisible(true);
                    });
                    $('#workflow-edit-modal').modal('hide');
                }
            }
            $scope.createWorkflow = function() {
                $.ajax({
                    type: "POST",
                    url: "/manage/workflow/create",
                    data: $scope.selectedWorkflow,
                    success: success
                });

                function success(data) {
                    $scope.notifications['main-notification'].setMessage("Workflow: " + $scope.selectedWorkflow.name + " was successfully created!");
                    $scope.notifications['main-notification'].setClass("alert-success");

                    $scope.$apply(function() { // refresh data
                        $scope.workflows.push(data);
                        $scope.notifications['main-notification'].setVisible(true);
                    });
                    $('#workflow-create-modal').modal('hide');
                }
            }
            $scope.deleteWorkflow = function() {
                $.ajax({
                    type: "POST",
                    url: "/manage/workflow/delete",
                    data: $scope.selectedWorkflow,
                    success: success
                });

                function success(status) {
                    $scope.notifications['main-notification'].setMessage("Workflow: " + $scope.selectedWorkflow.name + " was successfully deleted!");
                    $scope.notifications['main-notification'].setClass("alert-success");
                    for (var i = 0; i < $scope.workflows.length; i++) {
                        if ($scope.selectedWorkflow._id === $scope.workflows[i]._id) {
                            $scope.$apply(function() { // refresh data
                                $scope.workflows.splice(i, 1);
                                $scope.notifications['main-notification'].setVisible(true);
                            });
                            return;
                        }
                    }
                }
                $('#workflow-edit-modal').modal('hide');
            }
        }
    ]);



var columnsNewAcct = [{
    "name": "firstName",
    "display": "First Name",
    "visible": true
}, {
    "name": "lastName",
    "display": "Last Name",
    "visible": true
}, {
    "name": "position",
    "display": "Position",
    "visible": true
}, {
    "name": "title",
    "display": "Title",
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
    "name": "position",
    "display": "Position",
    "visible": true
}];

var columnsWF = [{
    "name": "name",
    "display": "Name",
    "visible": true
}, {
    "name": "description",
    "display": "Description",
    "visible": true
}, {
    "name": "dateCreated",
    "display": "Date Created",
    "visible": true
}];
