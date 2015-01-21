var mongoose = require('mongoose'),
    utils = require("../utils/utility"),
    Schema = mongoose.Schema;

var Order = new Schema({
    //static properties
    issuer: {}, // issuer object
    dateCreated: {
        type: Date,
        default: Date.now
    }, //self-explanatory
    trackingCode: {
        type: String,
        value: utils.makeId(5)
    }, //need to create a 8-10 code, that isn't the autogen id
    workflow: {}, // workflow object
    note: String,
    items: [], //list of items

    //dynamic properties
    status: {
        type: String,
        default: "pending"
    }, //pending, completed, onHold, archived
    completionDate: Date, //date it was completed for auditory purposes
    updates: [], // list of {text,date}
    currentApprover: {
        type: Number,
        default: 0
    }
});

var tempOrder = mongoose.model('Order', Order);

var userAction = function(id, action, callback) {


};


var findAll = function(callback) {
    //removeAll();
    tempOrder.find({},
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

//NOT DONE
var create = function(req_obj, user, callback) {
    var instance = new tempOrder;

    if (user) instance.issuer = user;
    if (req_obj.items) {
        for (var i = 0; i < req_obj.items.length; i++) {
            delete req_obj.items[i]['$$hashKey']; //used for angular sorting
        }
        instance.items = req_obj.items;
    }
    if (req_obj.workflow) {
        delete req_obj.workflow['$$hashKey'];
        instance.workflow = req_obj.workflow;
    }
    if (req_obj.note) instance.note = req_obj.note;

    instance.save(function(err, collection) {
        callback(err, collection);
    });
}

var findByID = function(query, callback) {

    tempOrder.find({
        "_id": query

    }, null, {}, function(err, result) {
        if (err) callback(err, null);
        else {
            callback(null, result);
        }
    });

};

var getCount = function(callback) {
    tempOrder.count({}, function(err, len) {
        if (err) callback(err, null);
        else callback(null, len);
    });
};

var removeAll = function() {
    tempOrder.remove(function(err) {

    });
}

var generateUpdateObject = function(req_obj) {
    var instance = {};
    console.log("building the object")
    if (req_obj.status) instance.status = req_obj.status;
    if (req_obj.completionDate) instance.completionDate = req_obj.completionDate;
    if (req_obj.updates) instance.updates = req_obj.updates;
    if (req_obj.currentApprover) instance.currentApprover = req_obj.currentApprover;
    console.log("builtthe object")
    console.log(instance);
    return instance;

}

module.exports = mongoose.model('Order', Order);
module.exports.findAll = findAll;
module.exports.create = create;
module.exports.findByID = findByID;
module.exports.getCount = getCount;
module.exports.generateUpdateObject = generateUpdateObject;
