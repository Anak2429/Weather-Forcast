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


