angular.module('orderRequest')
    .controller("ShoppingCtrl", ['$scope', 'notifications',
        function($scope, notifications) {
            //data expected
            items = items.replace(/&quot;/g, '"');
            items = JSON.parse(items);
            console.log(items);
            console.log(items[0].picture);
            categories = categories.replace(/&quot;/g, '"');
            categories = JSON.parse(categories);
            workflows = workflows.replace(/&quot;/g, '"');
            $scope.workflows = JSON.parse(workflows);

            //Vars
            //View Data
            $scope.order = {};
            $scope.items = items;
            $scope.categories = categories;

            // setting
            $scope.selectedCategory = $scope.categories[0].name;
            $scope.orderBy = "price";
            $scope.cart = [];

            //state
            $scope.states = {
                formSubmitted: false
            }

            $scope.notifications = notifications;
            notifications.create({
                name: "main-notification",
                message: "",
                type: "",
                visible: false,
                scope: $scope
            });

            //private functions
            function findWorkflowIndexById(id) {
                var index = -1;
                for (var i = 0; i < $scope.workflows.length; i++) {
                    if ($scope.workflows[i]._id === id) {
                        index = i;
                        break;
                    }
                }
                return index;
            }

            function findItemIndexById(id) {
                var index = -1;
                for (var i = 0; i < $scope.cart.length; i++) {
                    if ($scope.cart[i]._id === id) {
                        index = i;
                        break;
                    }
                }
                return index;
            }

            $scope.increaseItemCount = function(item) {
                if (item.quantity === 0) { //adding this item to the cart
                    $scope.cart.push(item)
                }
                item.quantity++;
                item.decreaseDisabled = false;
            }

            $scope.decreaseItemCount = function(item) {
                item.quantity--; //decrement item quantity
                var index = findItemIndexById(item._id); //find item in cart
                if (item.quantity === 0) { //no more items of this type
                    if (index !== -1) { //the item exists in the cart
                        $scope.cart.splice(index, 1); //remove the item from the cart
                    }
                    item.decreaseDisabled = true;
                }
            }

            $scope.showCheckoutModal = function() {
                $('#checkout-modal').modal('show'); //display modal
                //$('#account-edit-modal').on('hidden.bs.modal', function() {
            }

            //server methods
            $scope.createOrder = function(formIsValid) {
                console.log(formIsValid);
                if (!formIsValid) {
                    $scope.states.formSubmitted = true;
                    return;
                }
                $scope.order.items = $scope.cart;
                var index = findWorkflowIndexById($scope.order.workflowId);
                $scope.order.workflow = $scope.workflows[index];

                console.log($scope.order);
                $.ajax({
                    type: "POST",
                    url: "/orders/create",
                    data: $scope.order,
                    success: success
                });

                function success(data) {
                    $scope.notifications['main-notification'].setMessage("Order was successfully created!");
                    $scope.notifications['main-notification'].setClass("alert-success");
                    $scope.$apply(function() { // refresh data
                        $scope.notifications['main-notification'].setVisible(true);
                        $('#checkout-modal').modal('hide');
                    });
                }
            }
        }
    ]);
