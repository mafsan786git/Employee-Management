const express = require('express');
const router = express.Router();
const passport = require('passport');

const connection = require('../config/database');
const {ensureAuthenticated,forwardAuthenticated} = require('../config/auth');


//GET router
//public
//login
router.get('/login',forwardAuthenticated,(req, res, next)=>{
    res.render('login');
});

//POST router
//public
//login

router.post('/login',(req,res,next)=>{
   passport.authenticate('local',{
       successRedirect:'/dashboard',
       failureRedirect:'/login',
       failureFlash:true
   })(req,res,next);
});

//Get route 
//Private
//profile

router.get('/user/profile',ensureAuthenticated,(req,res,next)=>{
    if(req.user.table != 'user')
        res.redirect('/dashboard');
    else{
        var sql = `SELECT fname,lname FROM manager WHERE id=?`; 
        // var managerName;
        connection.query(sql,req.user.managerId,(err,result,fields)=>{
            if(err) throw err;
            // console.log(typeof result[0].fname);
            //console.log(typeof result[0].fulname);
            // managerName = result[0].fname + " " + result[0].lname;
            //console.log(result[0].fulname);
            res.render('profile',{
                user:req.user,
                managerName:result[0]
            });

        });
    }
});

//Get router
//public
//logout
router.get('/logout',(req,res,next)=>{
    req.logout();
    req.flash('success_msg','You are successfully logout');
    res.redirect('/login');
});




module.exports = router;