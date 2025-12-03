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