var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RequestAccount = new Schema({
    id: String,
    username: String,
    note: String,
    dateRequested: {
        type: Date,
        default: Date.now
    }
});

var tempRequestAccount = mongoose.model('RequestAccount', RequestAccount);

var create = function(req_obj, callback) {
    var instance = new tempRequestAccount();

    instance.username = req_obj.email;
    instance.note = req_obj.note;

    instance.save(function(err) {
        if (err) callback(err);
        else callback(null);
    });
}

var findAll = function(callback) {
    tempRequestAccount.find({},
        null, {},
        function(err, collection) {
            if (err) callback(err, null);
            else callback(null, collection);
        }
    );
}

var findByEmail = function(requestedEmail, callback) {
    tempRequestAccount.findOne({
            username: requestedEmail
        },
        null,
        callback);
};

var getCount = function(callback) {
    tempRequestAccount.count({}, function(err, len) {
        if (err) callback(err, null);
        else callback(null, len);
    });
};

module.exports = mongoose.model('RequestAccount', RequestAccount);
module.exports.create = create;
module.exports.findAll = findAll;
module.exports.findByEmail = findByEmail;
module.exports.getCount = getCount;
