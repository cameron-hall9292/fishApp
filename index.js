const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const mongoose = require("mongoose");

const { Schema } = mongoose;

mongoose.connect(process.env.DB_CONNECT);

const fishSchema = new Schema({
  temp: Object,
  cloudcover: Object,
  windspeed: Object,
  precip: Object,
  fishtype: Object,
  location: Object,
  date: Date,
  bait: Object,
});

const Fish = mongoose.model("Fish", fishSchema);

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
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
  } = req.body;
  const fishObj = new Fish({
    temp,
    cloudcover,
    windspeed,
    precip,
    fishtype,
    location,
    date: date ? new Date(date) : new Date(),
    bait,
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

// Data.find({}, { _id: 1, serialno: 1 }, function (err, data) {
//   if (err) {
//     return handleError(res, err);
//   }
//   return res.json(200, data);
// });

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
};

//get all fish data

app.get("/api/fish", async (req, res) => {
  const fishData = await Fish.find({}, desiredData);

  res.json(fishData);
});

//post fish data
app.post("/api/fish/alldata", async (req, res) => {
  const fishData = await Fish.find({}, desiredData);

  res.json(fishData);
  console.log(fishData);
});

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

//get location data using built in js geolocation

// if ("geolocation" in navigator) {
//   console.log("geolocation is available");
// } else {
//   console.log("geolocation NOT available");
// }

// global.navigator.geolocation.getCurrentPosition((position) => {
//   doSomething(position.coords.latitude, position.coords.longitude);
// });

const listener = app.listen(process.env.PORT || 5500, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
