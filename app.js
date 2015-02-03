require('newrelic');
var path = require('path'),
    express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    exphbs = require('express-handlebars'),
    LocalStrategy = require('passport-local').Strategy;

var app = express();

var errorHandler = require('express-error-handler'),
    handler = errorHandler({
        static: {
            '404': './public/404.html'
        }
    });
// Configuration
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.engine('handlebars', exphbs({
        defaultLayout: 'main'
    }));
    app.set('view engine', 'handlebars');
    app.set('view options', {
        layout: false
    });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('192829ssajmkkol'));
    app.use(express.session());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(errorHandler.httpError(404));
    app.use(handler);

});

// Configure development mode
app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

// Configure production mode
app.configure('production', function() {
    app.use(express.errorHandler());
});

// Configure passport
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate2()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Connect mongoose
//LOCAL
//mongoose.connect('mongodb://localhost/orders');
//PROD
mongoose.connect('mongodb://orderRequestAdmin:wtf4ndrei!@ds055680.mongolab.com:55680/order-request');

// Setup routes
require('./controller/routes')(app);

http.createServer(app).listen(process.env.PORT || 5000, function() {
    console.log("choo choo");
});
