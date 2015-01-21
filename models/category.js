var mongoose = require('mongoose'),
    utils = require("../utils/utility").utils,
    Schema = mongoose.Schema;

var Category = new Schema({
    name: String,
    dateCreated: {
        type: Date,
        default: Date.now
    },
});

var tempCategory = mongoose.model('Category', Category);

var create = function(req_obj, callback) {
    var instance = new tempCategory();

    instance.name = req_obj.name;

    instance.save(function(err, result) {
        callback(err, result);
    });
};

var findAll = function(callback) {
    tempCategory.find({},
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

    return instance;
}
module.exports = mongoose.model('Category', Category);

module.exports.findAll = findAll;
module.exports.create = create;
module.exports.generateUpdateObject = generateUpdateObject;
