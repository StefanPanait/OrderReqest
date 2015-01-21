'use strict';
angular.module('orderRequest').factory('notifications', function() {
    var notification = {
        message: "",
        type: "",
        visible: false,
        setMessage: function(message) {
            this.message = message;
        },
        setClass: function(type) {
            this.type = type;
        },
        setVisible: function(bool) {
            this.visible = bool;
        }
    };

    var notifications = {};

    notifications.create = function(notificationSettings) {
        var name = notificationSettings.name;
        notifications[name] = Object.create(notification);
        notifications[name].message = notificationSettings.message;
        notifications[name].type = notificationSettings.type;
        notifications[name].visible = notificationSettings.visible;
    }

    return notifications;
});