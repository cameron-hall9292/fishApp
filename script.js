let allFishData;

//fetch fishing data that represents number of each fish type caught
// fetch("/api/fish", )
//   .then(response) => response.json())
//   .then(data) => {
//     allFishData = data
//     console.log(allFishData)
//   });

// console.log("script.js is working properly");

let latitude;
let longitude;

let temp_label = document.getElementById("temp");

let temp_box = document.getElementById("tempbox");

let cloud_box = document.getElementById("cloudcover");

let wind_box = document.getElementById("windspeed");

let precip_box = document.getElementById("precip");

//get current position with geolocation api

const successCallback = (position) => {
  console.log(position);
  document.getElementById("latitude").innerHTML =
    position.coords.latitude;
  document.getElementById("longitude").innerHTML =
    position.coords.longitude;
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  console.log(longitude);
  console.log(latitude);

  //fetch data from open meteo with latitidue and longitude we acquired from the geolocation api

  fetch(
    `https://api.open-meteo.com/v1/forecast?timezone=auto&latitude=${latitude}&longitude=${longitude}&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&current=temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m,precipitation,precipitation_probability`,
  ) //api for the get request
    .then((response) => response.json())
    .then((data) => {
      temp_label.innerHTML = data.current.temperature_2m;

      // make temp form box = temp fetched from openmeteo api

      temp_box.value = data.current.temperature_2m;

      cloud_box.value = data.current.cloud_cover;

      wind_box.value = data.current.wind_speed_10m;

      precip_box.value = data.current.precipitation;

      console.log(data);

      console.log(temp_label.value);
    });
};

const errorCallback = (error) => {
  console.log(error);
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);