const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const session = require("express-session"); 
const passport = require("passport");
//const initializePassport = require('./passport-config');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const env = require("dotenv").config();

let ObjectId = require('mongodb').ObjectId;





//set view engine

app.set('view-engine', 'ejs');

app.use(express.urlencoded({extended: false}))

app.use(flash());

app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000}
   
}))



app.use(passport.initialize())
app.use(passport.session());
app.use(methodOverride('_method'))

const mongoose = require("mongoose");
const { start } = require("repl");
const { VARCHAR } = require("mysql/lib/protocol/constants/types");

const { Schema } = mongoose;

mongoose.connect(process.env.DB_CONNECT);


//create users schema

const userSchema = new Schema({

email: String,
password: String,




})


//create main schema

const fishSchema = new Schema({
  user_id: String,
  body_of_water: String,
  temp: Object,
  cloudcover: Object,
  windspeed: Object,
  precip: Object,
  fishtype: String,
  location: Object,
  date: String,
  bait: String,
  surfacePressure: Object,
},
{timestamps: true}
);

//create fish species schema


const fishTypeSchema = new Schema({
  user_id: String,
  fishtype: Object
});


//create fish bait schema

const baitSchema = new Schema({
  user_id: String,
  bait: Object
})

//create body of water schema

const bodyOfWaterSchema = new Schema({
  user_id: String,
  body_of_water: Object
})



//create users library

const users = mongoose.model("Users", userSchema);


//create main library

const Fish = mongoose.model("Fish", fishSchema);

//create fish species library

const fishLib = mongoose.model("FishLib", fishTypeSchema);

//create bait library

const baitLib = mongoose.model("BaitLib", baitSchema);

//create body of water library

const waterLib = mongoose.model("Body of Water", bodyOfWaterSchema)

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));




//setup passport js authentication




const LocalStrategy = require('passport-local').Strategy


 
    const authenticateUser = async (email, password, done) => {
        const user = await users.findOne({email: email});

        console.log(user);
        //.then((user) =>  {
       
        if (user == null) {
            return done(null, false, {message: "No user with that email"
        })
    
    }


        try {
            if (await bcrypt.compare(password, user.password)) {
                console.log("password match");
                return done(null,user)
            }
            else {
                console.log("password mismatch");
                return done(null, false, {message: "password incorrect"})
            }

        
        } catch(error){
            console.log(`error: ${error}`);
            return done(error);

        }

       
      }
    
    

    passport.use(new LocalStrategy({ usernameField: 'email'}, 
    authenticateUser))
    
    
  //   passport.serializeUser((user, done) => done(null,user.id));

  //   passport.deserializeUser((id, done) => {
      
  //     return done(null, id)
  // });
    

  passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, {
        id: user.id,
        username: user.email,
    
      });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });
  







//render present main page

app.get("/", checkAuthenticated, (req, res) => {
  res.render("newMain.ejs");
});


//render table

app.get("/table", checkAuthenticated, (req, res) => {
  res.render("table.ejs");
});



//render fishcount chart

app.get("/chart", checkAuthenticated, (req, res) => {
  res.render("chart.ejs");
});

//render fishcount chart

app.get("/selectRecord", checkAuthenticated, (req, res) => {
  res.render("selectRecord.ejs");
});




//render login page

app.get("/login",checkNotAuthenticated, (req, res) => res.render("login.ejs"));



// use passport js to login via login page


app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,

}));


//render account registration page

app.get("/register", checkNotAuthenticated, (req,res) => res.render("register.ejs"));



//post data to users table in order to create new user accounts with email and passwords

app.post("/register", checkNotAuthenticated, async (req,res) => {
  let {email, password} = req.body;

  //check if email already in DB

  let emailCheck = await users.findOne({email:email});

  if (emailCheck) {
    console.log("email already exists in DB");
    return res.redirect("/register");
    //return res.status(422).json({error: "Email already exists."})
  }


  // hash password before storing in DB

  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) console.log(err);
    else {
    
      password = hash;
      const userObj = new users({email,password});
      try {
        const userSave = userObj.save();
        res.redirect("/login");
        console.log("new account added!");
       //res.json({email: userObj.email, password: userObj.password})
       
      } catch(err) {
        console.log(err);
        res.redirect("/register");
      }
    }
});



});





  //see if we can get user data stored in session



  app.get('/api/userdata', (req,res) => {

    const userID = req.user;
    console.log(userID);
    res.json(userID);
  
  
  
  });
  








app.get("/barChart", (req, res) => {
  res.sendFile(__dirname + "/views/bar_chart.html");
});

//test out chart.js library to build a bar chart

app.get("/chartjs", (req, res) => {
  res.sendFile(__dirname + "/views/chartjs.html");
});

app.get("/pressureChart", (req, res) => {
  res.sendFile(__dirname + "/views/pressureChart.html");
});

// app.get("/selectRecord", (req, res) => {
//   res.sendFile(__dirname + "/views/selectRecord.html");
// });

app.get("/main", (req, res) => {
  res.sendFile(__dirname + "/views/main.html");
});

app.get("/addFishType", (req, res) => {
  res.sendFile(__dirname + "/views/addFishType.html");
});

app.get("/addBait", (req, res) => {
  res.sendFile(__dirname + "/views/addBait.html");
});


app.get("/addBodyWater", (req, res) => {
  res.sendFile(__dirname + "/views/addBodyWater.html");
});

app.get("/table", (req, res) => {
  res.sendFile(__dirname + "/views/table.html");
});

// app.get("/newmain", (req, res) => {
//   res.sendFile(__dirname + "/views/newMain.ejs");
// });

app.get("/map", (req, res) => {
  res.sendFile(__dirname + "/views/map.html");
});

app.get("/account", (req, res) => {
  res.sendFile(__dirname + "/views/account.html");
});

// app.get("/login", (req, res) => {
//   res.sendFile(__dirname + "/views/login.html");
// });







//get data from users table for user login functionality

// app.post("/login", async(req,res) => {

//   let {email, password} = req.body;

//    //check if email already in DB

//    let emailCheck = await users.findOne({email:email});

//    if (!emailCheck) {
//      console.log("email does not exist in DB");
//      return res.status(422).json({error: "Email does not exist in database."})
//    }

//    //compare hash in DB to the hash of password user inputs into textbox

//    //console.log(emailCheck);

//    const dbHash = emailCheck.password;


//   bcrypt.compare(password, dbHash, function(err, result) {
//     if (err) console.log(err);
   
//     else {
        
//         if (result == false) {
//           console.log("password does not match");
//           res.status(422).json("error: incorrect password");
//           return 
//         } 
//         else if (result == true) {
//           console.log("password match");

//           res.json("login successful");
          

//         }
      
//         return result;

//     }
//   });


   //res.json("login successful");



// })


//post data to users table in order to create new user accounts with email and passwords

app.post("/api/createaccount", async (req,res) => {
  let {email, password} = req.body;

  //check if email already in DB

  let emailCheck = await users.findOne({email:email});

  if (emailCheck) {
    console.log("email already exists in DB");
    return res.status(422).json({error: "Email already exists."})
  }


  // hash password before storing in DB

  const saltRounds = 10;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) console.log(err);
    else {
    
      password = hash;
      const userObj = new users({email,password});
      try {
        const userSave = userObj.save();
       res.json({email: userObj.email, password: userObj.password})
      } catch(err) {
        console.log(err);
      }
    }
});



});




//make a table of fishtypes to add to selection box

app.post("/api/fishtype", async (req, res) => {

  console.log(req.body);
  const {user_id, fishtype} = req.body;



  const fishTypeObj = new fishLib({user_id,fishtype});
  try {
    const fishTypeSave = await fishTypeObj.save();
    res.json("post successful")
    

  } catch (err) {
    console.log(err);
  }



});


//get all fish data

const fishTypeData = {
  _id: 0,
  fishtype: 1

}

app.get("/api/fishtype", async (req, res) => {
  const fishData = await fishLib.find({user_id:req.user.id},fishTypeData);

  res.json(fishData);
});

//get all user data

app.get("/api/users", async (req, res) => {

const userData =  await users.find({});

res.json(userData);

});


//post bait data to db


app.post("/api/bait", async (req, res) => {

  console.log(req.body);
  const {user_id,bait} = req.body;

  const baitObj = new baitLib({user_id,bait});
  try {
    const baitSave = await baitObj.save();
    res.json({bait: baitObj.bait});
  } catch (err) {
    console.log(err);
  }

});


//get bait data


const baitData = {
  _id: 0,
  bait: 1

}

app.get("/api/bait", async (req, res) => {
  const fishData = await baitLib.find({user_id:req.user.id},baitData);

  res.json(fishData);
});


// post body of water data


app.post("/api/bodyofwater", async (req, res) => {

  console.log(req.body);
  const {user_id,body_of_water} = req.body;

  const waterObj = new waterLib({user_id,body_of_water});
  try {
    const waterSave = await waterObj.save();
    res.json({body_of_water: waterObj.body_of_water});
  } catch (err) {
    console.log(err);
  }

});

//get body of water data

const bodyOfWaterData = {
  _id: 0,
  body_of_water: 1

}

app.get("/api/bodyofwater", async (req, res) => {
  const fishData = await waterLib.find({user_id:req.user.id},bodyOfWaterData);

  res.json(fishData);
});








//update user fish data


app.post("/api/updateFish", async (req,res) => {



  console.log(req.body.fishtypeSelect);
  try {

    const filter = {_id: req.body._id}

    const update = 
    {fishtype: req.body.fishtypeSelect,
    bait: req.body.baitSelect,
    body_of_water: req.body.body_of_water }

    //req.body.fishtypeSelect

    let doc = await Fish.findOneAndUpdate(filter,update, {new: true});


    res.redirect("/table");

  //res.json("update successful")

  return doc;


} catch(err){
  if (err) console.log(err);
}

});

// user_id: userID.value,
// body_of_water: water_box,
// fishtype: fish_box,
// bait: bait_box,




//post main fish data

app.post("/api/fish", async (req, res) => {
  console.log(req.body);
  const {
    user_id,
    body_of_water,
    temp,
    cloudcover,
    windspeed,
    precip,
    fishtype,
    location,
    date,
    bait,
    surfacePressure,
  } = req.body;
  const fishObj = new Fish({
    user_id,
    body_of_water,
    temp,
    cloudcover,
    windspeed,
    precip,
    fishtype,
    location,
    date,                                                  //date ? new Date(date).toLocaleString('en-US') : new Date().toLocaleString('en-US'),
    bait,
    surfacePressure,
  });

  try {
    const fish = await fishObj.save();
    res.json({
      fish_type: fish.name,
      fish_location: fish.location,
      date_caught: fish.date,
      bait_used: fish.bait,
    });
  } catch (err) {
    console.log(err);
  }
});



//get all fish data back

const desiredData = {
  _id: 1,
  body_of_water: 1,
  temp: 1,
  cloudcover: 1,
  windspeed: 1,
  precip: 1,
  fishtype: 1,
  location: 1,
  date: 1,
  bait: 1,
  surfacePressure: 1,
};

//get all fish data

app.get("/api/fish", async (req, res) => {
  const fishData = await Fish.find({user_id:req.user.id}, desiredData);

  res.json(fishData);
});

//get counts of each fish type caught

app.get("/api/fishcount", async (req, res) => {
  

  const fishData = await Fish.aggregate( [
    { $match: {user_id: req.user.id}},
    { $group: { _id:"$fishtype", myCount: { $sum: 1 } } },

 ] )
 res.json(fishData)
 console.log(fishData);

});

 //get bass fish types
 app.get("/api/bass", async (req, res) => {
  

  const fishData = await Fish.aggregate( [
    { $match: {$or: [ {fishtype: "wiper"}, {fishtype: "smallmouth bass"}]}},
    { $group: { _id:"$fishtype", myCount: { $sum: 1 } } },
  
  
  ])
  
 res.json(fishData);
 })

//get specific fish type back

app.get("/api/fishtype", async (req, res) => {
  const fishType = req.query.fishtype;
  console.log(`fishType: ${fishType}`);
  const fishData = await Fish.find({ fishtype: fishType }, desiredData);
  res.json(fishData);
});

//get fish by bait

app.get("/api/fishbait", async (req, res) => {
  const fishBait = req.query.fishbait;
  console.log(`fishBait: ${fishBait}`);
  const fishData = await Fish.countDocuments({ bait: fishBait });
  const resultobj = { bait: fishBait, count: fishData };
  res.json(resultobj);
});

//count number of fish caught by type

app.get("/api/fishcount", async (req, res) => {
  const fishType = req.query.fishtype;
  console.log(`fishType: ${fishType}`);
  const fishData = await Fish.countDocuments({ fishtype: fishType });
  const resultobj = { fish: fishType, count: fishData };
  res.json(resultobj);
});



// add logout and checks for user authentication


app.delete('/logout', (req, res) => {
  req.logOut((error) => {
      return error
  });
 
  res.redirect('/login');
})



function checkAuthenticated(req,res,next) {
  if (req.isAuthenticated()){
      return next()
  }

  res.redirect('/login');
}

function checkNotAuthenticated(req,res,next){
  if (req.isAuthenticated()){
     return res.redirect('/')
  }
  return next();
}





const listener = app.listen(process.env.PORT || 5500, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
