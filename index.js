const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");
const { start } = require("repl");

const { Schema } = mongoose;

mongoose.connect(process.env.DB_CONNECT);


//create main schema

const fishSchema = new Schema({
  body_of_water: Object,
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

//create fish species schema


const fishTypeSchema = new Schema({
  fishtype: Object
});


//create fish bait schema

const baitSchema = new Schema({
  bait: Object
})

//create body of water schema

const bodyOfWaterSchema = new Schema({
  body_of_water: Object
})



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


//post bait data to db


app.post("/api/bait", async (req, res) => {

  console.log(req.body);
  const {bait} = req.body;

  const baitObj = new baitLib({bait});
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
  const fishData = await baitLib.find({},baitData);

  res.json(fishData);
});


// post body of water data


app.post("/api/bodyofwater", async (req, res) => {

  console.log(req.body);
  const {body_of_water} = req.body;

  const waterObj = new waterLib({body_of_water});
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
  const fishData = await waterLib.find({},bodyOfWaterData);

  res.json(fishData);
});




//post main fish data

app.post("/api/fish", async (req, res) => {
  console.log(req.body);
  const {
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
  body_of_water: 1,
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
