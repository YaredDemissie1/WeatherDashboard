// API key for OpenWeather API
const API_KEY = 'YOUR_API_KEY_HERE';

// DOM elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

// Add temperature unit toggle
const tempUnitToggle = document.createElement('button');
tempUnitToggle.id = 'temp-unit-toggle';
tempUnitToggle.textContent = '°C / °F';
document.querySelector('header').appendChild(tempUnitToggle);

let isMetric = true;

// Add this near the top of the file, after the DOM elements
document.addEventListener('DOMContentLoaded', () => {
    loadSearchHistory();
    
    // Add default cities if history is empty
    if (searchHistory.children.length === 0) {
        const defaultCities = ["New York", "Los Angeles", "Chicago", "Miami", "Seattle"];
        defaultCities.forEach(city => addToSearchHistory(city, true));
        // Show New York's weather by default
        getWeatherData("New York");
    } else {
        // Show the most recent city's weather
        const lastCity = searchHistory.firstChild.textContent;
        getWeatherData(lastCity);
    }
});

// Load search history from localStorage
function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    history.forEach(city => {
        addToSearchHistory(city, false);
    });
}

// Save search history to localStorage
function saveSearchHistory(city) {
    const history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    if (!history.includes(city)) {
        history.unshift(city);
        if (history.length > 8) history.pop(); // Keep only last 8 searches
        localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
    }
}

// Event listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

tempUnitToggle.addEventListener('click', () => {
    isMetric = !isMetric;
    const lastCity = cityInput.value.trim();
    if (lastCity) getWeatherData(lastCity);
});

function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        showLoading();
        getWeatherData(city);
        addToSearchHistory(city, true);
    }
}

function showLoading() {
    currentWeather.innerHTML = '<div class="loading">Loading...</div>';
    
    // Create forecast placeholders
    forecast.innerHTML = '<div class="forecast-placeholder">' + 
        Array(5).fill('<div class="forecast-placeholder-card"></div>').join('') +
        '</div>';
}

// Add this sample data near the top of the file
const SAMPLE_DATA = {
    current: {
        name: "New York",
        main: {
            temp: 22,
            feels_like: 21.5,
            humidity: 65
        },
        wind: {
            speed: 5.1
        },
        weather: [{
            description: "partly cloudy",
            icon: "02d"
        }]
    },
    forecast: {
        list: [
            {
                dt: Date.now() + 86400000,
                main: {
                    temp: 23.5,
                    humidity: 60
                },
                weather: [{
                    description: "scattered clouds",
                    icon: "02d"
                }]
            },
            {
                dt: Date.now() + 172800000,
                main: {
                    temp: 25.2,
                    humidity: 55
                },
                weather: [{
                    description: "clear sky",
                    icon: "01d"
                }]
            },
            {
                dt: Date.now() + 259200000,
                main: {
                    temp: 21.8,
                    humidity: 70
                },
                weather: [{
                    description: "light rain",
                    icon: "10d"
                }]
            },
            {
                dt: Date.now() + 345600000,
                main: {
                    temp: 20.5,
                    humidity: 75
                },
                weather: [{
                    description: "moderate rain",
                    icon: "10d"
                }]
            },
            {
                dt: Date.now() + 432000000,
                main: {
                    temp: 24.2,
                    humidity: 58
                },
                weather: [{
                    description: "partly cloudy",
                    icon: "02d"
                }]
            }
        ]
    }
};

// Add more detailed weather variations
const WEATHER_VARIATIONS = {
    sunny: {
        description: "clear sky",
        icon: "01d",
        tempModifier: 5,
        humidityBase: 45
    },
    partlyCloudy: {
        description: "partly cloudy",
        icon: "02d",
        tempModifier: 2,
        humidityBase: 55
    },
    cloudy: {
        description: "scattered clouds",
        icon: "03d",
        tempModifier: 0,
        humidityBase: 65
    },
    overcast: {
        description: "overcast clouds",
        icon: "04d",
        tempModifier: -1,
        humidityBase: 70
    },
    lightRain: {
        description: "light rain",
        icon: "10d",
        tempModifier: -2,
        humidityBase: 75
    },
    rain: {
        description: "moderate rain",
        icon: "10d",
        tempModifier: -3,
        humidityBase: 80
    },
    thunderstorm: {
        description: "thunderstorm",
        icon: "11d",
        tempModifier: -4,
        humidityBase: 85
    },
    snow: {
        description: "light snow",
        icon: "13d",
        tempModifier: -8,
        humidityBase: 75
    },
    heavySnow: {
        description: "heavy snow",
        icon: "13d",
        tempModifier: -12,
        humidityBase: 80
    },
    foggy: {
        description: "fog",
        icon: "50d",
        tempModifier: -1,
        humidityBase: 90
    }
};

// Expanded preset cities with US focus
const PRESET_CITIES = {
    // Major US Cities
    "New York": { baseTemp: 22, weather: "partlyCloudy", region: "Northeast" },
    "Los Angeles": { baseTemp: 25, weather: "sunny", region: "West Coast" },
    "Chicago": { baseTemp: 18, weather: "windy", region: "Midwest" },
    "Houston": { baseTemp: 28, weather: "thunderstorm", region: "South" },
    "Phoenix": { baseTemp: 35, weather: "sunny", region: "Southwest" },
    "Philadelphia": { baseTemp: 21, weather: "partlyCloudy", region: "Northeast" },
    "San Antonio": { baseTemp: 29, weather: "sunny", region: "South" },
    "San Diego": { baseTemp: 23, weather: "sunny", region: "West Coast" },
    "Dallas": { baseTemp: 30, weather: "partlyCloudy", region: "South" },
    "San Jose": { baseTemp: 22, weather: "sunny", region: "West Coast" },
    
    // Regional US Cities
    "Miami": { baseTemp: 31, weather: "thunderstorm", region: "Southeast" },
    "Seattle": { baseTemp: 17, weather: "lightRain", region: "Northwest" },
    "Denver": { baseTemp: 20, weather: "partlyCloudy", region: "Mountain" },
    "Boston": { baseTemp: 19, weather: "cloudy", region: "Northeast" },
    "Las Vegas": { baseTemp: 33, weather: "sunny", region: "Southwest" },
    "Portland": { baseTemp: 18, weather: "lightRain", region: "Northwest" },
    "Nashville": { baseTemp: 25, weather: "partlyCloudy", region: "South" },
    "Atlanta": { baseTemp: 26, weather: "thunderstorm", region: "Southeast" },
    "Minneapolis": { baseTemp: 15, weather: "snow", region: "Midwest" },
    "New Orleans": { baseTemp: 29, weather: "thunderstorm", region: "South" },
    
    // Extreme Weather Cities
    "Death Valley": { baseTemp: 45, weather: "sunny", region: "Southwest" },
    "Anchorage": { baseTemp: 5, weather: "heavySnow", region: "Alaska" },
    "Honolulu": { baseTemp: 28, weather: "partlyCloudy", region: "Hawaii" },
    "Buffalo": { baseTemp: 12, weather: "heavySnow", region: "Northeast" },
    "San Francisco": { baseTemp: 18, weather: "foggy", region: "West Coast" }
};

// Add seasonal variations
function getSeasonalAdjustment(city) {
    const month = new Date().getMonth();
    const region = PRESET_CITIES[city]?.region;
    
    const seasonalAdjustments = {
        "Northeast": [-10, -8, -2, 5, 12, 15, 18, 17, 12, 5, -2, -8],
        "Southeast": [-5, -2, 5, 8, 12, 15, 18, 18, 15, 8, 2, -2],
        "Midwest": [-15, -12, -5, 5, 12, 18, 22, 20, 15, 8, -2, -12],
        "Southwest": [-8, -5, 2, 8, 15, 22, 25, 25, 20, 12, 5, -5],
        "West Coast": [-2, 0, 2, 5, 8, 12, 15, 15, 12, 8, 2, -2],
        "Northwest": [-5, -2, 2, 5, 8, 12, 15, 15, 12, 8, 2, -5],
        "Mountain": [-12, -8, -2, 5, 12, 18, 22, 20, 15, 8, -2, -8],
        "Alaska": [-25, -20, -15, -8, 0, 8, 12, 10, 5, -2, -15, -20],
        "Hawaii": [-2, -2, 0, 0, 2, 2, 2, 2, 2, 0, 0, -2]
    };

    return region ? seasonalAdjustments[region][month] : 0;
}

// Update generateForecast to include more realistic patterns
function generateForecast(baseTemp, city) {
    const forecast = [];
    const patterns = Object.values(WEATHER_VARIATIONS);
    let currentPattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    for (let i = 0; i < 5; i++) {
        // 60% chance to keep similar weather, 40% chance to change
        if (Math.random() > 0.6) {
            currentPattern = patterns[Math.floor(Math.random() * patterns.length)];
        }
        
        const seasonalAdjustment = getSeasonalAdjustment(city);
        const tempVariation = Math.random() * 6 - 3; // -3 to +3 degree variation
        const adjustedTemp = baseTemp + tempVariation + currentPattern.tempModifier + seasonalAdjustment;
        
        forecast.push({
            dt: Date.now() + (86400000 * (i + 1)),
            main: {
                temp: adjustedTemp,
                humidity: currentPattern.humidityBase + Math.floor(Math.random() * 20 - 10)
            },
            weather: [{
                description: currentPattern.description,
                icon: currentPattern.icon
            }]
        });
    }
    
    return forecast;
}

// Update the default cities to show on first load
const DEFAULT_CITIES = [
    "New York", "Los Angeles", "Chicago", "Miami", "Seattle"
];

// Update DOMContentLoaded event to use new default cities
document.addEventListener('DOMContentLoaded', () => {
    loadSearchHistory();
    
    if (searchHistory.children.length === 0) {
        DEFAULT_CITIES.forEach(city => addToSearchHistory(city, true));
        getWeatherData("New York"); // Start with New York as default
    } else {
        const lastCity = searchHistory.firstChild.textContent;
        getWeatherData(lastCity);
    }
});

// Update getWeatherData to use more varied sample data
async function getWeatherData(city) {
    try {
        showLoading();
        if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
            console.log('Using sample data (no API key provided)');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const sampleDataCopy = JSON.parse(JSON.stringify(SAMPLE_DATA));
            sampleDataCopy.current.name = city;
            
            // Use preset city data if available, otherwise generate random weather
            let weatherPattern;
            if (PRESET_CITIES[city]) {
                const preset = PRESET_CITIES[city];
                weatherPattern = WEATHER_VARIATIONS[preset.weather];
                sampleDataCopy.current.main.temp = preset.baseTemp;
            } else {
                // Generate random weather for unknown cities
                const patterns = Object.values(WEATHER_VARIATIONS);
                weatherPattern = patterns[Math.floor(Math.random() * patterns.length)];
                sampleDataCopy.current.main.temp = 20 + (Math.random() * 20 - 10);
            }

            // Apply weather pattern
            sampleDataCopy.current.weather[0].description = weatherPattern.description;
            sampleDataCopy.current.weather[0].icon = weatherPattern.icon;
            sampleDataCopy.current.main.temp += weatherPattern.tempModifier;
            sampleDataCopy.current.main.feels_like = sampleDataCopy.current.main.temp - 1.5;
            
            // Generate varied forecast
            sampleDataCopy.forecast.list = generateForecast(sampleDataCopy.current.main.temp, city);
            
            displayCurrentWeather(sampleDataCopy.current);
            displayForecast(sampleDataCopy.forecast);
            return;
        }

        // Get coordinates for the city
        const coordResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        const coordData = await coordResponse.json();

        if (coordData.length === 0) {
            alert('City not found');
            return;
        }

        const { lat, lon } = coordData[0];

        // Get weather data using coordinates
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const weatherData = await weatherResponse.json();

        // Get forecast data
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Error:', error);
        currentWeather.innerHTML = `
            <div class="error">
                <p>Using sample data. For real weather data, add an OpenWeather API key.</p>
                <p>Get an API key from <a href="https://openweathermap.org/api" target="_blank">OpenWeather</a></p>
            </div>`;
    }
}

// Update temperature conversion
function convertTemp(temp) {
    return isMetric ? temp : (temp * 9/5) + 32;
}

function formatTemp(temp) {
    const convertedTemp = convertTemp(temp);
    return `${Math.round(convertedTemp)}°${isMetric ? 'C' : 'F'}`;
}

// Update the displayCurrentWeather function
function displayCurrentWeather(data) {
    const date = new Date().toLocaleDateString();
    const temp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const humidity = data.main.humidity;
    const windSpeed = isMetric ? data.wind.speed : data.wind.speed * 2.237;
    const icon = data.weather[0].icon;
    const description = data.weather[0].description;
    const timestamp = new Date().getTime(); // Add timestamp to prevent caching

    currentWeather.innerHTML = `
        <h2>${data.name} (${date})</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png?t=${timestamp}" alt="Weather icon">
        <p class="weather-description">${description}</p>
        <p>Temperature: ${formatTemp(temp)}</p>
        <p class="feels-like">Feels like: ${formatTemp(feelsLike)}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed.toFixed(1)} ${isMetric ? 'm/s' : 'mph'}</p>
    `;
}

// Update the displayForecast function
function displayForecast(data) {
    forecast.innerHTML = '';
    const timestamp = new Date().getTime(); // Add timestamp to prevent caching
    
    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        const date = new Date(day.dt * 1000).toLocaleDateString();
        const temp = day.main.temp;
        const icon = day.weather[0].icon;
        const description = day.weather[0].description;

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <h3>${date}</h3>
            <img src="https://openweathermap.org/img/wn/${icon}.png?t=${timestamp}" alt="Weather icon">
            <p class="weather-description">${description}</p>
            <p>Temp: ${formatTemp(temp)}</p>
            <p>Humidity: ${day.main.humidity}%</p>
        `;
        forecast.appendChild(forecastCard);
    }
}

// Update the addToSearchHistory function to handle saving
function addToSearchHistory(city, shouldSave = true) {
    // Check if city already exists in history
    const existingItem = Array.from(searchHistory.children)
        .find(item => item.textContent.toLowerCase() === city.toLowerCase());
    
    if (existingItem) {
        // Move existing item to top if it exists
        searchHistory.prepend(existingItem);
        return;
    }

    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.textContent = city;
    historyItem.addEventListener('click', () => {
        cityInput.value = city;
        getWeatherData(city);
    });
    
    searchHistory.prepend(historyItem);
    
    // Limit visible history items to 8
    while (searchHistory.children.length > 8) {
        searchHistory.removeChild(searchHistory.lastChild);
    }

    if (shouldSave) {
        saveSearchHistory(city);
    }
}

// Add clear history button functionality
const clearHistoryBtn = document.getElementById('clear-history');

clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem('weatherSearchHistory');
    searchHistory.innerHTML = '';
});

// Add some popular cities to search history on first load
document.addEventListener('DOMContentLoaded', () => {
    loadSearchHistory();
    
    // Add default cities if history is empty
    if (searchHistory.children.length === 0) {
        const defaultCities = ["Las Vegas", "Tokyo", "New York", "Paris", "Sydney"];
        defaultCities.forEach(city => addToSearchHistory(city, true));
        // Show Las Vegas's weather by default
        getWeatherData("Las Vegas");
    } else {
        // Show the most recent city's weather
        const lastCity = searchHistory.firstChild.textContent;
        getWeatherData(lastCity);
    }
}); 