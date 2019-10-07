const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const util = require('util');  
const async = require('async');


//load mysql connection

const connection = require('../config/database');
const { ensureAuthenticated,forwardAuthenticated} = require('../config/auth');

// router.post('/login',(req,res,next)=>{
//     passport.authenticate('local',{
//         successRedirect:'/login',
//         failureRedirect:'/login',
//         failureFlash:true

//     })(req,res,next);
// });


router.get('/register',forwardAuthenticated, (req,res)=>{
    res.render('register');
});

// POST route
// public
// registration
router.post('/register',(req,res)=>{
    const {fname,lname,email,gender,password,password2} = req.body;
    let errors=[];

    if(password!=password2){
        errors.push({msg:'Password do not match'});
    }
    if(password.length < 6){
        errors.push({msg:'Password must be atleast 6 character'});
    }
    if (errors.length>0) {
        res.render('register',{
            errors,
            fname: fname,
            lname: lname,
            email: email,
            gender: gender,
            password: password,
            password2: password2
        });  
    }else{
        var db = 'login';
        var sql = `SELECT COUNT(*) AS cnt FROM ${db} WHERE email=?`;
        connection.query(sql,email,(err,result)=>{
            if(err) throw err;
            if (result[0].cnt) {
                errors.push({msg:'Email already exists'});
                res.render('register',{
                    errors,
                    fname: fname,
                    lname: lname,
                    email: email,
                    gender: gender,
                    password: password,
                    password2: password
                });
            }else{
                var admin = {
                    "fname": req.body.fname,
                    "lname": req.body.lname,
                    "email": req.body.email,
                    "gender": req.body.gender,
                };
                var login = {
                    "email":req.body.email,
                    "password":req.body.password,
                    "flag":"admin"

                };
                bcrypt.genSalt(10,(err,salt)=>{
                    if(err) throw err;
                    bcrypt.hash(password,salt,(err,hash)=>{
                        if(err) throw err;
                        login.password = hash;
                        var sql = 'INSERT INTO login SET ?';
                        connection.query(sql,login,(err,result)=>{
                            if(err)
                                throw err;
                            else{
                                var sql1 = 'INSERT INTO admin SET ?';
                                connection.query(sql1,admin,(err,result)=>{
                                    if(err) throw err;
                                    req.flash('success_msg','You are succesfully registered now you can login');
                                    res.redirect('/login');
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
//add memeber

router.get('/add',ensureAuthenticated,(req,res)=>{
    if(req.user.table != 'admin')
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

router.post('/add',(req,res)=>{ 
    const {sellist,fname,lname,email,gender,password,password2} = req.body;
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
            sellist:sellist,
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
                    sellist:sellist,
                    fname: fname,
                    lname: lname,
                    email: email,
                    gender: gender,
                    password: password,
                    password2: password,
                    user:req.user
                });
            }else{
                var employee;
                var  login = {
                    "email":req.body.email,
                    "password":req.body.password,
                    "flag":req.body.sellist
                };
                if(sellist == 'manager')
                {
                    employee = {
                        "fname": req.body.fname,
                        "lname": req.body.lname,
                        "email": req.body.email,
                        "gender": req.body.gender,
                        "adminId":req.user.id
                    };
                }else{
                    employee = {
                        "fname": req.body.fname,
                        "lname": req.body.lname,
                        "email": req.body.email,
                        "gender": req.body.gender,
                    };

                }
                bcrypt.genSalt(10,(err,salt)=>{

                    if(err) throw err;

                    bcrypt.hash(login.password,salt,(err,hash)=>{
                        if(err) throw err;
                        login.password = hash;
                        var sql = `INSERT INTO login SET ?`;
                        connection.query(sql,login,(err,result)=>{
                            if(err) 
                                throw err;
                            else{
                                    var sql1 = `INSERT INTO ${req.body.sellist} SET ?`;
                                    connection.query(sql1,employee,(err,row)=>{
                                        if(err) throw err;
                                        var name = `${sellist}`;
                                        req.flash('success_msg','You are successfully added '+name+' !.');
                                        // errors.push({msg:'You are succesfully registered now you can login'});
                                        res.redirect('/admin/add');
                                    });
                            }
                            // res.render('add',{
                            //     user:req.user
                            // });

                        });
                    });
                });
            }
        });

    }
});

//Get route 
//Private
//profile
router.get('/profile',ensureAuthenticated,(req,res,next)=>{
    if(req.user.table != 'admin')
        res.redirect('/dashboard');
    else{
        res.render('profile',{
            user:req.user
        });
    }
});


//GET route
//Private
//controle
router.get('/controle',ensureAuthenticated,(req,res)=>{
    if(req.user.table != 'admin')
        res.redirect('/dashboard');
    else{
        res.render('controle',{
            user:req.user
        });
    }
});

//POST route
//Private
//controle
router.post('/controle',(req,res)=>{
    const {manageremail,useremail} = req.body;
    const errors=[];
    if(manageremail == useremail)
        errors.push({msg:'They can not assign themself'});
    if(errors.length>0)
    {
        res.render('controle',{
            errors,
            manageremail,
            useremail,
            user:req.user
        });
    }else{
        //checking manager
        var sql1 = `SELECT * FROM manager WHERE email=?`;
        connection.query(sql1,manageremail,(err,result)=>{
            if(err) console.log('sql1 '+err);
            if (!result.length) {
                errors.push({msg:'manager email does not exists'});
                res.render('controle',{
                    errors,
                    manageremail,
                    useremail,
                    user:req.user
                });
           }else{
            //    cheking user
            var sql2 = `SELECT * FROM user WHERE email=?`;
            connection.query(sql2,useremail,(err,row)=>{
                if(err) console.log('sql2 '+err);
                if (!row.length) {
                    errors.push({msg:'employee email does not exists'});
                    res.render('controle',{
                        errors,
                        manageremail,
                        useremail,
                        user:req.user
                    });
               }else if (row[0].managerId == result[0].id) {
                    errors.push({msg:'Employee is already assigned'});
                    res.render('controle',{
                        errors,
                        manageremail,
                        useremail,
                        user:req.user
                    });
               }else{
                   var sql3 = `UPDATE user SET managerId=${result[0].id} WHERE email=?`;
                   //console.log(typeof result[0].id);
                   connection.query(sql3,useremail,(err,results)=>{
                       if(err) throw err;
                    //    console.log(util.inspect(result, showHidden=false, depth=2, colorize=true));
                    //    if(!results.length)
                    //     {
                    //         errors.push({msg:'Something is wrong'});
                    //         res.render('controle',{
                    //             errors,
                    //             user:req.user
                    //         });
                    //     }
                    
                        req.flash('success_msg','Successfully assigned manager to employee');
                        res.redirect('/admin/controle');
                   });
               }
            });

           }
        });
    }

});


//GET route
//private
//employee

router.get('/employee',ensureAuthenticated,(req,res,next)=>{
    if(req.user.table!='admin')
        res.redirect('/dashboard');
    else{
        const errors = [];
        let sql1 = `SELECT * FROM manager WHERE adminId=?`;
         connection.query(sql1,req.user.id,(err,result,fields)=>{
            if(err) throw err;
            if(!result.length){
                errors.push({msg:'You have not added employee yet'});
                res.render('employee',{
                    errors,
                    user:req.user,
                    mng:result,
                });
            }else{
                const emps = [];
                async.forEachOf(result,(value,key,callback)=>{
                   var sql2 = `SELECT * FROM user WHERE managerId = ?`;
                   connection.query(sql2,value.id,(err,row)=>{
                    if(!err)
                    {
                        if(row.length > 0){
                            let mng_name = {
                                    "firstname":value.fname,
                                    "lastname":value.lname
                            };
                            row.push(mng_name);
                            emps.push(row);
                         console.log('row at every : ');
                         console.log(util.inspect(row[row.length-1], showHidden=false, depth=2, colorize=true));
                         console.log('emps at every : ');
                         console.log(util.inspect(emps, showHidden=false, depth=2, colorize=true));
                        }
                        // console.log('value at every : ');
                        // console.log(util.inspect(value, showHidden=false, depth=2, colorize=true));
                        callback(null);
                    }else{
                        console.log('Error while performing inside employee ');
                        callback(err);
                    }
                   });
                //    if(key!=3)
                //    {
                //     console.log(value.id);
                //     console.log(key);
                //     callback(null);
                //    }else{
                //        callback(err);
                //    }
                },(err)=>{
                    if(err) throw err;
                    // console.log('emps array at index 0: ');
                    // console.log(emps[0]);
                    // console.log('emps array at index 1: ');
                    // console.log(emps[1]);
                    // console.log('emps array at index 2: ');
                    // console.log(emps[2]);
                    // if(emps.length == 0)
                    // {
                    //     errors.push({msg:'You have not added employee yet'});
                    //     res.render('employee',{
                    //         user:req.user,
                    //         mng:result,
                    //         emps:emps
                    //     });
                    // }
                    res.render('employee',{
                            user:req.user,
                            mng:result,
                            emps:emps
                        });

                });
                //console.log('employee : ');
                //console.log(util.inspect(result[2], showHidden=false, depth=2, colorize=true));
                // res.render('employee',{
                //     user:req.user,
                //     emps:result
                // });
            }
        });
    }
});


module.exports = router;