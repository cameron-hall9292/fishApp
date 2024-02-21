// const exerciseForm = document.getElementById("exercise-form");

// exerciseForm.addEventListener("submit", () => {
//   const userId = document.getElementById("uid").value;
//   exerciseForm.action = `/api/users/${userId}/exercises`;

//   exerciseForm.submit();
// });

console.log("script.js is working properly");







let latitude;
let longitude;

let temp_label = document.getElementById("temp");


    //get current position with geolocation api

    const successCallback = (position) => {
    console.log(position);
    document.getElementById("latitude").innerHTML = position.coords.latitude;
    document.getElementById("longitude").innerHTML = position.coords.longitude;
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    console.log(longitude);
    console.log(latitude);

    //fetch data from open meteo with latitidue and longitude we acquired from the geolocation api

    fetch(`https://api.open-meteo.com/v1/forecast?timezone=auto&latitude=${latitude}&longitude=${longitude}&temperature_unit=fahrenheit&current=temperature_2m,relative_humidity_2m`) //api for the get request
    .then(response => response.json())
    .then(data => {

        temp_label.innerHTML = data.current.temperature_2m;

        console.log(data)

        console.log(temp_label.value);
    });


    };

    const errorCallback = (error) => {
    console.log(error);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

