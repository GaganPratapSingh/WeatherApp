
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

const searchInputBox = document.getElementById("input-box");
let requestId = 0;

const themes = {
    Clear: ["#f59e0b", "#ea580c", "#7c2d12"],
    Clouds: ["#334155", "#475569", "#0f172a"],
    Rain: ["#0f172a", "#1d4ed8", "#172554"],
    Drizzle: ["#164e63", "#0369a1", "#0f172a"],
    Thunderstorm: ["#111827", "#4338ca", "#581c87"],
    Snow: ["#475569", "#0284c7", "#172554"],
    Mist: ["#475569", "#64748b", "#1e293b"],
    Fog: ["#475569", "#64748b", "#1e293b"],
    Haze: ["#78716c", "#92400e", "#292524"],
    Smoke: ["#292524", "#57534e", "#1c1917"],
    Dust: ["#92400e", "#b45309", "#451a03"],
    Sand: ["#92400e", "#d97706", "#451a03"],
    Ash: ["#292524", "#57534e", "#1c1917"],
    Squall: ["#164e63", "#334155", "#0f172a"],
    Tornado: ["#111827", "#7f1d1d", "#1f2937"]
};

// Remove sample HTML values so no fake weather is displayed.
function clearInitialData() {
    const ids = ["city", "date", "temp", "min-max", "weather"];

    ids.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = "";
    });

    const imageBox = document.querySelector(".img");
    if (imageBox) imageBox.replaceChildren();
}

function showMessage(message, isError = false) {
    let box = document.getElementById("weather-message");

    if (!box) {
        box = document.createElement("p");
        box.id = "weather-message";
        box.className = "weather-message";
        document.querySelector(".app-main").appendChild(box);
    }

    box.textContent = message;
    box.classList.toggle("error", isError);
    box.hidden = !message;
}

function setLoading(loading) {
    if (!searchInputBox) return;

    // Keep search available even while location is being detected.
    searchInputBox.setAttribute("aria-busy", String(loading));
    searchInputBox.placeholder = loading
        ? "Detecting location / loading weather..."
        : "Enter city name...";
}

function createWeatherDetails() {
    let details = document.getElementById("weather-details");

    if (!details) {
        details = document.createElement("div");
        details.id = "weather-details";
        details.className = "weather-details";

        document.querySelector(".weather-body").appendChild(details);
    }

    return details;
}

function createFooter() {
    if (document.querySelector(".app-footer")) return;

    const footer = document.createElement("div");
    footer.className = "app-footer";
    footer.textContent = "LIVE WEATHER · POWERED BY OPENWEATHERMAP";

    document.querySelector(".app-main").appendChild(footer);
}

if (searchInputBox) {
    searchInputBox.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            getWeatherByCity(searchInputBox.value);
        }
    });
}

// Automatically detect the visitor's location on page load.
function detectCurrentLocation() {
    if (!navigator.geolocation) {
        showMessage(
            "Location is not supported by your browser. Search for a city instead.",
            true
        );
        return;
    }

    showMessage("Please allow location access to see your local weather.");

    navigator.geolocation.getCurrentPosition(
        position => {
            getWeatherByCoordinates(
                position.coords.latitude,
                position.coords.longitude
            );
        },
        error => {
            let message;

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message =
                        "Location access denied. Enter a city name to see its weather.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    message =
                        "Your location is unavailable. Please search for a city.";
                    break;
                case error.TIMEOUT:
                    message =
                        "Location request timed out. You can search for a city.";
                    break;
                default:
                    message = "Unable to detect location. Please search for a city.";
            }

            showMessage(message, true);
            setLoading(false);
        },
        {
            enableHighAccuracy: false,
            timeout: 12000,
            maximumAge: 300000
        }
    );
}

async function fetchWeather(params) {
    const thisRequest = ++requestId;

    setLoading(true);
    showMessage("Getting current weather...");

    try {
        params.set("appid", weatherApi.key);
        params.set("units", "metric");

        const response = await fetch(
            `${weatherApi.baseUrl}?${params.toString()}`
        );

        const data = await response.json();

        if (thisRequest !== requestId) return;

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Location not found. Please try another city.");
            }

            if (response.status === 401) {
                throw new Error("Weather API key is invalid or not activated.");
            }

            if (response.status === 429) {
                throw new Error("Too many requests. Please try again later.");
            }

            throw new Error(data.message || "Unable to retrieve weather.");
        }

        showWeatherReport(data);
        showMessage("");
    } catch (error) {
        if (thisRequest !== requestId) return;

        console.error("Weather error:", error);

        showMessage(
            error instanceof TypeError
                ? "Network error. Check your internet connection."
                : error.message || "Something went wrong. Please try again.",
            true
        );
    } finally {
        if (thisRequest === requestId) {
            setLoading(false);
        }
    }
}

function getWeatherByCoordinates(latitude, longitude) {
    const params = new URLSearchParams({
        lat: latitude,
        lon: longitude
    });

    return fetchWeather(params);
}

function getWeatherByCity(cityName) {
    const city = cityName.trim();

    if (!city) {
        showMessage("Please enter a city name.", true);
        searchInputBox?.focus();
        return;
    }

    const params = new URLSearchParams({ q: city });
    return fetchWeather(params);
}

function showWeatherReport(data) {
    const condition = data.weather?.[0]?.main || "Clear";
    const description = data.weather?.[0]?.description || condition;
    const iconCode = data.weather?.[0]?.icon;

    document.getElementById("city").textContent =
        `${data.name}, ${data.sys.country}`;

    document.getElementById("temp").innerHTML =
        `${Math.round(data.main.temp)}&deg;C`;

    document.getElementById("min-max").innerHTML =
        `H: ${Math.round(data.main.temp_max)}&deg;C` +
        ` &nbsp; · &nbsp; ` +
        `L: ${Math.round(data.main.temp_min)}&deg;C`;

    document.getElementById("weather").textContent =
        description.charAt(0).toUpperCase() + description.slice(1);

    document.getElementById("date").textContent =
        new Intl.DateTimeFormat(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());

    // Load the weather icon provided by OpenWeatherMap.
    const imageBox = document.querySelector(".img");

    if (imageBox) {
        imageBox.replaceChildren();

        if (iconCode) {
            const image = document.createElement("img");
            image.src =
                `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            image.alt = description;
            image.width = 115;
            image.height = 115;
            imageBox.appendChild(image);
        }
    }

    // Change background according to actual weather.
    const colors = themes[condition] || themes.Clear;

    document.body.style.background = `
        radial-gradient(ellipse at top left, ${colors[0]}, transparent 55%),
        radial-gradient(ellipse at bottom right, ${colors[1]}, transparent 55%),
        linear-gradient(135deg, ${colors[2]}, ${colors[0]})
    `;
    document.body.style.backgroundAttachment = "fixed";

    // Build weather detail cards from the live API response.
    const details = createWeatherDetails();

    const items = [
        { label: "🌡️ FEELS LIKE", value: `${Math.round(data.main.feels_like)}°C` },
        { label: "💧 HUMIDITY", value: `${data.main.humidity}%` },
        { label: "💨 WIND SPEED", value: `${data.wind?.speed ?? 0} m/s` },
        { label: "🌡️ PRESSURE", value: `${data.main.pressure} hPa` }
    ];

    details.replaceChildren();

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "detail-card";

        const label = document.createElement("span");
        label.className = "detail-label";
        label.textContent = item.label;

        const value = document.createElement("span");
        value.className = "detail-value";
        value.textContent = item.value;

        card.append(label, value);
        details.appendChild(card);
    });

    document.title =
        `${data.name} ${Math.round(data.main.temp)}°C | Weather App`;
}

// Start with an empty page, then fetch real weather.
clearInitialData();
createWeatherDetails();
createFooter();
detectCurrentLocation();
