const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");
const { start } = require("repl");

const { Schema } = mongoose;

mongoose.connect(process.env.DB_CONNECT);

const fishSchema = new Schema({
  temp: Object,
  cloudcover: Object,
  windspeed: Object,
  precip: Object,
  fishtype: Object,
  location: Object,
  date: String,
  bait: Object,
  surfacePressure: Object,
},
{timestamps: true}
);


const fishTypeSchema = new Schema({
  fishtype: Object
})

const Fish = mongoose.model("Fish", fishSchema);

//create fish species library

const fishLib = mongoose.model("FishLib", fishTypeSchema);

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
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

app.get("/selectRecord", (req, res) => {
  res.sendFile(__dirname + "/views/selectRecord.html");
});


//make a table of fishtypes to add to selection box

app.post("/api/fishtype", async (req, res) => {

  console.log(req.body);
  const {fishtype} = req.body;

  const fishTypeObj = new fishLib({fishtype});
  try {
    const fishTypeSave = await fishTypeObj.save();
    res.json({fishtype: fishTypeObj.fishtype});
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
  const fishData = await fishLib.find({},fishTypeData);

  res.json(fishData);
});


//post fish data

app.post("/api/fish", async (req, res) => {
  console.log(req.body);
  const {
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
  temp: 1,
  cloudcover: 1,
  windspeed: 1,
  precip: 1,
  fishtype: 1,
  location: 1,
  date: 1,
  bait: 1,
  _id: 0,
  surfacePressure: 1,
};

//get all fish data

app.get("/api/fish", async (req, res) => {
  const fishData = await Fish.find({}, desiredData);

  res.json(fishData);
});

//get all fish data
app.get("/api/alldata", async (req, res) => {
  
  // const fishData = await Fish.countDocuments({ fishtype: {$ne:null} });
  // const resultobj = { fish: {$ne: null}, count: fishData };
  // res.json(resultobj);

  const fishData = await Fish.aggregate( [
    { $group: { _id:"$fishtype", myCount: { $sum: 1 } } },

 ] )
 res.json(fishData)
 console.log(fishData);



 //clean up data into neat array for d3 manipulation

 let fishCountArr = [];

 for (let i = 0; i < fishData.length; i++){
    //create mini arr of fishtype and count
    let miniFishArr = [fishData[i]._id, fishData[i].myCount];
    fishCountArr.push(miniFishArr); 
 }

 console.log(fishCountArr)

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



const listener = app.listen(process.env.PORT || 5500, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
