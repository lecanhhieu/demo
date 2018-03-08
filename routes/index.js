// const routes = require('express').Router();

// routes.get('/', (req, res) => {
//   res.status(200).json({ message: 'Connected!' });
// });

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


let User =  require('../models/user');
const userController = require('../controller/UserController');
//Day la vi du, dung controler. chuyen tat ca function vao controler nhe
router.get('/', userController.signup);

//router.get('/signup',function(req, res){
//    res.render('signup',{messages: {}})
//});


router.get("/user",function(req,res,next){
    console.log(req.params.id)
    if(req.params.id == 0) {
      res.json({"message" : "You must pass ID other than 0"});    
    }
    else next();
  });

router.post('/login',function(req, res){
    const { username,password } = req.body;

    User.find({username : username}, function(err, usr) {

        if(err){
            console.log(err);
            return res.status(500).send();
        }

        console.log('user >>>', usr)
        if(!usr){
            return res.status(404).send();
        }
        console.log('begin to compared', password)

        bcrypt.compare(password, usr.password, function(err, isMatch) {
            if (err) return res.end('wrong pass');
            res.end('redirect to home');
        });

        // //No deo lay duoc function trong method
        // usr.comparePass(password,   (err, isMatch) => {
        //     console.log('compared')
        //     if(!isMatch)
        //         res.end('wrong pass');
        //     res.end('redirect to home');
        // })
    });

    // User.findOne({username : username, password : passwordHashed}, function(err, user){

    //     //err na dinh nghiax owr dau ???
    //     if(err){
    //         console.log(err);
    //         return res.status(500).send();
    //     }

    //     console.log('user >>>', user)

    //     if(!user){
    //         console.log(err)
    //         return res.status(404).send();
    //     }
    //     //req.session.user = user;
    //     return res.status(200).send();
    // })
});

router.get('/home',function(req, res){
    //console.log xet loi
    console.log(req.session)
    if(!req.session.user){
        return res.status(401).send();
    }

    return res.status(200).send('Wellcome to Login Demo Web');
});
  
router.post('/users/signup',function(req, res){
    const {name,email,username,password } = req.body;
    // const name = req.body.name;
    // const email = req.body.email;
    // const username = req.body.username;
    // const password = req.boby.password;

    //console.log(req.boby.password);

    req.checkBody('name', 'Name is require').notEmpty();
    req.checkBody('email', 'Email is require').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is require').notEmpty();
    req.checkBody('password', 'Password is require').notEmpty();

    let errors = req.validationErrors();

    console.log('coming up');

    if(errors){
        res.render('signup',{
            messages : {errors: errors}
        });
    } else{
        console.log('ok');
        let newUser = new User({
            name : name,
            email : email,
            username : username,
            password : password
        });

        //Nhin cho nay. m hash pasword truwosc khi dua vao db
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        console.log(err);
                        return;
                    }else{
                        res.render('login',{
                            messages : 'You are now registered and can log in'
                        });
                    }
                });
            });
        });
    }
    
});

router.get('/login',function(req, res){
    res.render('login', {messages : {}});
});

module.exports = router;