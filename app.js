const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const _ = require("lodash");
const { application } = require("express");
const app = express();

app.use(function(req,res,next){
    res.locals.message = "error";
    next();
    });
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});


app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
//const URL = mongodb+srv:harshman:<password>@cluster0.kpnay.mongodb.net/<dbname>?retryWrites=true&w=majority;
mongoose.connect("mongodb+srv://harshman:hog@cluster0.gwha9.mongodb.net/registration?retryWrites=true&w=majority",{ useUnifiedTopology: true, useNewUrlParser: true  });
// mongoose.connect("mongodb://localhost:27017/RegistrationDB",{ useUnifiedTopology: true, useNewUrlParser: true  });
mongoose.set("useCreateIndex",true);
const matchdetails = [];
const details = [];
const userSchema = new mongoose.Schema ({
    email: String,
    password: String,

  }); 
  userSchema.plugin(passportLocalMongoose);
  const User = new mongoose.model("User", userSchema);
  passport.use(User.createStrategy());

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
const applySchema = {
    teamname : String,
    ign : String,
    mobilenumber: Number,
    email : String,
    ign2 : String,
    ign3 :String,
    ign4: String,
    tourneyname : String
}
const Application = mongoose.model(
    "Application" , applySchema
)
const hostSchema ={
    name : String,
    number : Number,
    date : Date,
    description : String,
    prizepool : Number

}
const Hosting = mongoose.model(
    "Hosting" , hostSchema
)
// const application1 = new Application({
//     teamname : "Blabla",
//         ign : "Blabla",
//         mobilenumber: 982,
//         email : "Blabla",
//         ign2 : "Blabla",
//         ign3 :"Blabla",
//         ign4: "Blabla"

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.get("/", function(req,res){
    console.log(req.user);
res.render('index',{currentUser : req.user});
});
app.get("/registration", function(req,res){
    res.render('registration');
    });
app.get("/tournament/:name",function(req,res){
    const requestedName = _.lowerCase(req.params.name);
    Hosting.find({},function(err,tourneys){
      if(!err){
          
          tourneys.forEach(function(tourney){
              var storedName = _.lowerCase(tourney.name);
              storedName = storedName.substring(0,12);
              if(storedName===requestedName){
                  res.render("registration",{
                    currentUser : req.user,
                      matchdetail : tourney
                  })
                  //console.log(storedName+" success "+requestedName);

              }
              else {
                console.log(err);
                console.log(storedName+"!="+requestedName);
              }
              
          })
      }
  });
})
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
  });
app.get("/list", function(req,res){
    Application.find({}, function(err,foundApplications){
        res.render('list',{
            details : foundApplications
            ,currentUser : req.user
            });
            });     
    })
    
    // app.get("/tournament/list/:tourneyNames", function(req,res){
    //     const tourneyName = req.body.hostname;
    //     console.log(tourneyName);
    //     Application.find({}, function(err,foundApplications){
    //         res.render('list',{
    //             details : foundApplications
    //             });
    //             });     
    //     })
        app.get("/tournament/list/:name",function(req,res){
            const requestedName = req.params.name;
            // console.log(requestedName);
            Application.find({tourneyname : requestedName}, function(err,foundApplications){
                        res.render('list',{
                            details : foundApplications
                            ,currentUser : req.user
                            });
                            });     
        });
    
        app.post("/tournament/:name",function(req,res){
            const requestedName = req.params.name;
            // console.log(requestedName);
   
    
    const detail = new Application({
        teamname : req.body.teamname,
        ign : req.body.ign,
        mobilenumber: req.body.mobile_number,
        email : req.body.email,
        ign2 : req.body.ign2,
        ign3 :req.body.ign3,
        ign4: req.body.ign4,
        tourneyname : req.body.hostname
    });

    // details.push(detail);
    detail.save(function(err){

        if (!err){
     
          res.redirect("/tournament/list/"+requestedName);
     
        }
     
      });
    
    
});
  
app.get("/host", function(req,res){
    if(req.isAuthenticated()){
        res.render('host',{currentUser : req.user});
    }else{
       
        res.redirect("/login")
        
    }
    
    });
    app.post("/host",function(req,res){
    
        const matchdetail = new Hosting( {
            name : req.body.name,
            number : req.body.number,
            date : req.body.date,
            description : req.body.description,
            prizepool : req.body.prizepool
        });
        // console.log(matchdetail.name);
        matchdetail.save(function(err){

            if (!err){
         
              res.redirect("/tournament");
         
            }
         
          });
        
        
    });
    app.get("/tournament", function(req,res){
        Hosting.find({},function(err,foundHosts){
        res.render('tournament',{
            matchdetails : foundHosts
            ,currentUser : req.user
        });
        });        
    })

               
app.get("/login", function(req,res){
    res.render('login',{currentUser : req.user});
    });
    app.post("/login", function(req, res){

        const user = new User({
          username: req.body.username,
          password: req.body.password
        });
      
        req.login(user, function(err){
          if (err) {
            console.log(err);
            
          } else {
            passport.authenticate("local")(req, res, function(){
              res.redirect("/host");
            });
          }
        });
      
      });
app.get("/register", function(req,res){
    res.render('register',{currentUser : req.user});
    });
// app.post("/register",function(req,res){
//     User.register({username: req.body.username}, req.body.password, function(err,user){
//         if(err) {
//             console.log(err);
//             res.redirect("/register");
//         } else{
//             passport.authenticate("locat")(req,res,function(){
//                 res.redirect("/host");
//             });
//         }
//     });
// });
app.post("/register", function(req, res){

    User.register({username: req.body.username}, req.body.password, function(err, user){
      if (err) {
        console.log(err);
        var alertNode = document.querySelector('.alert')
var alert = bootstrap.Alert.getInstance(alertNode)
alert.close()
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/host");
        });
      }
    });
  
  });
 
// Application.find({},function(err,names){
//     if(!err){
        
//         names.forEach(function(name){
//             console.log(name.teamname);
//         })
//     }
// });


app.listen(process.env.PORT||3000, function(){
    console.log("M416 goes brrrrrr");
})