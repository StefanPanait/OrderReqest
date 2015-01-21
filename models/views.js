var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Order = new Schema({
    accessLevel: String,
    views : []
});

var tempOrder = mongoose.model('Order', Order);

var addViews = function(req_obj, callback) {
    var instance = new tempOrder();
    //blah blah blah
    instance.save(function(data) {
        if (err) callback(err, null);
        else callback(null, data);

    })


}
var findAll = function(callback) {
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

module.exports = mongoose.model('Order', Order);
module.exports.addViews = addViews;
module.exports.findAll = findAll;
