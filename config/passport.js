const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const util = require('util');


const connection = require('./database');

module.exports = function(passport){
    
    passport.use(
        new LocalStrategy(
            {usernameField:'email',
            passwordField:'password',
            },
            (email,password,done)=>{
                //console.log('database selected from login '+req.body.sellist);
                // console.log('all body selected from login '+req.body.sellist);
                // console.log('email selected from login '+email);
                // console.log('password selected from login '+password);
                var sql = `SELECT * FROM login WHERE email = ?`;
                connection.query(sql,email,(err,result)=>{
                    if(err) throw err;
                    // matching email
                    if(!result.length)
                        return done(null,false,{message:'That email does not exists'});
                    bcrypt.compare(password,result[0].password,(err,isMatched)=>{
                        if(err) throw err;
                        //matching password
                        if(isMatched)
                        {
                            var sql1 = `SELECT * FROM ${result[0].flag} WHERE email = ?`;
                            connection.query(sql1,email,(err,row)=>{
                                if(err) throw err;
                                var key = 'table';
                                var keypair = result[0].flag; 
                                row[0][key]=keypair;
                                // console.log(util.inspect(row[0], false, null, true /* enable colors */));
                                return done(null,row[0]);
                            });
                            // console.log(util.inspect(result[0], false, null, true /* enable colors */));
                            // var key = 'table';
                            // var keypair = req.body.sellist; 
                            // result[0][key]=keypair;
                            // console.log(util.inspect(result[0], false, null, true /* enable colors */));
                            // return done(null,result[0]);
                        }else{
                            return done(null,false,{message:'Password is incorrect'});
                        }
                    });
                }); 
            })
    );

    //serializeUser

    passport.serializeUser((user,done)=>{
        console.log('inside serialize');
        // console.log(util.inspect(user, false, null, true /* enable colors */));
        console.log(util.inspect(user, false, null, true /* enable colors */));
        done(null,{
            id:user.id,
            table:user.table
        });
    });

    //deserializeuser
    passport.deserializeUser((user,done)=>{
        // console.log('inside deserialize');
        // console.log(util.inspect(user, false, null, true /* enable colors */));
        var sql = `SELECT * FROM ${user.table} WHERE id = ?`;
        connection.query(sql,user.id,(err,results)=>{

            // console.log(util.inspect(results[0], false, null, true /* enable colors */));
            var key = 'table';
            var keypair = user.table; 
            results[0][key]=keypair;
            done(err,results[0]);
        });

    });

};