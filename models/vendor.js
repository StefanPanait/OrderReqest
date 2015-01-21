var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Vendor = new Schema({
    id: String,
    name: String,
    address: String, //self
    phone: String,
    email: String,
    dateCreated: {
        type: Date,
        default: Date.now
    }, //date added
    contacts: [] //contacts info
});

var tempVendor = mongoose.model('Vendor', Vendor);

var create = function(req_obj, callback) {
    var instance = new tempVendor();

    instance.name = req_obj.name;
    instance.address = req_obj.address;
    instance.phone = req_obj.phone;
    instance.email = req_obj.email;

    if (req_obj.contacts) {
        for (var i = 0; i < req_obj.contacts.length; i++) {
            var vendContact = {};
            vendContact.name = req_obj.contacts[i].name;
            vendContact.email = req_obj.contacts[i].email;
            vendContact.phone = req_obj.contacts[i].phone;
            vendContact.position = req_obj.contacts[i].position;
            vendContact.note = req_obj.contacts[i].note;
            instance.contacts.push(vendContact);
        }
    }

    instance.save(function(err, collection) {
        callback(err, collection);
    });
};

var findAll = function(callback) {
    tempVendor.find({},
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
    var instance = {
        contacts: []
    };

    if (req_obj.name) instance.name = req_obj.name;

    if (req_obj.address) instance.address = req_obj.address;

    if (req_obj.phone) instance.phone = req_obj.phone;

    if (req_obj.email) instance.email = req_obj.email;

    if (req_obj.contacts) {
        for (var i = 0; i < req_obj.contacts.length; i++) {
            var vendContact = {};
            vendContact.name = req_obj.contacts[i].name;
            vendContact.email = req_obj.contacts[i].email;
            vendContact.phone = req_obj.contacts[i].phone;
            vendContact.position = req_obj.contacts[i].position;
            vendContact.note = req_obj.contacts[i].note;
            instance.contacts.push(vendContact);
        }
    }

    return instance;
}

module.exports = mongoose.model('Vendor', Vendor);
module.exports.create = create;
module.exports.findAll = findAll;
module.exports.generateUpdateObject = generateUpdateObject;
