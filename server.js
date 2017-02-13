const express = require('express');
const path = require('path');
const session = require('express-session');
const errorHandler = require('errorhandler');
const flash = require('express-flash');
const chalk = require('chalk');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const multer = require('multer');
const dotenv = require('dotenv');
const uploadStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
const upload = multer({ storage: uploadStorage })
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const lusca = require('lusca');
const passport = require('passport');

// global
global.appRoot = path.resolve(__dirname) + '/';

dotenv.load({ path: '.env.dev' })

// app environments
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: process.env.MONGODB_URI,
        autoReconnect: true,
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native'
    })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
if ('development' == app.get('env')) { }

// mongoDB.
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', () => {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});

// csrf
app.use((req, res, next) => {
    if (req.path === '/upload') {
        next();
    } else {
        lusca.csrf()(req, res, next);
    }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use((req, res, next) => {
    // After successful login, redirect back to the intended page
    if (!req.user &&
        req.path !== '/login' &&
        req.path !== '/signup' &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    } else if (req.user &&
        req.path == '/account') {
        req.session.returnTo = req.path;
    }
    next();
});

// controllers
const userController = require('./controllers/userController');
const homeController = require('./controllers/homeController');
const contactController = require('./controllers/contactController');
const uploadController = require('./controllers/uploadController');

const passportConfig = require('./config/passport');

// routes
app.get('/', homeController.index);
app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);

app.get('/upload', uploadController.getFileUpload);
app.post('/upload', upload.single('myFile'), uploadController.postFileUpload);

app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.get('/account', passportConfig.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConfig.isAuthenticated, userController.getOauthUnlink);

// api
const router = express.Router();
const userApiRouter = require('./controllers/api/userApiController');

router.get('/', function (req, res) {
    res.json({ status: 'Working' });
});

app.use('/api', router);
app.use('/api/users', userApiRouter);

// error handler
app.use(errorHandler());

// css
app.use(express.static(path.join(__dirname, 'public')));

// start app
app.listen(app.get('port'), () => {
    console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
});

module.exports = app;