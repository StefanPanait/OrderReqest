var passport = require("passport"),
    mongoose = require('mongoose'),
    Account = require("../models/account"),
    Vendor = require("../models/vendor"),
    Item = require("../models/item"),
    Category = require("../models/category"),
    Workflow = require("../models/workflow"),
    Order = require("../models/order"),
    Ticket = require("../models/tickets"),
    RequestAccount = require("../models/requestAccount"),
    mkdirp = require("mkdirp"),
    fs = require("fs"),
    moment = require("moment"),
    nodemailer = require("nodemailer"),
    utils = require("../utils/utility");

module.exports = function(app) {

    app.get("/approve/orders/:id", function(req, res) {
        Order.findByID(req.params.id, function(err, result) {
            res.render("approve/orders  ", {
                user: req.user,
                order: result
            });
        });
    });

    app.get("/cart", utils.ensureAuthenticated, function(req, res) {
        Item.queryByIDMany(req.user.cart, function(err, collection) {
            if (err) res.send(500);
            else {
                res.render("cart/main", {
                    user: req.user,
                    item: collection
                });
            }
        });

    });

    app.get("/cart/add/:id", utils.ensureAuthenticated, function(req, res) {
        Account.manageCart(req.params.id, req.user, function(err) {
            if (err) res.send(500);
            else {
                res.redirect("back");
            }
        });

    });





    //ROOT
    app.get('/', utils.ensureAuthenticated, function(req, res) {
        if (req.user.permissions == "Administrator") {
            //pull from request accounts, items, orders, and workflows
            RequestAccount.getCount(function(err, reqNumber) {
                if (err) res.send(500);
                else {
                    Workflow.getCount(function(err1, wfNumber) {
                        if (err) res.send(500);
                        else {
                            Item.getCount(function(err2, itemNumber) {
                                if (err) res.send(500);
                                else {
                                    res.render("admin/admin/main", {
                                        user: req.user,
                                        reqNumber: reqNumber,
                                        wfNumber: wfNumber,
                                        itemNumber: itemNumber
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            res.render('index', {
                user: req.user
            });
        }

    });


    //PRELOGIN FUNCTIONS
    app.get("/forgotpassword", function(req, res) {
        res.render('user/forgotPassword', {
            user: req.user
        });
    });
    app.post("/forgotPassword", function(req, res) {
        console.log("correct routing");
        Account.getAccountByUser(req.body.username, function(err, result) {
            if (err) {
                res.render("user/forgotPassword", {
                    user: req.user,
                    alert: {
                        msg: "There is no account with that email",
                        type: "alert-danger"
                    }
                });
            } else {
                console.log("found e-mail");
                Account.resetPass(result, function(err, code) {
                    if (err) {
                        res.render("user/forgotPassword", {
                            user: req.user,
                            alert: {
                                msg: "There was an error resetting your password",
                                type: "alert-danger"
                            }
                        });
                    } else {
                        var mailOptions = utils.forgotPass(req.body.username, code);
                        utils.smtpTransport.sendMail(mailOptions, function(error, response) {
                            if (err) {
                                res.render("user/forgotPassword", {
                                    user: req.user,
                                    alert: {
                                        msg: "There was an error sending the reset email",
                                        type: "alert-danger"
                                    }
                                });
                            } else {
                                res.render("user/forgotPassword", {
                                    user: req.user,
                                    alert: {
                                        msg: "A new password has been sent",
                                        type: "alert-success"
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    app.get("/forgotPassword/:id", function(req, res) {
        Account.getAccountByResetCode(req.params.id, function(err, result) {
            if (err) res.send(500);
            else if (!result) {
                res.send('Invalid Code');
            } else {
                res.render("user/resetPassword");
            }
        });
    });

    app.post("/forgotPassword/:id", function(req, res) {
        Account.getAccountByResetCode(req.params.id, function(err, result) {
            //joyce
            if (err) res.send(500);
            else if (!result) {
                res.send('Invalid Code');
            } else {
                //check
                var currentDate = new Date();
                if (result.forgotPass.used === false && result.forgotPass.validDate > currentDate) {
                    Account.changeReset(result, function(err) {
                        if (err) res.send(500);
                        else {
                            result.setPassword(req.body.password, function(err3, self) {
                                if (err3) res.send(500);
                                else {
                                    self.save(function(err4) {
                                        if (err4) res.send(500);
                                        else res.render("user/resetPassword", {
                                            message: "Successfully Changed"
                                        });

                                    });
                                }
                            });
                        }
                    });
                } else res.render("user/resetPassword", {
                    message: "Code has been Used"
                });
            }
        });
    });

    app.get("/login/error", function(req, res) {
        res.render('user/login', {
            user: req.user,
            alert: {
                msg: "Login failed",
                type: "alert-danger"
            }
        });
    });

    app.get('/login', function(req, res) {
        res.render('user/login', {
            user: req.user
        });
    });
    app.post('/login', passport.authenticate('local', { //TODO: this needs to display a message on failed login
        successRedirect: '/',
        failureRedirect: '/login/error',
    }));

    app.get('/setupPushToken', function(req, res) {
        console.log("getting page");
        res.render('user/setupPushToken', {
            user: req.user
        });
    });
    app.post("/setupPushToken", function(req, res) {
        var id = req.user._id;
        console.log(id);
        var pushToken = req.body.pushToken;
        var updateObject = Account.setPushToken(pushToken);
        Account.findByIdAndUpdate(
            id,
            updateObject,
            function(err) {
                if (err) {
                    console.log(err);
                    res.send(500);
                } else res.send(200);
            }
        );
    });



    app.get("/privacy", function(req, res) {
        res.render("legal/privacy", {
            user: req.user
        });
    });

    app.get("/terms", function(req, res) {
        res.render("legal/terms", {
            user: req.user
        });
    });

    app.get("/agreement", function(req, res) {
        res.render("legal/agreement", {
            user: req.user
        });
    });

    app.get('/requestAccount', function(req, res) {
        res.render('user/requestAccount', {
            user: req.user
        });
    });
    app.post('/requestAccount', function(req, res, next) {
        RequestAccount.create(req.body, function(err) {
            if (err) res.send(500);
            else {
                if (req.username = "orderr3quest@gmail.com") {
                    res.redirect('/manage/accounts');
                }
                res.render('user/requestAccount', {
                    user: req.user,
                    alert: {
                        msg: "Request Submitted",
                        type: "alert-success"
                    }
                });
            }
        });
    });

    app.get("/user/profile", utils.ensureAuthenticated, function(req, res) {
        res.render("user/profile", {
            user: req.user
        });
    });
    app.post("/user/profile", utils.ensureAuthenticated, function(req, res) {
        Account.updateITS(req.user, req.body, function(err) {
            var alert = {};
            if (err) {
                alert.msg = "Unable to save";
                alert.type = "alert-danger";
            } else {
                alert.msg = "Successfully saved";
                alert.type = "alert-success";
            }
            res.render("user/profile", {
                user: req.user,
                alert: alert
            });
        });

    });
    //TODO: merge this into profile
    app.get("/user/profile/edit", utils.ensureAuthenticated, function(req, res) {
        res.render("user/editProfile", {
            user: req.user
        });
    });

    app.get("/user/changePassword", utils.ensureAuthenticated, function(req, res) {
        res.render("user/changepassword", {
            user: req.user
        });
    });
    app.post('/user/changePassword', utils.ensureAuthenticated, function(req, res) {
        req.user.authenticate(req.body.oldPassword, function(err, result) {
            if (result === false) {
                res.render("user/changePassword", {
                    user: req.user,
                    alert: {
                        msg: "Wrong password",
                        type: "alert-danger"
                    }
                });
            } else if (req.body.newPassword !== req.body.confirmNewPassword) {
                res.render("user/changePassword", {
                    user: req.user,
                    alert: {
                        msg: "New passwords do not match!",
                        type: "alert-danger"
                    }
                });
            } else {
                result.setPassword(req.body.newPassword, function(err3, self) {
                    if (err3) {
                        res.render('user/changePassword', {
                            user: req.user,
                            alert: {
                                msg: "Could not be saved, please try again",
                                type: "alert-danger"
                            }
                        });
                    }
                    self.save(function(err4) {
                        if (err4) {
                            res.render('user/changePassword', {
                                user: req.user,
                                alert: {
                                    msg: "Could not be saved, please try again",
                                    type: "alert-danger"
                                }
                            });
                        } else {
                            res.render('index', {
                                user: req.user,
                                alert: {
                                    msg: "Your password has been changed",
                                    type: "alert-success"
                                }
                            });
                        }
                    });
                });
            }
        });
    });

    app.get('/user/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    //END USER FUNCTIONS
    //SIDE NAV
    app.get("/shopping", utils.ensureAuthenticated, function(req, res) {
        Item.findAll(function(err, collection) {
            if (err) res.send(500);
            else {
                Category.findAll(function(err2, categories) {
                    if (err2) res.send(500);
                    else {
                        Workflow.findAll(function(err2, workflows) {
                            if (err2) res.send(500);
                            else {
                                res.render("shopping", {
                                    user: req.user,
                                    items: JSON.stringify(collection),
                                    categories: JSON.stringify(categories),
                                    workflows: JSON.stringify(workflows)
                                });
                            }
                        });
                    }
                });
            }
        });
    });


    app.post("/shopping", utils.ensureAuthenticated, function(req, res) {
        var imagesArr = [];
        Item.create(req.body, function(err, result) {
            if (err) res.send(500);
            else {
                var path = __dirname + "/../public/assets/" + result.id;
                fs.exists(path, function(exists) {
                    if (!exists) mkdirp(path, function(err) {});
                });
                fs.readFile(req.files.file.path, function(err, data) {
                    var newPath = path + "/" + req.files.file.name;
                    var extension = utils.getExtension(req.files.file.name);
                    extension = extension.toLowerCase();
                    if (extension == ".jpeg" || extension == ".jpg" || extension == ".gif" || extension == ".png") imagesArr.push("/assets/" + result.id + "/" + req.files.file.name);
                    else filesArr.push("/assets/" + result.id + "/" + req.files.file.name);
                    Item.addFiles(result, imagesArr, null, filesArr, function(err) {
                        if (err) res.send(500);
                        else {
                            fs.writeFile(newPath, data, function(err) {
                                res.redirect("back");
                            });
                        }
                    });
                });
            }
        });
    });

    //SIDE NAV: MANAGE
    //, utils.ensureApprover    
    app.get("/manage/accounts", utils.ensureAuthenticated, function(req, res) {
        Account.findAll(function(err, currentAccounts) {
            if (err) res.send(500);
            else {
                RequestAccount.findAll(function(err, pendingAccounts) {
                    if (err) res.send(500);
                    else {
                        for (var i = 0; i < currentAccounts.length; i++) {
                            var temp = currentAccounts[i].dateAdded;
                            delete currentAccounts[i].dateAdded;
                            currentAccounts[i].dateAdded = moment(temp).format("L");



                            /**
                             * TODO: This is a hacky way of doing things, since this only needs to be parsed once, just store it
                             *
                             *
                             *
                             *
                             **/




                        }
                        res.render("manage/accounts", {
                            user: req.user,
                            currentAccounts: JSON.stringify(currentAccounts),
                            pendingAccounts: JSON.stringify(pendingAccounts)
                        });
                    }
                });
            }
        });
    });
    app.post("/manage/accounts/delete", function(req, res) {
        Account.findByIdAndRemove(req.body._id, function(err) {
            if (err) {
                console.log(err);
                res.send(500);
            } else res.send(200);
        });
    });
    app.post("/manage/accounts/update", function(req, res) {
        var id = req.body._id;
        var updateObject = Account.generateUpdateObject(req.body);
        Account.findByIdAndUpdate(
            id,
            updateObject,
            function(err) {
                if (err) {
                    console.log(err);
                    res.send(500);
                } else res.send(200);
            }
        );
    });
    app.post("/manage/accounts/approve", function(req, res) {
        console.log("approving account");
        var code = utils.makeId(5); //temp password
        var dateRequested = "";
        RequestAccount.findById(req.body._id, function(err, collection) {
            if (err) {
                console.log(err);
                res.send({
                    error: err
                });
                return;
            } else {
                dateRequested = collection.dateRequested;
            }
            Account.register(
                new Account({
                    username: req.body.username,
                    dateRequested: dateRequested
                }),
                code,
                function(err, result) {
                    if (err) {
                        console.log(err);
                        res.send({
                            error: err
                        });
                    } else {
                        console.log("trying to send mail");
                        mailOptions = utils.approveAccount(req.body.username, code);
                        console.log("please");
                        utils.smtpTransport.sendMail(mailOptions, function(err, response) {

                            console.log(code);
                            if (err) {
                                console.log(err);
                                res.send({
                                    error: err
                                });
                            } else {
                                console.log("sent mail apparently");
                                RequestAccount.findByIdAndRemove(req.body._id, function(err) {
                                    if (err) {
                                        console.log(err);
                                        res.send({
                                            error: err
                                        });
                                    } else {
                                        var newAccount = result;
                                        res.send({
                                            newAccount: newAccount
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            );
        });
    });
    app.post("/manage/accounts/reject", function(req, res) {
        RequestAccount.findByIdAndRemove(req.body._id, function(err) {
            if (err) {
                console.log(err);
                res.send(500);
            } else res.send(200);
        });
    });

    //Manage/Vendors
    app.get("/manage/vendors", utils.ensureAuthenticated, function(req, res) {
        Vendor.findAll(function(err, collection) {
            if (err) res.send(500);
            else {
                res.render('manage/vendors', {
                    user: req.user,
                    vendors: JSON.stringify(collection)
                });
            }
        });
    });
    app.post("/manage/vendors/create", function(req, res) {
        Vendor.create(req.body, function(err, collection) {
            if (err) {
                console.log(err);
                res.send(500);
            } else res.send(collection);
        });
    });

    app.post("/manage/vendors/update", function(req, res) {
        var id = req.body._id;
        var updateObject = Vendor.generateUpdateObject(req.body);
        Vendor.findByIdAndUpdate(id, updateObject, function(err) {
            if (err) {
                console.log(err);
                res.send(500);
            } else res.send(200);
        });
    });

    app.post("/manage/vendors/delete", function(req, res) {
        var id = req.body._id;
        Vendor.findByIdAndRemove(id, function(err) {
            if (err) {
                console.log(err);
                res.send(500);
            } else res.send(200);
        });
    });

    app.get("/manage/shop", utils.ensureAuthenticated, function(req, res) {
        Item.findAll(function(err, collectionItem) {
            if (err) res.send(500);
            else {
                Vendor.findAll(function(err, collectionVendor) {
                    if (err) res.send(500);
                    else {
                        Category.findAll(function(err, collectionCategory) {
                            if (err) res.send(500);
                            else {
                                console.log(collectionItem);
                                res.render("manage/shop", {
                                    user: req.user,
                                    dataItem: JSON.stringify(collectionItem),
                                    dataCategory: JSON.stringify(collectionCategory),
                                    dataVendor: JSON.stringify(collectionVendor)
                                });
                            }
                        });
                    }
                });
            }
        });
    });

    app.post("/manage/shop/createItem", function(req, res) {
        Item.create(req.body, function(err, collection) {
            if (err) {
                res.send(500);
            } else res.send(collection);
        });
    });
    app.post("/manage/shop/updateItem", function(req, res) {
        var id = req.body._id;
        var updateObject = Item.generateUpdateObject(req.body);
        Item.findByIdAndUpdate(
            id,
            updateObject,
            function(err) {
                if (err) {
                    console.log(err);
                    res.send(500);
                } else res.send(200);
            }
        );
    });
    app.post("/manage/shop/deleteItem", function(req, res) {
        Item.findByIdAndRemove(req.body._id, function(err) {
            if (err) {
                console.log(err);
                res.send(500);
            } else res.send(200);
        });
    });

    app.post("/manage/shop/createCategory", function(req, res) {
        console.log("creating");
        console.log(req.body);
        Category.create(req.body, function(err, collection) {
            if (err) {
                console.log(err);
                res.send(500);
            } else res.send(collection);
        });
    });
    app.post("/manage/shop/updateCategory", function(req, res) {
        var id = req.body._id;
        var updateObject = Category.generateUpdateObject(req.body);
        Category.findByIdAndUpdate(
            id,
            updateObject,
            function(err) {
                if (err) {
                    console.log(err);
                    res.send(500);
                } else res.send(200);
            }
        );
    });
    app.post("/manage/shop/deleteCategory", function(req, res) {
        Category.findByIdAndRemove(req.body._id, function(err) {
            if (err) {
                console.log(err);
                res.send(500);
            } else res.send(200);
        });
    });
    //manage/workflow
    app.get("/manage/workflows", utils.ensureAuthenticated, function(req, res) {
        Workflow.findAll(function(err, collectionWF) {
            if (err) res.send(500);
            else {
                Account.findAll(function(err, collectionAcct) {
                    if (err) res.send(500);
                    else {
                        res.render("manage/workflows", {
                            user: req.user,
                            dataWF: JSON.stringify(collectionWF),
                            dataAcct: JSON.stringify(collectionAcct)
                        });
                    }
                });
            }
        });
    });

    app.post("/manage/workflow/create", function(req, res) {
        Workflow.create(req.body, function(err, collection) {
            if (err) {
                console.log(err);
                res.send(500);
            } else res.send(collection);
        });
    });
    app.post("/manage/workflow/update", function(req, res) {
        var id = req.body._id;
        var updateObject = Workflow.generateUpdateObject(req.body);
        Workflow.findByIdAndUpdate(
            id,
            updateObject,
            function(err) {
                if (err) {
                    console.log(err);
                    res.send(500);
                } else res.send(200);
            }
        );
    });
    app.post("/manage/workflow/delete", function(req, res) {
        Workflow.findByIdAndRemove(req.body._id, function(err) {
            if (err) {
                console.log(err);
                res.send(500);
            } else res.send(200);
        });
    });


    //ORDERS
    app.get("/orders/mobile", function(req, res) {
        Order.findAll(function(err, collection) {
            if (err) {
                res.send(500);
            } else {
                console.log(collection);
                res.render("approve/ordersMobile", {
                    user: req.user,
                    orders: JSON.stringify(collection[0])
                });
            }
        });
    });
    app.get("/orders", utils.ensureAuthenticated, function(req, res) {
        Order.findAll(function(err, collection) {
            if (err) {
                res.send(500);
            } else {
                console.log(collection);
                res.render("approve/orders", {
                    user: req.user,
                    orders: JSON.stringify(collection)
                });
            }
        });
    });
    app.post("/orders/create", function(req, res) {
        Order.create(req.body, req.user, function(err) {
            if (err) {
                console.log("we have an error");
                console.log(err);
                res.send(500);
            } else res.send(200);
        });
    });
    app.post("/orders/update", function(req, res) {
        console.log("correct route");
        var id = req.body._id;
        console.log("got the id");
        var updateObject = Order.generateUpdateObject(req.body);
        Order.findByIdAndUpdate(
            id,
            updateObject,
            function(err) {
                if (err) {
                    console.log(err);
                    res.send(500);
                } else res.send(200);
            }
        );
    });


    //MOBILE
    app.get("/api/loggedIn", function(req, res) {
        if (req.user) res.send(200, req.user);
        else res.send(200, null);
    });

    app.get("/api/loggedIn", function(req, res) {
        if (req.user) res.send(200, req.user);
        else res.send(200, null);
    });

    app.get("/item/:id", utils.ensureAuthenticated, function(req, res) {
        Item.queryByID(req.params.id, function(err, result) {
            res.render("cart/product", {
                user: req.user,
                product: result
            });
        });
    });

    //HELP
    app.get("/help/FAQ", utils.ensureAuthenticated, function(req, res) {});

    app.post("help/ticket/submit", function(req, res) {
        //TODO: update the to: address
        //TODO: update subject prefix
        var mailOptions = {
            from: req.user.firstName + " " + req.user.lastName + "<" + req.user.username + ">", // sender address
            to: req.user.username,
            cc: "tang8330@mylaurier.ca",
            subject: "Ticket: " + req.body.subject, // Subject line
            text: req.body.text
        };
        utils.smtpTransport.sendMail(mailOptions, function(error, response) {
            var alertType,
                msg;
            if (error) {
                alertType = "alert-danger";
                msg = "The ticket could not be sent";
            } else {
                alertType = "alert-success";
                msg = "E-mail successfully sent";
            }
            res.render('index', {
                user: req.user,
                msg: msg,
                alertType: alertType
            });
        });
    });
};
