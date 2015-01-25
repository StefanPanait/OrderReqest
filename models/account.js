var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    utils = require("../utils/utility"),
    moment = require("moment"),
    Schema = mongoose.Schema;

var Account = new Schema({
    id: String,
    firstName: String,
    lastName: String,
    username: String,
    position: String, //position may be positionID, if scaled
    title: String, //title may be positionID, if scaled
    permissions: {
        type: String,
        default: "General"
    }, //General Approver Administrator
    orders: String, //list of orderIDs
    dateCreated: {
        type: Date,
        default: Date.now
    }, //date it was added
    dateRequested: {
        type: Date
    },
    profile: {
        profilePic: String, //url path of picture
        address: String, //self
        work_phone: String, //self
        cell_phone: String //self
    },
    forgotPass: {
        token: String,
        validDate: Date,
        used: Boolean
    },
    notifications: [],
    cart: [],
    pushToken: String
});

Account.plugin(passportLocalMongoose); //this will inject each user with username, and encrypted password

var tempAccount = mongoose.model('Account', Account);


Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
}

var authenticate2 = function() {
    var self = this;
    return function(username, password, cb) {
        self.getAccountByUser(username, function(err, user) {
            if (err) return cb(err);
            if (user && user.role != "banned" && user.status != "Not Verified") {
                return user.authenticate(password, cb);
            } else {
                return cb(null, false, {
                    message: 'Invalid login credentials'
                });
            };
        });
    };
};

var addNotifications = function(req_obj, mongo_obj, callback) {
    var instance = mongo_obj;
    //console.log(req_obj, mongo_obj);
    //notification.dateAdded = moment.format('llll');
    var notificationQuery = new Object();
    notificationQuery.description = req_obj.desc;
    notificationQuery.link = req_obj.link;
    notificationQuery.title = req_obj.title;
    instance.notifications.push(notificationQuery);
    instance.save(function(err) {
        if (err) callback(err);
        else callback(null);
    });

}

var resetPass = function(mongo_obj, callback) {
    var code = utils.makeId(25);
    var instance = mongo_obj;

    instance.forgotPass = {};
    instance.forgotPass.token = code;
    instance.forgotPass.validDate = new Date().addHours(24);
    instance.forgotPass.used = false;
    instance.save(function(err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, code);
        }
    });
};

var changeReset = function(mongo_obj, callback) {
    var instance = mongo_obj;
    instance.forgotPass.used = true;
    instance.save(function(err) {
        if (err) callback(err);
        else callback(null);
    });
}

var getAccountByID = function(request, callback) {
    tempAccount.findOne({
            _id: request
        },
        null,
        callback
    );
};
var getAccountByUser = function(request, callback) {
    tempAccount.findOne({
            username: request
        },
        null,
        callback
    );
};

var getAccountByResetCode = function(request, callback) {
    tempAccount.findOne({
            'forgotPass.token': request
        },
        null,
        callback
    );
};

var setPushToken = function(pushToken) {
    var instance = {};

    instance.pushToken = pushToken;

    return instance;
}

var findAll = function(callback) {
    tempAccount.find({},
        null, {},
        function(err, collection) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, collection);
            }
        }
    );
};

//profile pic + username not updating
var generateUpdateObject = function(req_obj) {
    var instance = {};
    instance.profile = {};

    if (req_obj.firstName) instance.firstName = req_obj.firstName;
    if (req_obj.lastName) instance.lastName = req_obj.lastName;
    if (req_obj.title) instance.title = req_obj.title;
    if (req_obj.profile) {
        if (req_obj.profile.work_phone) instance.profile.work_phone = req_obj.profile.work_phone;
        if (req_obj.profile.cell_phone) instance.profile.cell_phone = req_obj.profile.cell_phone;
        if (req_obj.profile.address) instance.profile.address = req_obj.profile.address;
    }
    if (req_obj.permissions) instance.permissions = req_obj.permissions;

    return instance;

}

var manageCart = function(req_obj, mongo_obj, callback) {
    var instance = mongo_obj;
    instance.cart.push(req_obj);
    instance.save(function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};



module.exports = mongoose.model('Account', Account);
module.exports.generateUpdateObject = generateUpdateObject;
module.exports.authenticate2 = authenticate2;
module.exports.addNotifications = addNotifications;
module.exports.resetPass = resetPass;
module.exports.getAccountByID = getAccountByID;
module.exports.getAccountByUser = getAccountByUser;
module.exports.getAccountByResetCode = getAccountByResetCode;
module.exports.changeReset = changeReset;
module.exports.findAll = findAll;
module.exports.manageCart = manageCart;
module.exports.setPushToken = setPushToken;
