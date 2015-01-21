var mongoose = require('mongoose'),
    utils = require("../utils/utility").utils,
    Schema = mongoose.Schema;

// var TicketHistory = new Schema({
//     status: TicketStatus,
//     comment: String,
//     dateAdded: {
//         type: Date,
//         default: Date.now
//     },
//     handlerId: String
// });

// var Status = {
//  NEW, HOLD_ON, SOLVE, OPEN
// }

var Ticket = new Schema({
    id: String,
    description: String,
    ticketHistory: [],
    category: {
        type: String,
        default: "GENERAL"
    },
    currentStatus: {
        type: String,
        default: "NEW"
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    issuerId: String
});

var tempTicket = mongoose.model('Ticket', Ticket);

var createTicket = function(req_obj, user, callback) {
    var instance = new tempTicket();
    var tempId = utils.makeID(10);

    instance.id = "TKT" + tempId;
    instance.description = req_obj.description;
    instance.issuerId = user._id;

    instance.save(function(err) {
        if (err) callback(err);
        else callback(null);
    });
};

var updateTicketStatus = function(req_obj, handler, callback) {

};

var queryAll = function(callback) {
    tempTicket.find({},
        null, {},
        function(err, collection) {
            if (err) callback(err, null);
            else callback(null, collection);
        }
    );
};

module.exports = mongoose.model('Ticket', Ticket);
module.exports.createTicket = createTicket;
module.exports.queryAll = queryAll;
