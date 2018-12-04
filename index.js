const express = require('express')
const app = express();
const path = require('path')
const session = require("express-session");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport')
const MongoDBStore = require('connect-mongodb-session')(session);
const cors = require('cors');
const csrf = require('csurf');
const csrfProtection = csrf();
require('dotenv').config();
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost/express-planner"
const store = new MongoDBStore({
    uri: mongoUri,
    collection: 'mySessions'
});
store.on('connected', function() {
    store.client; // The underlying MongoClient object from the MongoDB driver
});
// Catch errors
store.on('error', function(error) {
    assert.ifError(error);
    assert.ok(false);
});
app.use(cors({
    origin: process.env.REACT_APP_ADDRESS,
    credentials: true,
    optionSuccessStatus: 200,
    exposedHeaders: ['x-auth-token']
}));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(morgan("short"));
app.use(session({ 
    secret: "cats",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 //a year why not?
    },
    store: store,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// app.use(csrfProtection);
require("./db/db");
require('./passport/config');
require('./passport/local-config');
require('./passport/google-config');

const authController = require('./controllers/authController');
const planController = require('./controllers/planController');
const stopController = require('./controllers/stopController');
const userController = require('./controllers/userController');
const invitationController = require('./controllers/invitationController');
const maps = require('./maps');

app.get('/', (req, res)=>{
    res.render('index.ejs');
})
app.get('/api/v1/location/:id', maps.getPlace)
app.use('/api/v1/auth', authController);
app.use('/api/v1/plans', planController);
app.use('/api/v1/plans/:planId/stops', function(req, res, next) {
    req.planId = req.params.planId; //so the nested routes have access to planId
    next()
  }, stopController)
app.use('/api/v1/users', userController)
app.use('/api/v1/invitations', invitationController);
//SEND ALL OTHER GETS TO REACT APP
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/front-end/build/index.html'));
});
app.use(function (err, req, res, next) {
    if (err.code == 'EBADCSRFTOKEN') {
    // handle CSRF token errors here
        console.log(req.body);
        res.status(403)
        res.json({
            data: err
        })
    } else {
        res.json({
            status: 400,
            data: err
        })
    }
})

const port = process.env.PORT || 9000
app.listen(port, ()=>{
    console.log("Server is active")
})