
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


const weatherApi = {
    key: "5b5f030a2f83455759050b3ce5bee87a",
    baseUrl: "https://api.openweathermap.org/data/2.5/weather"
};

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("input-box");

const weatherThemes = {
    Clear: ["#f59e0b", "#ea580c", "#10234b"],
    Clouds: ["#64748b", "#475569", "#101e3c"],
    Rain: ["#1d4ed8", "#334155", "#071629"],
    Drizzle: ["#0284c7", "#334155", "#0b2545"],
    Thunderstorm: ["#4338ca", "#581c87", "#080e27"],
    Snow: ["#7dd3fc", "#64748b", "#10234b"],
    Mist: ["#94a3b8", "#64748b", "#17243c"],
    Fog: ["#94a3b8", "#64748b", "#17243c"],
    Haze: ["#d6a77a", "#78716c", "#292b42"],
    Smoke: ["#78716c", "#57534e", "#171b2b"],
    Dust: ["#d97706", "#92400e", "#281b26"],
    Sand: ["#f59e0b", "#b45309", "#35202b"],
    Ash: ["#78716c", "#44403c", "#171b2b"],
    Squall: ["#0e7490", "#334155", "#071629"],
    Tornado: ["#7f1d1d", "#374151", "#111827"]
};

let requestId = 0;

function setStatus(message, type = "loading") {
    const messageElement = document.getElementById("weather-message");
    const dot = document.getElementById("status-dot");

    if (messageElement) messageElement.textContent = message;

    if (dot) {
        dot.className = "status-dot";
        if (type === "success") dot.classList.add("success");
        if (type === "error") dot.classList.add("error");
    }
}

function setLoading(loading) {
    const button = document.querySelector(".search-button");
    if (button) button.disabled = loading;
}

function setWeatherBackground(condition) {
    const colors = weatherThemes[condition] || weatherThemes.Clouds;

    document.body.style.background = `
        radial-gradient(ellipse at 78% 35%, ${colors[0]}, transparent 38%),
        radial-gradient(ellipse at 15% 15%, ${colors[1]}, transparent 45%),
        linear-gradient(155deg, ${colors[0]}, ${colors[2]} 65%, #071629)
    `;
    document.body.style.backgroundAttachment = "fixed";
}

function formatLocationDate(timestamp, timezone) {
    const date = new Date((timestamp + timezone) * 1000);

    return date.toLocaleDateString("en-GB", {
        timeZone: "UTC",
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function showWeatherReport(data) {
    const condition = data.weather?.[0]?.main || "Clouds";
    const description = data.weather?.[0]?.description || condition;
    const iconCode = data.weather?.[0]?.icon;

    document.getElementById("city").textContent =
        `${data.name}, ${data.sys.country}`;

    document.getElementById("date").textContent =
        formatLocationDate(data.dt, data.timezone || 0);

    document.getElementById("temp").textContent =
        `${Math.round(data.main.temp)}°C`;

    document.getElementById("weather").textContent =
        description.charAt(0).toUpperCase() + description.slice(1);

    document.getElementById("min-max").innerHTML =
        `H: ${Math.round(data.main.temp_max)}°C` +
        ` <span>│</span> ` +
        `L: ${Math.round(data.main.temp_min)}°C`;

    document.getElementById("feels-like").textContent =
        `${Math.round(data.main.feels_like)}°C`;

    document.getElementById("humidity").textContent =
        `${data.main.humidity}%`;

    document.getElementById("wind").textContent =
        `${data.wind?.speed ?? 0} m/s`;

    document.getElementById("pressure").textContent =
        `${data.main.pressure} hPa`;

    const iconContainer = document.getElementById("weather-icon");
    iconContainer.replaceChildren();

    if (iconCode) {
        const icon = document.createElement("img");
        icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        icon.alt = description;
        icon.width = 150;
        icon.height = 150;
        iconContainer.appendChild(icon);
    }

    setWeatherBackground(condition);

    document.title =
        `${data.name} ${Math.round(data.main.temp)}°C | Weather App`;
}

async function fetchWeather(params) {
    const thisRequest = ++requestId;

    setLoading(true);
    setStatus("Fetching current weather...");

    try {
        params.set("appid", weatherApi.key);
        params.set("units", "metric");

        const response = await fetch(
            `${weatherApi.baseUrl}?${params.toString()}`
        );

        const data = await response.json();

        if (thisRequest !== requestId) return;

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error("Invalid API key or API not activated.");
            }

            if (response.status === 404) {
                throw new Error("City not found. Check the spelling.");
            }

            if (response.status === 429) {
                throw new Error("Too many requests. Try again later.");
            }

            throw new Error(data.message || "Unable to fetch weather.");
        }

        showWeatherReport(data);
        setStatus("Weather updated successfully.", "success");

    } catch (error) {
        if (thisRequest !== requestId) return;

        console.error("Weather error:", error);

        setStatus(
            error instanceof TypeError
                ? "Network error. Check your internet connection."
                : error.message || "Unable to load weather.",
            "error"
        );
    } finally {
        if (thisRequest === requestId) setLoading(false);
    }
}

function getWeatherByCity(cityName) {
    const city = cityName.trim();

    if (!city) {
        setStatus("Please enter a city name.", "error");
        return;
    }

    fetchWeather(new URLSearchParams({ q: city }));
}

function detectCurrentLocation() {
    if (!navigator.geolocation) {
        setStatus("Location is not supported. Search for a city.", "error");
        return;
    }

    const locationRequest = ++requestId;
    setStatus("Requesting your location...");

    navigator.geolocation.getCurrentPosition(
        position => {
            if (locationRequest !== requestId) return;

            const params = new URLSearchParams({
                lat: String(position.coords.latitude),
                lon: String(position.coords.longitude)
            });

            fetchWeather(params);
        },
        error => {
            if (locationRequest !== requestId) return;

            let message = "Unable to detect location. Search for a city.";

            if (error.code === error.PERMISSION_DENIED) {
                message = "Location denied. Search for a city instead.";
            } else if (error.code === error.TIMEOUT) {
                message = "Location timed out. Please search for a city.";
            }

            setStatus(message, "error");
        },
        {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 300000
        }
    );
}

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    getWeatherByCity(searchInput.value);
});

// Start automatically when the page loads.
detectCurrentLocation();



