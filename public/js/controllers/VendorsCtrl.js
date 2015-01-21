'use strict';
angular.module('orderRequest')
    .controller("VendorsCtrl", ['$scope', 'tableView', 'notifications',
        function($scope, tableView, notifications) {
            vendors = JSON.parse(vendors.replace(/&quot;/g, '"'));

            $scope.selectedVendor = {
                contacts: []
            };
            $scope.selectedContact = {};

            //possible states
            $scope.states = {
                editingContact: false,
                editingVendor: false
            }

            $scope.tableView = tableView;
            tableView.createTable({
                name: "main",
                columns: columnsVendor,
                rows: vendors,
                onClickRow: onClickVendorRow
            });
            tableView.createTable({
                name: "vendorContacts",
                columns: columnsContact,
                rows: $scope.selectedVendor.contacts,
                onClickRow: onClickContactRow
            });

            $scope.notifications = notifications;
            notifications.create({
                name: "main-notification",
                message: "",
                type: "",
                visible: false,
                scope: $scope
            });
            notifications.create({
                name: "modal-notification",
                message: "",
                type: "",
                visible: false,
                scope: $scope
            });
            $scope.formBodyLocations = [
                "/partials/vendor/create-info.html",
                "/partials/vendor/create-contacts.html"
            ];

            $scope.currentPage = 0;

            $('#vendor-edit-form').on('hidden.bs.modal', function() {
                var vendor = findVendorById($scope.selectedVendor._id);
                if (vendor) { //if the vendor exists
                    $scope.$apply(function() { // refresh data
                        vendor.isSelected = false;
                    });
                }
                $scope.selectedVendor = false;
            })

            function findVendorById(id) {
                for (var i = 0; i < vendors.length; i++) {
                    if (vendors[i]._id === id) {
                        return vendors[i]
                    }
                }
            }
            $scope.displayCreateVendorModal = function() {
                //RESET ANYTHING FROM PREVIOUS CREATE
                $scope.states.editingVendor = false;
                $scope.states.editingContact = false;
                $scope.selectedVendor = {
                    contacts: []
                };
                tableView['vendorContacts'].setRows($scope.selectedVendor.contacts);
                $scope.selectedContact = {};
                $scope.currentPage = 0;
                $scope.notifications['main-notification'].setVisible(false);
                $scope.notifications['modal-notification'].setVisible(false);
                $scope.formSubmitted = false;
                $('#vendor-create-form').modal('show'); //display modal//display modal
            }
            $scope.submitForm = function(isValid) {
                $scope.formSubmitted = true;
                // check to make sure the form is completely valid
                if (isValid) {
                    if ($scope.currentPage === $scope.formBodyLocations.length - 1) {

                    } else {
                        $scope.formSubmitted = false;
                        nextPage();
                    }
                }
            }

            $scope.addSelectedContact = function(isValid) {
                console.log(isValid);
                $scope.formSubmitted = true;
                if (isValid) {
                    var foundselectedContact = false;
                    for (var i = 0; i < $scope.selectedVendor.contacts.length; i++) {
                        if ($scope.selectedVendor.contacts[i].email === $scope.selectedContact.email) {
                            //notify user that vendor contact with that email already exists
                            $scope.notifications['modal-notification'].setMessage("A contact with the email: " + $scope.selectedContact.email + " already exists.");
                            $scope.notifications['modal-notification'].setClass('alert-danger');
                            foundselectedContact = true;
                            break;
                        }
                    }

                    if (!foundselectedContact) {
                        var selectedContactCopy = jQuery.extend(true, {}, $scope.selectedContact);
                        $scope.notifications['modal-notification'].setMessage("Contact: " + $scope.selectedContact.name + " with email: " + $scope.selectedContact.email + " was successfully added.");
                        $scope.notifications['modal-notification'].setClass('alert-success');
                        $scope.selectedVendor.contacts.push(selectedContactCopy);
                    }
                    $scope.notifications['modal-notification'].setVisible(true);
                    $scope.formSubmitted = false;
                    $scope.selectedContact = {}; //clear out the contact details    
                }
            }

            $scope.saveSelectedContact = function(isValid) {
                $scope.formSubmitted = true;
                if (isValid) {
                    for (var i = 0; i < $scope.selectedVendor.contacts.length; i++) {
                        if ($scope.selectedVendor.contacts[i].email === $scope.selectedContact.email) {
                            $scope.selectedVendor.contacts[i] = $scope.selectedContact;
                            $scope.cancelSelectedContact($scope.selectedVendor.contacts[i]);
                            return;
                        }
                    }
                }

            }

            $scope.removeSelectedContact = function() {
                //remove contact from vendor's contact list
                for (var i = 0; i < $scope.selectedVendor.contacts.length; i++) {
                    if ($scope.selectedVendor.contacts[i].email === $scope.selectedContact.email) {
                        $scope.selectedVendor.contacts.splice(i, 1);
                        break;
                    }
                }
                //disable form validation 
                $scope.formSubmitted = false;
                //alert user
                $scope.notifications['modal-notification'].setMessage("Contact: " + $scope.selectedContact.name + " with email: " + $scope.selectedContact.email + " was successfully removed.");
                $scope.notifications['modal-notification'].setClass('alert-success');
                $scope.notifications['modal-notification'].setVisible(true);
                //reset input data
                $scope.selectedContact = {};
                //update state 
                $scope.states.editingContact = false;
            }

            $scope.cancelSelectedContact = function(selectedContact) {
                $scope.formSubmitted = false;
                selectedContact.isSelected = false;
                $scope.states.editingContact = false;
                $scope.selectedContact = {};
            }

            function onClickContactRow(selectedContact) {
                //update state
                $scope.states.editingContact = true;
                var selectedContactCopy = jQuery.extend(true, {}, selectedContact);
                $scope.selectedContact = selectedContactCopy;
            }

            function onClickVendorRow(selectedRow) {
                //update state
                $scope.states.editingVendor = true;
                $scope.states.editingContact = false;
                $scope.notifications['modal-notification'].setVisible(false);
                $scope.notifications['main-notification'].setVisible(false);
                $scope.selectedVendor = jQuery.extend(true, {}, selectedRow);
                $scope.selectedContact = {};
                tableView['vendorContacts'].setRows($scope.selectedVendor.contacts);
                $('#vendor-edit-form').modal('show');

            };

            function nextPage() {
                if ($scope.currentPage < $scope.formBodyLocations.length - 1) {
                    $scope.currentPage++;
                }
            };

            $scope.previousPage = function() {
                $scope.currentPage--;
            }
            $scope.createVendor = function() {
                $.ajax({
                    type: "POST",
                    url: "/manage/vendors/create",
                    data: $scope.selectedVendor,
                    success: success
                });

                function success(data) {
                    $scope.notifications['main-notification'].setMessage("Vendor was successfully saved!");
                    $scope.notifications['main-notification'].setClass("alert-success");
                    $('#vendor-create-form').modal('hide');
                    $scope.$apply(function() { // refresh data
                        vendors.push(data);
                        $scope.notifications['main-notification'].setVisible(true);
                        $scope.selectedVendor = false;
                    });
                }
            }
            $scope.updateVendor = function() {
                $.ajax({
                    type: "POST",
                    url: "/manage/vendors/update",
                    data: $scope.selectedVendor,
                    success: success
                });

                function success(data) {
                    $scope.notifications['main-notification'].setMessage("Vendor was successfully saved!");
                    $scope.notifications['main-notification'].setClass("alert-success");

                    $scope.$apply(function(data) { // refresh data
                        for (var i = 0; i < vendors.length; i++) {
                            if (vendors[i]._id === $scope.selectedVendor._id) {
                                vendors[i] = $scope.selectedVendor;
                                break;
                            }
                        }
                        $scope.notifications['main-notification'].setVisible(true);
                        $('#vendor-edit-form').modal('hide');
                    });
                }
            }
            $scope.deleteVendor = function() {
                $.ajax({
                    type: "POST",
                    url: "/manage/vendors/delete",
                    data: $scope.selectedVendor,
                    success: success
                });

                function success(data) {
                    $scope.notifications['main-notification'].setMessage("Vendor: " + $scope.selectedVendor.name + " was successfully deleted!");
                    $scope.notifications['main-notification'].setClass("alert-success");

                    $scope.$apply(function() { // refresh data
                        $scope.notifications['main-notification'].setVisible(true);
                        for (var i = 0; i < vendors.length; i++) {
                            if (vendors[i]._id === $scope.selectedVendor._id) {
                                vendors.splice(i, 1);
                                break;
                            }
                        }
                    });
                    $('#vendor-edit-form').modal('hide');
                }
            }


        }
    ]);

var columnsVendor = [{
    "name": "name",
    "display": "Name",
    "visible": true
}, {
    "name": "address",
    "display": "Address",
    "visible": true
}, {
    "name": "email",
    "display": "Email",
    "visible": true
}, {
    "name": "phone",
    "display": "Phone Number",
    "visible": true
}];
var columnsContact = [{
    "name": "name",
    "display": "Name",
    "visible": true
}, {
    "name": "phone",
    "display": "Phone",
    "visible": true
}, {
    "name": "position",
    "display": "Position",
    "visible": true
}, {
    "name": "email",
    "display": "Email",
    "visible": true
}];
