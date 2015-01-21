var passport = require("passport"),
    nodemailer = require("nodemailer"),
    utils = require('./utility');
utils.makeId = function(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < len; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};

utils.ensureApprover = function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.permissions == "Approver" || req.user.permissions == "Administrator") {
            return next();
        } else {
            res.redirect("back");
        }
    }
    res.redirect('/login');
};

utils.ensureAdmin = function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.permissions == "Administrator") {
            return next();
        } else {
            //logged in but the bitch is basic
            res.redirect("back");
        }
    }
    res.redirect('/login');
};

utils.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

utils.getExtension = function(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
};

utils.forgotPass = function(email, code) {
    var mailOptions = {
        from: "Robin Tang <tang8330@mylaurier.ca>", // sender address
        to: email,
        subject: "Forgot Password", // Subject line
        text: "Forgot Password", // plaintext body
        html: "<b>Forgot Password <a href='/forgotPassword/" + code + "'>Reset Pass</a></b>" // html body
    };
    return mailOptions;
};

utils.approveAccount = function(email, code) {
    var mailOptions = {
        from: "Robin Tang <tang8330@mylaurier.ca>", // sender address
        to: email,
        subject: "Reset Account", // Subject line
        text: "Reset Account", // plaintext body
        html: "<b>Reset Account, your password is " + code + "</b>" // html body
    };
    return mailOptions;
};

utils.smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "tang8330@mylaurier.ca",
        pass: "robino68"
    }
});


module.exports = exports = utils;
