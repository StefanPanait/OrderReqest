var mongoose = require('mongoose'),
    utils = require("../utils/utility").utils,
    Schema = mongoose.Schema;

var Approval = new Schema({
    id: String
});

var tempApproval = mongoose.model('Approval', Approval);

var createApproval = function(req_obj, user, callback) {
    var instance = new tempApproval();
    var tempId = utils.makeID(10);

    instance.id = "TKT" + tempId;
    instance.description = req_obj.description;
    instance.issuerId = user._id;

    instance.save(function(err) {
        if (err) callback(err);
        else callback(null);
    });
};

var updateApprovalStatus = function(req_obj, handler, callback) {

};

var queryAll = function(callback) {
    tempApproval.find({},
        null, {},
        function(err, collection) {
            if (err) callback(err, null);
            else callback(null, collection);
        }
    );
};

module.exports = mongoose.model('Approval', Approval);
module.exports.createApproval = createApproval;
module.exports.queryAll = queryAll;
