const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const app = express();

// app.use(express.static(__dirname + 'public'));

//passport config
require('./config/passport')(passport);


// for body parser
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');


//session
app.use(session({
    secret:'fdgshajkyj',
    resave:false,
    saveUninitialized:true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//Global variables
app.use(function (req,res,next) {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   
   next(); 
});

//bring all routes
const admin = require('./routes/admin.js');
const manager = require('./routes/manager.js');
const user = require('./routes/user.js');
const dashboard = require('./routes/dashboard.js');
//Routes
app.use('/admin',admin);
app.use('/manager',manager);
app.use('/',user);
app.use('/',dashboard);

// server setup
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`App is running at ${port}`));