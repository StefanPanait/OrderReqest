angular.module('orderRequest')
    .controller("ShopCtrl", ['$scope', 'tableView', 'notifications',
        function($scope, tableView, notifications) {

            //data expected
            items = items.replace(/&quot;/g, '"');
            items = JSON.parse(items);
            categories = categories.replace(/&quot;/g, '"');
            categories = JSON.parse(categories);
            vendors = vendors.replace(/&quot;/g, '"');
            vendors = JSON.parse(vendors);

            //Vars
            // Table Data
            $scope.items = items;
            $scope.categories = categories;
            $scope.vendors = vendors;
            $scope.selectedDisplay = "items";

            //modal data
            $scope.selectedItem = {};
            $scope.selectedCategory = {};

            //states
            $scope.states = {
                    editing: false,
                    formSubmitted: false
                }
                //setup tableView
            $scope.tableView = tableView;
            tableView.createTable({
                name: "main",
                columns: columnsitem,
                rows: items,
                onClickRow: onClickRow
            });

            notifications.create({
                name: "main-notification",
                message: "",
                type: "",
                visible: false,
                scope: $scope
            });
            $scope.notifications = notifications


            //WHEN MODAL IS HIDDEN
            $('#item-modal').on('hidden.bs.modal', function() {
                var index = findItemIndexById($scope.selectedItem._id);
                if (index !== -1) { //if the vendor exists
                    $scope.$apply(function() { // refresh data
                        items[index].isSelected = false;
                    });
                }
                $scope.states.editing = false;
                $scope.states.formSubmitted = false;
            });
            $('#category-modal').on('hidden.bs.modal', function() {
                var index = findCategoryIndexById($scope.selectedCategory._id);
                if (index !== -1) { //if the vendor exists
                    $scope.$apply(function() { // refresh data
                        categories[index].isSelected = false;
                    });
                }
                $scope.states.editing = false;
                $scope.states.formSubmitted = false;
            });
            //public methods
            $scope.showCreateModal = function() {
                $scope.selectedItem = {};
                $scope.selectedCategory = {};
                if ($scope.selectedDisplay === "items") {
                    $('#item-modal').modal('show');
                } else if ($scope.selectedDisplay === "categories") {
                    $('#category-modal').modal('show');
                }
            }

            $scope.setTableData = function(dataName) {
                $scope.selectedDisplay = dataName;

                if (dataName === "items") {
                    $scope.tableView['main'].setRows(items);
                    $scope.tableView['main'].setColumns(columnsitem);
                } else if (dataName === "categories") {
                    $scope.tableView['main'].setRows(categories);
                    $scope.tableView['main'].setColumns(columnsCategories);
                }
            }

            //private methods
            function onClickRow(row) {
                $scope.states.editing = true;
                if ($scope.selectedDisplay === "items") {
                    $scope.selectedItem = jQuery.extend(true, {}, row);
                    $('#item-modal').modal('show');
                } else if ($scope.selectedDisplay === "categories") {
                    $scope.selectedCategory = jQuery.extend(true, {}, row);
                    $('#category-modal').modal('show');
                }
            }

            function findItemIndexById(id) {
                var index = -1;
                for (var i = 0; i < items.length; i++) {
                    if (items[i]._id === id) {
                        index = i;
                        break;
                    }
                }
                return index;
            }

            function removeItemById(id) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i]._id === id) {
                        items.splice(i, 1);
                    }
                }
            }

            function findCategoryIndexById(id) {
                var index = -1;
                for (var i = 0; i < categories.length; i++) {
                    if (categories[i]._id === id) {
                        index = i;
                        break;
                    }
                }
                return index;
            }

            function removeCategoryById(id) {
                for (var i = 0; i < categories.length; i++) {
                    if (categories[i]._id === id) {
                        categories.splice(i, 1);
                    }
                }
            }

            //server methods
            $scope.createItem = function(formIsValid) {
                console.log(formIsValid);
                if (!formIsValid) {
                    $scope.states.formSubmitted = true;
                    return;
                }
                console.log($scope.selectedItem);
                $.ajax({
                    type: "POST",
                    url: "/manage/shop/createItem",
                    data: $scope.selectedItem,
                    success: success
                });

                function success(data) {
                    $scope.notifications['main-notification'].setMessage("Item: " + $scope.selectedItem.name + " was successfully created!");
                    $scope.notifications['main-notification'].setClass("alert-success");

                    $scope.$apply(function() { // refresh data
                        items.push(data);
                        $scope.notifications['main-notification'].setVisible(true);
                    });
                    $('#item-modal').modal('hide');
                }
            }
            $scope.updateItem = function(formIsValid) {
                if (!formIsValid) {
                    $scope.states.formSubmitted = true;
                    return;
                }
                $.ajax({
                    type: "POST",
                    url: "/manage/shop/updateItem",
                    data: $scope.selectedItem,
                    success: success
                });

                function success(data) {
                    $scope.notifications['main-notification'].setMessage("Item: " + $scope.selectedItem.name + " was successfully updated!");
                    $scope.notifications['main-notification'].setClass("alert-success");

                    $scope.$apply(function(data) { // refresh data
                        var index = findItemIndexById($scope.selectedItem._id); //find the item to update
                        items[index] = $scope.selectedItem; //replace old item with new item
                        $scope.notifications['main-notification'].setVisible(true);
                    });
                    $('#item-modal').modal('hide');
                }
            }
            $scope.deleteItem = function() {
                console.log($scope.selectedItem);
                $.ajax({
                    type: "POST",
                    url: "/manage/shop/deleteItem",
                    data: $scope.selectedItem,
                    success: success
                });

                function success(data) {
                    $scope.notifications['main-notification'].setMessage("Item: " + $scope.selectedItem.name + " was successfully deleted!");
                    $scope.notifications['main-notification'].setClass("alert-success");

                    $scope.$apply(function() { // refresh data
                        removeItemById($scope.selectedItem._id);
                        $scope.notifications['main-notification'].setVisible(true);
                    });
                    $('#item-modal').modal('hide');
                }
            }
            $scope.createCategory = function(formIsValid) {
                if (!formIsValid) {
                    $scope.states.formSubmitted = true;
                    return;
                }
                console.log($scope.selectedCategory);
                $.ajax({
                    type: "POST",
                    url: "/manage/shop/createCategory",
                    data: $scope.selectedCategory,
                    success: success
                });

                function success(data) {
                    $scope.notifications['main-notification'].setMessage("Category: " + $scope.selectedCategory.name + " was successfully created!");
                    $scope.notifications['main-notification'].setClass("alert-success");
                    console.log(data);
                    $scope.$apply(function() { // refresh data
                        categories.push(data);
                        $scope.notifications['main-notification'].setVisible(true);
                    });
                    $('#category-modal').modal('hide');
                }
            }
            $scope.deleteCategory = function() {
                $.ajax({
                    type: "POST",
                    url: "/manage/shop/deleteCategory",
                    data: $scope.selectedCategory,
                    success: success
                });

                function success(data) {
                    $scope.notifications['main-notification'].setMessage("Category: " + $scope.selectedCategory.name + " was successfully deleted!");
                    $scope.notifications['main-notification'].setClass("alert-success");
                    $scope.$apply(function() { // refresh data
                        removeCategoryById($scope.selectedCategory._id);
                        $scope.notifications['main-notification'].setVisible(true);
                    });
                    $('#category-modal').modal('hide');
                }
            }
            $scope.updateCategory = function(formIsValid) {
                if (!formIsValid) {
                    $scope.states.formSubmitted = true;
                    return;
                }
                $.ajax({
                    type: "POST",
                    url: "/manage/shop/updateCategory",
                    data: $scope.selectedCategory,
                    success: success
                });

                function success(data) {
                    $scope.notifications['main-notification'].setMessage("Category: " + $scope.selectedCategory.name + " was successfully created!");
                    $scope.notifications['main-notification'].setClass("alert-success");

                    $scope.$apply(function(data) { // refresh data
                        var index = findCategoryIndexById($scope.selectedCategory._id);
                        categories[index] = $scope.selectedCategory;
                        $scope.notifications['main-notification'].setVisible(true);
                    });
                    $('#category-modal').modal('hide');
                }
            }
        }
    ]);

var columnsitem = [{
    "name": "name",
    "display": "Name",
    "visible": true
}, {
    "name": "category",
    "display": "Category",
    "visible": true
}, {
    "name": "description",
    "display": "Description",
    "visible": true
}, {
    "name": "price",
    "display": "Price",
    "visible": true
}, {
    "name": "vendor",
    "display": "Vendor",
    "visible": true
}];

var columnsCategories = [{
    "name": "name",
    "display": "Name",
    "visible": true
}, {
    "name": "dateCreated",
    "display": "Created Date",
    "visible": true
}];
