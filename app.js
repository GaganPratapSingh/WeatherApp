
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

// Modern styling added through JavaScript — no CSS file changes needed.
(function addWeatherStyles() {
    if (document.getElementById("weather-modern-styles")) return;

    const style = document.createElement("style");
    style.id = "weather-modern-styles";
    style.textContent = `
        body {
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #172554, #2563eb, #38bdf8);
            background-attachment: fixed;
            background-size: cover;
            transition: background 0.6s ease;
            font-family: Inter, "Segoe UI", Arial, sans-serif;
            color: #fff;
        }

        #input-box {
            box-sizing: border-box;
            max-width: 100%;
            padding: 14px 20px;
            border: 1px solid rgba(255,255,255,.3);
            border-radius: 30px;
            outline: none;
            background: rgba(255,255,255,.16);
            color: inherit;
            font: inherit;
            backdrop-filter: blur(12px);
            transition: .25s ease;
        }

        #input-box::placeholder {
            color: rgba(255,255,255,.75);
        }

        #input-box:focus {
            border-color: #fff;
            box-shadow: 0 0 0 4px rgba(255,255,255,.12);
        }

        #city {
            font-size: clamp(22px, 4vw, 34px);
            font-weight: 700;
            letter-spacing: -.5px;
        }

        #temp {
            font-size: clamp(54px, 10vw, 86px);
            font-weight: 800;
            letter-spacing: -4px;
            line-height: 1.15;
            margin: 14px 0;
        }

        #weather {
            font-size: 20px;
            font-weight: 600;
            text-transform: capitalize;
        }

        #min-max, #date {
            font-size: 14px;
            line-height: 1.8;
            opacity: .9;
        }

        .weather-message {
            margin: 12px 0;
            font-size: 14px;
            color: inherit;
            opacity: .95;
        }

        .weather-loading {
            opacity: .7;
            pointer-events: none;
        }

        @media (max-width: 600px) {
            body {
                padding: 0;
            }

            #input-box {
                width: 100%;
            }

            #temp {
                letter-spacing: -2px;
            }
        }
    `;
    document.head.appendChild(style);
})();

const searchInputBox = document.getElementById("input-box");

let currentRequest = 0;

const weatherThemes = {
    Clear: "linear-gradient(135deg, #f59e0b, #f97316, #be185d)",
    Clouds: "linear-gradient(135deg, #334155, #64748b, #94a3b8)",
    Rain: "linear-gradient(135deg, #0f172a, #1d4ed8, #475569)",
    Drizzle: "linear-gradient(135deg, #164e63, #0284c7, #64748b)",
    Thunderstorm: "linear-gradient(135deg, #111827, #312e81, #581c87)",
    Snow: "linear-gradient(135deg, #64748b, #93c5fd, #e0f2fe)",
    Mist: "linear-gradient(135deg, #475569, #94a3b8, #cbd5e1)",
    Smoke: "linear-gradient(135deg, #292524, #57534e, #78716c)",
    Haze: "linear-gradient(135deg, #78716c, #d6a77a, #64748b)",
    Dust: "linear-gradient(135deg, #78350f, #b45309, #a8a29e)",
    Fog: "linear-gradient(135deg, #475569, #94a3b8, #cbd5e1)",
    Sand: "linear-gradient(135deg, #92400e, #d97706, #fcd34d)",
    Ash: "linear-gradient(135deg, #292524, #57534e, #a8a29e)",
    Squall: "linear-gradient(135deg, #164e63, #334155, #0f172a)",
    Tornado: "linear-gradient(135deg, #111827, #7f1d1d, #374151)"
};

const weatherIcons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Drizzle: "🌦️",
    Thunderstorm: "⛈️",
    Snow: "❄️",
    Mist: "🌫️",
    Smoke: "🌫️",
    Haze: "🌤️",
    Dust: "🌪️",
    Fog: "🌫️",
    Sand: "🌪️",
    Ash: "🌋",
    Squall: "💨",
    Tornado: "🌪️"
};

// Display helpful status messages without requiring HTML changes.
function showMessage(message, isError = false) {
    let messageBox = document.getElementById("weather-message");

    if (!messageBox) {
        messageBox = document.createElement("p");
        messageBox.id = "weather-message";
        messageBox.className = "weather-message";

        const weatherElement = document.getElementById("weather");
        const parent = weatherElement
            ? weatherElement.parentElement
            : document.body;

        parent.appendChild(messageBox);
    }

    messageBox.textContent = message;
    messageBox.style.color = isError ? "#fecaca" : "inherit";
    messageBox.style.display = message ? "block" : "none";
}

function setLoading(isLoading) {
    if (!searchInputBox) return;

    searchInputBox.classList.toggle("weather-loading", isLoading);
    searchInputBox.setAttribute("aria-busy", String(isLoading));
    searchInputBox.placeholder = isLoading
        ? "Getting weather..."
        : "Search city...";
}

if (searchInputBox) {
    searchInputBox.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            getWeatherReport(searchInputBox.value);
        }
    });
}

async function getWeatherReport(cityName) {
    const city = cityName.trim();

    if (!city) {
        showMessage("Please enter a city name.", true);
        searchInputBox?.focus();
        return;
    }

    const requestId = ++currentRequest;

    setLoading(true);
    showMessage("Finding the latest weather...");

    try {
        const params = new URLSearchParams({
            q: city,
            appid: weatherApi.key,
            units: "metric"
        });

        const response = await fetch(
            `${weatherApi.baseUrl}?${params.toString()}`
        );

        const weather = await response.json();

        // Ignore an older search if a newer one has already started.
        if (requestId !== currentRequest) return;

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("City not found. Check the spelling and try again.");
            }

            if (response.status === 401) {
                throw new Error("Weather API key is invalid or not activated.");
            }

            if (response.status === 429) {
                throw new Error("Too many requests. Please try again later.");
            }

            throw new Error(weather.message || "Unable to fetch weather.");
        }

        showWeatherReport(weather);
        showMessage("");
    } catch (error) {
        if (requestId !== currentRequest) return;

        console.error("Weather request failed:", error);
        showMessage(
            error instanceof TypeError
                ? "Network error. Please check your internet connection."
                : error.message || "Something went wrong. Please try again.",
            true
        );
    } finally {
        if (requestId === currentRequest) {
            setLoading(false);
        }
    }
}

function showWeatherReport(weather) {
    const city = document.getElementById("city");
    const temp = document.getElementById("temp");
    const minMax = document.getElementById("min-max");
    const weatherType = document.getElementById("weather");
    const date = document.getElementById("date");

    const condition = weather.weather?.[0]?.main || "Unknown";
    const description = weather.weather?.[0]?.description || condition;
    const icon = weatherIcons[condition] || "🌍";

    if (city) {
        city.textContent = `${weather.name}, ${weather.sys.country}`;
    }

    if (temp) {
        temp.innerHTML = `${Math.round(weather.main.temp)}&deg;C`;
    }

    if (minMax) {
        minMax.innerHTML =
            `${Math.round(weather.main.temp_min)}&deg;C (min) ` +
            `&nbsp; | &nbsp; ` +
            `${Math.round(weather.main.temp_max)}&deg;C (max)`;
    }

    if (weatherType) {
        weatherType.textContent =
            `${icon} ${condition} — ` +
            description.charAt(0).toUpperCase() + description.slice(1);
    }

    if (date) {
        date.textContent = dateManager(new Date());
    }

    // Update the background without relying on local image files.
    document.body.style.background =
        weatherThemes[condition] ||
        "linear-gradient(135deg, #1e293b, #2563eb, #64748b)";

    // Update additional weather fields only if they already exist in HTML.
    const optionalFields = {
        "feels-like": `${Math.round(weather.main.feels_like)}°C`,
        humidity: `${weather.main.humidity}%`,
        wind: `${weather.wind?.speed ?? 0} m/s`,
        pressure: `${weather.main.pressure} hPa`,
        visibility: weather.visibility != null
            ? `${(weather.visibility / 1000).toFixed(1)} km`
            : null
    };

    Object.entries(optionalFields).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element && value !== null) {
            element.textContent = value;
        }
    });

    // Update the browser tab title too.
    document.title =
        `${weather.name}: ${Math.round(weather.main.temp)}°C | Weather`;
}

function dateManager(dateObj) {
    return new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(dateObj);
}

