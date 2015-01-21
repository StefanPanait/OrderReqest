'use strict';
angular.module('orderRequest')
    .controller('TicketsCtrl', ['$scope',
        function ($scope) {
            //Data expected from server
            $scope.tickets = tickets.replace(/&quot;/g, '"');
            $scope.tickets = JSON.parse($scope.tickets);

            console.log($scope.tickets);

            //variables used for search/sort
            $scope.orderBy = [];
            $scope.columns = columns;
            $scope.reverse = false;
            $scope.filterBy = "";
            $scope.filterText = "";
            $scope.filterObject = $scope.filterText;

            //search by: Columns
            $scope.updateFilterObject = function () {
                var filterBy = $scope.filterBy;
                var filterText = $scope.filterText;

                if (!filterBy) {
                    $scope.filterObject = $scope.filterText
                    return;
                }
                $scope.filterObject = {};
                $scope.filterObject[filterBy] = filterText;
            };

            //multiple sort
            $scope.sortBy = function (column) {
                if (!column.sortBy) {
                    column.sortBy = "ascending";
                    $scope.orderBy.push(column.name); //column now sorted
                } else { //column was being sorted --> 
                    if (column.sortBy === "descending") {
                        var orderByColumnName = "-" + column.name,
                            indexOfColumn = $scope.orderBy.indexOf(orderByColumnName);
                        $scope.orderBy.splice(indexOfColumn, 1);
                        column.sortBy = null;
                    } else {
                        var indexOfColumn = $scope.orderBy.indexOf(column.name);
                        $scope.orderBy[indexOfColumn] = "-" + column.name;
                        column.sortBy = "descending";
                    }
                }

                console.log($scope.orderBy);
            };

            //on click for table header to change direction of arrow
            $scope.isAscending = function (column) {
                if (column.sortBy === "ascending") {
                    return true;
                } else {
                    return false;
                }
            };
            $scope.isDescending = function (column) {
                if (column.sortBy === "descending") {
                    return true;
                } else {
                    return false;
                }
            };
        }
    ]);



var columns = [{
    "name": "id",
    "display": "ID",
    "visible": true,
    "reverse": false,
    "sortBy": null
}, {
    "name": "category",
    "display": "Category",
    "visible": true,
    "reverse": false,
    "sortBy": null
}, {
    "name": "dateAdded",
    "display": "Date Added",
    "visible": true,
    "reverse": false,
    "sortBy": null
}, {
    "name": "currentStatus",
    "display": "Status",
    "visible": true,
    "reverse": false,
    "sortBy": null
}, {
    "name": "description",
    "display": "Description",
    "visible": true,
    "reverse": false,
    "sortBy": null
}, {
    "name": "issuerID",
    "display": "Issuer ID",
    "visible": true,
    "reverse": false,
    "sortBy": null
}];
