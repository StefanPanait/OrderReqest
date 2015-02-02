var mongoose = require('mongoose'),
    utils = require("../utils/utility").utils,
    Schema = mongoose.Schema;

var Item = new Schema({
    name: String,
    description: String,
    price: Number,
    url: String,
    category: String,
    vendor: String,
    picture: String,
    dateAdded: {
        type: Date,
        default: Date.now
    } //date added

});

var tempItem = mongoose.model('Item', Item);

var create = function(req_obj, callback) {
    var instance = new tempItem();

    instance.name = req_obj.name;
    instance.description = req_obj.description;
    instance.price = req_obj.price;
    instance.url = req_obj.url;
    instance.category = req_obj.category;
    instance.vendor = req_obj.vendor;
    instance.picture = req_obj.picture;

    instance.save(function(err, result) {
        callback(err, result);
    });
};

var findAll = function(callback) {
    tempItem.find({},
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

var generateUpdateObject = function(req_obj) {
    var instance = {};

    if (req_obj.name) instance.name = req_obj.name;
    if (req_obj.description) instance.description = req_obj.description
    if (req_obj.price) instance.price = req_obj.price;
    if (req_obj.url) instance.url = req_obj.url;
    if (req_obj.category) instance.category = req_obj.category;
    if (req_obj.vendor) instance.vendor = req_obj.vendor;
    if (req_obj.picture) instance.picture = req_obj.picture;

    return instance;
}
var queryByIDMany = function(query, callback) {
    tempItem.find({
        'id': {
            $in: query
        }
    }, null, {}, function(err, collection) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, collection);
        }
    });
};
var getCount = function(callback) {
    tempItem.count({}, function(err, len) {
        if (err) callback(err, null);
        else callback(null, len);
    });
};

module.exports = mongoose.model('Item', Item);
module.exports.create = create;
module.exports.findAll = findAll;
module.exports.generateUpdateObject = generateUpdateObject;
module.exports.queryByIDMany = queryByIDMany;
module.exports.getCount = getCount;
