// City input field 
const cityInput = document.getElementById("cityInput");
// dropdown 
const recentSearches = document.getElementById("recentSearches");
// search and location buttons 
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
// result 
const result = document.getElementById("result");
const form = document.querySelector("form");
const mainSection = document.querySelector("section");
const body = document.querySelector("body");

// API KEY and API Current Weather And Forecast URLS
const API_KEY = "29980cf7f6b444f28421123a8921c84d";
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const RECENT_KEY = "recentCities";
const MAX_RECENT = 5;


// adding event listener to the buttons and to the recent drop down
searchBtn.addEventListener("click", () =>{
    const city = cityInput.value.trim();
    if(!city){
        alert("please enter a City Name ");
    }
    fetchWeatherByCity(city);
});

locationBtn.addEventListener("click",() => {
    if(!navigator.geolocation){
        alert("Geolocation is not supported ");
    }
    navigator.geolocation.getCurrentPosition(
    (pos) => {
        const {latitude , longitude} = pos.coords;
        fetchWeatherByLoaction( latitude , longitude);
    },
    () => {
        alert("uable to get your loaction");
    }
    );    
});


recentSearches.addEventListener("change", () =>{
    const selectedCity = recentSearches.value;
    if(selectedCity){
        cityInput.value =selectedCity;
        fetchWeatherByCity(selectedCity);
    }
});

//-------end of adding EventListener-------------//

// fetchWeatherByCity function // 

async function fetchWeatherByCity(city) {
    try {
    // URL for fetching Current Weather //
    const currentURL = `${CURRENT_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    // URL for fetching FOrecast Weather //
    const forecastURL = `${FORECAST_URL}?q=${encodeURIComponent(ciyt)}&appid=${API_KEY}&units=metric`;
    
    const [currentRES , forecastRES] = await Promise.all([
        fetch(currentURL),
        fetch(forecastURL),
    ]);
    
    if(!currentRES.ok) throw new Error ("City Not Found ");
    if(!forecastRES.ok)  throw new Error("Unable to fetch Forecast ");
    
    const currentData = await currentRES.json();
    const forecastData = await forecastRES.json();

    const dailyWeather = getDailyForecast(forecastData);
    renderWeather(currentData , dailyWeather);
    addRecentCity(currentData.name);
    }catch(err){
        showError(err.message);
    }
}
//---end of fetchWeatherByCity Function----------------//

// fetchWeatherByLocation function //

async function fetchWeatherByLocation(lat , lon) {
    try {
    // URL for fetching Current Weather using coords //
     const currentUrl = `${CURRENT_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    // URL for fetching Forecast Weather using Coords //
    const forecastUrl = `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    
    const [currentRES , forecastRES] = await Promise.all([
        fetch(currentURL),
        fetch(forecastURL),
    ]);
    
    if(!currentRES.ok) throw new Error ("unable to fetch weather for your location");
    if(!forecastRES.ok)  throw new Error("Unable to fetch Forecast ");
    
    const currentData = await currentRES.json();
    const forecastData = await forecastRES.json();

    const dailyWeather = getDailyForecast(forecastData);
    renderWeather(currentData , dailyWeather);
    addRecentCity(currentData.name);
    }catch(err){
        showError(err.message);
    }
}
//---end of fetchWeatherByLocation Function----------------//


// getDailyForecast function  to get the five days forecast//
function getDailyForecast(forecastData){
    const mapByDate = {};

    forecastData.list.forEach((item) => {
        const dateStr = item.dt_txt.split(" ")[0];
        if(!mapByDate[dateStr]){
            mapByDate[dateStr]= [];
        }        
        mapByDate[dateStr].push(item);
    });

    const todayStr =  new Date().toISOString().split("T")[0];
    const allDates = Object.keys(mapByDate).filter((d) => d > todayStr).sort();

    const nextFive = allDates.slice(0,5);
    const daily = nextFive.map((dateStr) => {
        const items = mapByDate[dateStr];

        let chose = items.find((i) => i.dt_txt.includes("12:00:00")) || items[Math.floor(items.length / 2)];

        return {
            date : dateStr,
            temp : chose.main.temp,
            icon : chose.weather[0].icon,
            description : chose.weather[0].description,

        };
    });
    return daily;
}
// extracting the 5 days forecast weather and displaying on the html
function renderWeather(current, dailyForecasts) {
  const {
    name,
    main: { temp, feels_like, humidity },
    weather,
    wind: { speed },
    sys: { country },
  } = current;

  const description = weather[0]?.description || "";
  const icon = weather[0]?.icon || "01d";
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  // Build forecast cards HTML
  let forecastHTML = "";
  if (dailyForecasts && dailyForecasts.length > 0) {
    forecastHTML = `
      <div class="mt-8">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">5-Day Forecast</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          ${dailyForecasts
            .map((day) => {
              const dayName = formatDayName(day.date);
              const shortDate = formatShortDate(day.date);
              const dayIconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
              return `
                <div class="bg-gray-100 p-4 rounded-lg text-center">
                  <p class="text-sm font-medium text-gray-700">${dayName}</p>
                  <p class="text-xs text-gray-500 mb-2">${shortDate}</p>
                  <img src="${dayIconUrl}" alt="Forecast Icon" class="w-12 h-12 mx-auto mb-2">
                  <p class="text-lg font-semibold">${Math.round(
                    day.temp
                  )}°C</p>
                  <p class="text-xs text-gray-600 capitalize mt-1">
                    ${day.description}
                  </p>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  resultDiv.innerHTML = `
    <!-- CURRENT WEATHER MAIN CARD -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">${name}, ${country}</h2>
        <p class="text-gray-500 capitalize">${description}</p>
      </div>
      <img src="${iconUrl}" alt="Weather Icon" class="w-20 h-20">
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gray-100 p-4 rounded-lg text-center">
        <p class="text-sm text-gray-500">Temperature</p>
        <p class="text-2xl font-semibold">${Math.round(temp)}°C</p>
      </div>

      <div class="bg-gray-100 p-4 rounded-lg text-center">
        <p class="text-sm text-gray-500">Feels Like</p>
        <p class="text-2xl font-semibold">${Math.round(feels_like)}°C</p>
      </div>

      <div class="bg-gray-100 p-4 rounded-lg text-center">
        <p class="text-sm text-gray-500">Humidity</p>
        <p class="text-2xl font-semibold">${humidity}%</p>
      </div>

      <div class="bg-gray-100 p-4 rounded-lg text-center md:col-span-3">
        <p class="text-sm text-gray-500">Wind Speed</p>
        <p class="text-2xl font-semibold">${speed} m/s</p>
      </div>
    </div>

    ${forecastHTML}
  `;
}

// date helping functions for getting the week day and the date and month in short form //
function formatDayName(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: "short" }); // Mon, Tue...
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

// shwoing error message on ui
function showError(message) {
  resultDiv.innerHTML = `
    <h2 class="text-xl font-semibold text-red-600">Error</h2>
    <p class="mt-4 text-gray-600">${message}</p>
  `;
}