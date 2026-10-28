
// const weatherApi={
//     key:"5b5f030a2f83455759050b3ce5bee87a",
//     baseUrl:"https://api.openweathermap.org/data/2.5/weather"
//     }
//     // api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

// const searchInputBox=document.getElementById("input-box");
// searchInputBox.addEventListener('keypress',(e)=>{
//     if(e.keyCode ==13){
//         // console.log(searchInputBox.value);
//         getWeatherReport(searchInputBox.value);
//    }
    
// });



// function getWeatherReport(city){
//     fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
//     .then(weather =>{
//         return weather.json();
//     }).then(showWeatherReport);
// }


// function showWeatherReport(weather){
//     // console.log(weather);

//     let city=document.getElementById("city");
//     city.innerText=`${weather.name},${weather.sys.country}`;

//     let temp=document.getElementById("temp");
//     temp.innerHTML=`${Math.round(weather.main.temp)}&deg;C`;
    
//     let minMax=document.getElementById("min-max");
//     minMax.innerHTML=`${Math.round(weather.main.temp_min)}&deg;c (min) | ${Math.round(weather.main.temp_max)}&deg;c (max)`

//     let WeatherType=document.getElementById("weather");
//     WeatherType.innerHTML=`${weather.weather[0].main}`;

//     let date=document.getElementById("date");
//     let toDayDate=new Date();
//     date.innerText=dateManager(toDayDate);

//     if(WeatherType.textContent=="Clear"){
//         document.body.style.backgroundImage="url('image/clear.jpg')";
//     }
//     if (WeatherType.textContent=="Smoke"){
//         document.body.style.backgroundImage="url('image/smoke.jpg')";
//     }
//     if(WeatherType.textContent=="Clouds"){
//         document.body.style.backgroundImage="url('image/cloud.jpg')";
//     }
//     if (WeatherType.textContent=="Haze"){
//         document.body.style.backgroundImage="url('image/haze.jpg')";
//     }
//     if(WeatherType.textContent=="Rain"){
//         document.body.style.backgroundImage="url('image/rain.jpg')";
//     }
//     if (WeatherType.textContent=="Thunderstorm"){
//         document.body.style.backgroundImage="url('image/thunderstorm.jpg')";
//     }
    
// }

// function dateManager(dateObj){
//     let days=["Sun","Mon","Tue","Wed","Thu","Fri","Sut"];
//     let month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

//     let year=dateObj.getFullYear();
//     let monthName=month[dateObj.getMonth()];
//     let day=days[dateObj.getDay()];
//     let date=dateObj.getDate();
//     return (
//         (`${date} ${monthName} (${day}) ${year}`)
//     )
// }



function showWeatherReport(data) {
    const condition = data.weather?.[0]?.main || "Clouds";
    const description = data.weather?.[0]?.description || condition;
    const iconCode = data.weather?.[0]?.icon;

    // Location
    document.getElementById("city").textContent =
        `${data.name}, ${data.sys.country}`;

    // Current date in the location's timezone
    const localDate = new Date(
        (data.dt + data.timezone) * 1000
    );

    document.getElementById("date").textContent =
        localDate.toLocaleDateString("en-GB", {
            timeZone: "UTC",
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    // Temperature and conditions
    document.getElementById("temp").textContent =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById("weather").textContent =
        description.charAt(0).toUpperCase() + description.slice(1);

    document.getElementById("min-max").innerHTML =
        `H: ${Math.round(data.main.temp_max)}°C` +
        ` <span>│</span> ` +
        `L: ${Math.round(data.main.temp_min)}°C`;

    // Existing four detail cards
    document.getElementById("feels-like").textContent =
        `${Math.round(data.main.feels_like)}°C`;

    document.getElementById("humidity").textContent =
        `${data.main.humidity}%`;

    document.getElementById("wind").textContent =
        `${data.wind.speed} m/s`;

    document.getElementById("pressure").textContent =
        `${data.main.pressure} hPa`;

    // Actual weather icon from OpenWeatherMap
    const iconContainer = document.getElementById("weather-icon");
    iconContainer.replaceChildren();

    if (iconCode) {
        const icon = document.createElement("img");
        icon.src =
            `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        icon.alt = description;
        icon.width = 150;
        icon.height = 150;
        iconContainer.appendChild(icon);
    }

    // Optional extra details: displayed only if added to HTML
    const optionalDetails = {
        visibility: data.visibility != null
            ? `${(data.visibility / 1000).toFixed(1)} km`
            : null,

        clouds: data.clouds?.all != null
            ? `${data.clouds.all}%`
            : null,

        sunrise: data.sys?.sunrise != null
            ? new Date(
                (data.sys.sunrise + data.timezone) * 1000
              ).toLocaleTimeString("en-GB", {
                timeZone: "UTC",
                hour: "2-digit",
                minute: "2-digit"
              })
            : null,

        sunset: data.sys?.sunset != null
            ? new Date(
                (data.sys.sunset + data.timezone) * 1000
              ).toLocaleTimeString("en-GB", {
                timeZone: "UTC",
                hour: "2-digit",
                minute: "2-digit"
              })
            : null
    };

    Object.entries(optionalDetails).forEach(([id, value]) => {
        const element = document.getElementById(id);

        if (element && value !== null) {
            element.textContent = value;
        }
    });

    // Dynamic background based on actual weather
    setWeatherBackground(condition);

    document.title =
        `${data.name} ${Math.round(data.main.temp)}°C | Weather App`;
}



