# Weather Dashboard

A dynamic weather dashboard that allows users to search for weather information by city. The dashboard displays current weather conditions and a 5-day forecast using the OpenWeather API.

## Features

- Search for weather by city name
- Display current weather conditions including:
  - Temperature
  - "Feels like" temperature
  - Humidity
  - Wind Speed
  - Weather Description
  - Weather Icon
- 5-day weather forecast
- Temperature unit toggle (Celsius/Fahrenheit)
- Persistent search history
- Clear history functionality
- Responsive design
- Loading states with animations
- Error handling with helpful messages

## Technologies Used

- HTML5
- CSS3
- JavaScript
- OpenWeather API
- Local Storage for data persistence

## Setup

1. Clone this repository
2. Get an API key from [OpenWeather](https://openweathermap.org/api)
3. Replace `YOUR_API_KEY_HERE` in `script.js` with your actual API key
4. Open `index.html` in your browser

## Usage

1. Enter a city name in the search box
2. Click the search button or press Enter
3. View current weather and 5-day forecast
4. Toggle between Celsius and Fahrenheit using the temperature unit button
5. Click on cities in the search history to quickly view their weather again
6. Clear search history using the "Clear History" button

## Features in Detail

### Current Weather
- City name and current date
- Weather description with icon
- Current temperature
- "Feels like" temperature
- Humidity percentage
- Wind speed (m/s or mph)

### 5-Day Forecast
- Date
- Weather icon
- Weather description
- Temperature
- Humidity

### Search History
- Stores up to 8 recent searches
- Persists between page refreshes
- Quick access to previous searches
- No duplicate entries