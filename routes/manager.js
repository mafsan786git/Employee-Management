const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const connection = require('../config/database');
const {ensureAuthenticated,forwardAuthenticated} = require('../config/auth');

//POST router
//public
//login

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/login',
        failureRedirect:'/login',
        failureFlash:true

    })(req,res,next);
});

//Get route 
//Private
//profile

router.get('/profile',ensureAuthenticated,(req,res,next)=>{
    if(req.user.table != 'manager')
        res.redirect('/dashboard');
    else{
        var sql = `SELECT fname,lname FROM admin WHERE id=?`; 
            // var managerName;
        connection.query(sql,req.user.adminId,(err,result)=>{
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

//GET route
//private
//add memeber

router.get('/add',ensureAuthenticated,(req,res,next)=>{
    if(req.user.table != 'manager')
        res.redirect('/dashboard');
    else{
        res.render('add',{
            user:req.user
        });
    }
});

//POST route
//private
//add memeber

router.post('/add',(req,res,next)=>{
    const {fname,lname,email,gender,password,password2} = req.body;
    const errors=[];
    if(password!=password2){
        errors.push({msg:'Password do not match'});
    }
    if(password.length < 6){
        errors.push({msg:'Password must be atleast 6 character'});
    }
    if (errors.length>0) {
        res.render('add',{
            errors,
            fname: fname,
            lname: lname,
            email: email,
            gender: gender,
            password: password,
            password2: password2,
            user:req.user
        });
    }else{
        var sql = `SELECT COUNT(*) AS cnt FROM login WHERE email=?`;
        connection.query(sql,email,(err,result)=>{
            if(err) throw err;

            if (result[0].cnt) {
                errors.push({msg:'Email already exists'});
                res.render('add',{
                    errors,
                    fname: fname,
                    lname: lname,
                    email: email,
                    gender: gender,
                    password: password,
                    password2: password,
                    user:req.user
                });
            }else{
                var login = {
                    "email":req.body.email,
                    "password":req.body.password,
                    "flag":"user"
                };
                var employee = {
                    "fname": req.body.fname,
                    "lname": req.body.lname,
                    "email": req.body.email,
                    "gender": req.body.gender,
                    "managerId":req.user.id
                };
                bcrypt.genSalt(10,(err,salt)=>{
                    if(err) throw err;
                    bcrypt.hash(login.password,salt,(err,hash)=>{
                        if(err) throw err;
                        login.password = hash;
                        var sql2 = `INSERT INTO login SET ?`;
                        connection.query(sql2,login,(err,result)=>{
                            if(err) 
                                throw err;
                            else{
                                var sql1 = `INSERT INTO user SET ?`;
                                connection.query(sql1,employee,(err,row)=>{
                                    if(err) 
                                        throw err;
                                    req.flash('success_msg','You are successfully added One Employee');
                                    // errors.push({msg:'You are succesfully registered now you can login'});
                                    res.redirect('/manager/add');
                                    // res.render('add',{
                                    //     user:req.user
                                    // });

                                });
                            }
                        });
                    });
                });
            }
        });
    }
});


//GET route
//private
//employee

router.get('/employee',ensureAuthenticated,(req,res,next)=>{
    if(req.user.table!='manager')
        res.redirect('/dashboard');
    else{
        const errors = [];
        let sql1 = `SELECT * FROM user WHERE managerId=?`;
        connection.query(sql1,req.user.id,(err,result)=>{
            if(err) throw err;
            if(!result.length){
                errors.push({msg:'You have not added employee yet'});
                res.render('employee',{
                    errors,
                    user:req.user,
                    mng:result
                });
            }else{
                res.render('employee',{
                    user:req.user,
                    mng:result
                });
            }
        });
    }
});



module.exports = router;