const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const matchdetails = [];
const details = [];
//const URL = mongodb+srv:harshman:<password>@cluster0.kpnay.mongodb.net/<dbname>?retryWrites=true&w=majority;
mongoose.connect("mongodb://localhost:27017/RegistrationDB",{ useUnifiedTopology: true, useNewUrlParser: true  });
const applySchema = {
    teamname : String,
    ign : String,
    mobilenumber: Number,
    email : String,
    ign2 : String,
    ign3 :String,
    ign4: String
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



app.get("/", function(req,res){
res.render('index');
});
app.get("/registration", function(req,res){
    res.render('registration');
    });

app.get("/list", function(req,res){
    Application.find({}, function(err,foundApplications){
        res.render('list',{
            details : foundApplications
            });
            });     
    })
    
app.post("/registration",function(req,res){
    
    const detail = new Application({
        teamname : req.body.teamname,
        ign : req.body.ign,
        mobilenumber: req.body.mobile_number,
        email : req.body.email,
        ign2 : req.body.ign2,
        ign3 :req.body.ign3,
        ign4: req.body.ign4
    });

    // details.push(detail);
    detail.save(function(err){

        if (!err){
     
          res.redirect("/list");
     
        }
     
      });
    
    
});
  
app.get("/host", function(req,res){
    res.render('host');
    });
    app.post("/host",function(req,res){
    
        const matchdetail = new Hosting( {
            name : req.body.name,
            number : req.body.number,
            date : req.body.date,
            description : req.body.description,
            prizepool : req.body.prizepool
        });
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
        });
        });        
    })
  
               
app.get("/login", function(req,res){
    res.render('login');
    });
app.post("/login",function(req,res){
    
})    

app.listen(3000, function(){
    console.log("M416 goes brrrrrr");
})