'use strict';
angular.module('orderRequest')
    .controller('ViewOrdersCtrl', ['$scope', 'tableView', 'notifications',
        function($scope, tableView, notifications) {
            orders = orders.replace(/&quot;/g, '"');

            orders = JSON.parse(orders);
            console.log(orders);
            var ordersFilter = {}
            $scope.selectedDisplay = "all";
            $scope.approverFeedBack = "";

            if (window.location.pathname === "/orders/mobile") {
                console.log("WHAT DO YOU WWANT AJACKY?");
                $scope.selectedOrder = orders;

            }

            $scope.tableView = tableView;
            tableView.createTable({
                name: "main",
                columns: columnsOrder,
                rows: orders,
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

            function onClickRow(selectedRow) {
                $scope.notifications['main-notification'].setVisible(false);
                $scope.selectedOrder = jQuery.extend(true, {}, selectedRow);
                var totalPrice = 0;
                var totalItems = 0;

                for (var i = 0; i < $scope.selectedOrder.items.length; i++) {
                    totalPrice += parseFloat($scope.selectedOrder.items[i].price) * parseInt($scope.selectedOrder.items[i].quantity);
                    totalItems += parseInt($scope.selectedOrder.items[i].quantity);
                }
                $scope.selectedOrder.totalPrice = totalPrice;
                $scope.selectedOrder.totalItems = totalItems;

                $scope.approverFeedBack = "";

                $('#order-modal').modal('show');
            }

            $scope.updateOrder = function(responseAction) {

                if (responseAction === 'rejectOrder') {
                    $scope.selectedOrder.status = "rejected";
                    $scope.notifications['main-notification'].setMessage("Order has been rejected!");
                } else if (responseAction === 'approveOrder') {
                    if ($scope.selectedOrder.currentApprover < $scope.selectedOrder.workflow.approvers.length - 1) {
                        $scope.selectedOrder.currentApprover++;
                    } else {
                        $scope.selectedOrder.status = "completed";
                        $scope.notifications['main-notification'].setMessage("Order has been completed!");
                    }
                }

                if ($scope.approverFeedBack.length > 0) {
                    $scope.selectedOrder.updates.push({
                        feedBack: $scope.approverFeedBack,
                        date: Date.now
                    });
                }

                console.log($scope.selectedOrder);
                $.ajax({
                    type: "POST",
                    url: "/orders/update",
                    data: $scope.selectedOrder,
                    success: success
                });

                function success(data) {

                    $scope.notifications['main-notification'].setClass("alert-success");

                    $scope.$apply(function() { // refresh data
                        $scope.notifications['main-notification'].setVisible(true);
                    });
                    $('#order-modal').modal('hide');
                }
            }

            // $scope.updateFilterObject = function() {
            //     var filterBy = $scope.filterBy;
            //     var filterText = $scope.filterText;

            //     if (!filterBy) {
            //         $scope.filterObject = $scope.filterText
            //         return;
            //     }
            //     $scope.filterObject = {};
            //     $scope.filterObject[filterBy] = filterText;
            // };

            // $scope.sortBy = function(column) {

            //     if (!column.sortBy) {
            //         column.sortBy = "ascending";
            //         $scope.orderBy.push(column.name); //column now sorted
            //     } else { //column was being sorted --> 
            //         if (column.sortBy === "descending") {
            //             var orderByColumnName = "-" + column.name,
            //                 indexOfColumn = $scope.orderBy.indexOf(orderByColumnName);
            //             $scope.orderBy.splice(indexOfColumn, 1);
            //             column.sortBy = null;
            //         } else {
            //             var indexOfColumn = $scope.orderBy.indexOf(column.name);
            //             $scope.orderBy[indexOfColumn] = "-" + column.name;
            //             column.sortBy = "descending";
            //         }
            //     }

            //     console.log($scope.orderBy);
            // };

            // $scope.isAscending = function(column) {
            //     if (column.sortBy === "ascending") {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // };
            // $scope.isDescending = function(column) {
            //     if (column.sortBy === "descending") {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // };
        }
    ]);

var columnsOrder = [{
    "name": "status",
    "display": "Status",
    "visible": true,
    "reverse": false,
    "sortBy": null
}, {
    "name": "issuer.username",
    "display": "Issued by",
    "visible": true,
    "reverse": false,
    "sortBy": null
}, {
    "name": "workflow.name",
    "display": "Workflow",
    "visible": true,
    "reverse": false,
    "sortBy": null
}, {
    "name": "dateCreated",
    "display": "Created On",
    "visible": true,
    "reverse": false,
    "sortBy": null
}];
