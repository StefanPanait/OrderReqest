var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WorkFlow = new Schema({
    id: String,
    name: String,
    description: String,
    approvalLayers: Number,
    dateCreated: {
        type: Date,
        default: Date.now
    },
    approvers: []
});

var tempWorkFlow = mongoose.model('WorkFlow', WorkFlow);

var nextApprover = function(id, query, callback) {
    tempWorkFlow.findByID(id, null, {}, function(err, result) {
        if (err) callback(err, null);
        else {
            //do magic to FIO next approver
            //look at last action
            var next = result.approvers.indexOf(query[query.length-1].approver+1);
            callback(null, next);
        }

    });

};

var create = function(req_obj, callback) {
    var instance = new tempWorkFlow;

    if (req_obj.name) instance.name = req_obj.name;

    if (req_obj.description) instance.description = req_obj.description;

    if (req_obj.approvalLayers) instance.approvalLayers = req_obj.approvalLayers;

    for (var i = 0; i < req_obj.approvers.length; i++) {
        var approver = {};
        approver.order = req_obj.approvers[i].order;
        approver.username = req_obj.approvers[i].username;
        instance.approvers.push(approver);
    }

    instance.save(function(err, collection) {
        callback(err, collection);
    });
};

var generateUpdateObject = function(req_obj) {
    var instance = {
        approvers: []
    };

    if (req_obj.name) instance.name = req_obj.name;

    if (req_obj.description) instance.description = req_obj.description;

    if (req_obj.approvalLayers) instance.approvalLayers = req_obj.approvalLayers;

    if (req_obj.approvers) {
        for (var i = 0; i < req_obj.approvers.length; i++) {
            var approver = {};
            approver.order = req_obj.approvers[i].order;
            approver.username = req_obj.approvers[i].username;
            instance.approvers.push(approver);
        }
    }

    return instance;
}

var findAll = function(callback) {
    tempWorkFlow.find({},
        null, {},
        function(err, collection) {
            if (err) callback(err, null);
            else callback(null, collection);
        }
    );
};
var getCount = function(callback) {
    tempWorkFlow.count({}, function(err, len) {
        if (err) callback(err, null);
        else callback(null, len);
    });
};

module.exports = mongoose.model('WorkFlow', WorkFlow);
module.exports.create = create;
module.exports.findAll = findAll;
module.exports.generateUpdateObject = generateUpdateObject;
module.exports.getCount = getCount;