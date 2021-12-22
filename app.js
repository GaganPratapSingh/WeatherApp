
const weatherApi={
    key:"5b5f030a2f83455759050b3ce5bee87a",
    baseUrl:"https://api.openweathermap.org/data/2.5/weather"
    }
    // api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}

const searchInputBox=document.getElementById("input-box");
searchInputBox.addEventListener('keypress',(e)=>{
    if(e.keyCode ==13){
        // console.log(searchInputBox.value);
        getWeatherReport(searchInputBox.value);
   }
    
});



function getWeatherReport(city){
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then(weather =>{
        return weather.json();
    }).then(showWeatherReport);
}


function showWeatherReport(weather){
    // console.log(weather);

    let city=document.getElementById("city");
    city.innerText=`${weather.name},${weather.sys.country}`;

    let temp=document.getElementById("temp");
    temp.innerHTML=`${Math.round(weather.main.temp)}&deg;C`;
    
    let minMax=document.getElementById("min-max");
    minMax.innerHTML=`${Math.round(weather.main.temp_min)}&deg;c (min) | ${Math.round(weather.main.temp_max)}&deg;c (max)`

    let WeatherType=document.getElementById("weather");
    WeatherType.innerHTML=`${weather.weather[0].main}`;

    let date=document.getElementById("date");
    let toDayDate=new Date();
    date.innerText=dateManager(toDayDate);

    if(WeatherType.textContent=="Clear"){
        document.body.style.backgroundImage="url('image/clear.jpg')";
    }
    if (WeatherType.textContent=="Smoke"){
        document.body.style.backgroundImage="url('image/smoke.jpg')";
    }
    if(WeatherType.textContent=="Clouds"){
        document.body.style.backgroundImage="url('image/cloud.jpg')";
    }
    if (WeatherType.textContent=="Haze"){
        document.body.style.backgroundImage="url('image/haze.jpg')";
    }
    if(WeatherType.textContent=="Rain"){
        document.body.style.backgroundImage="url('image/rain.jpg')";
    }
    if (WeatherType.textContent=="Thunderstorm"){
        document.body.style.backgroundImage="url('image/thunderstorm.jpg')";
    }
    
}

function dateManager(dateObj){
    let days=["Sun","Mon","Tue","Wed","Thu","Fri","Sut"];
    let month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

    let year=dateObj.getFullYear();
    let monthName=month[dateObj.getMonth()];
    let day=days[dateObj.getDay()];
    let date=dateObj.getDate();
    return (
        (`${date} ${monthName} (${day}) ${year}`)
    )
}

