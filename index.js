const form = document.querySelector('.search-form');
const API_URL = "https://api.openweathermap.org/data/2.5/weather?";
const API_KEY = "fd48bdf8a8b87b3c140f17625f4e2d57";

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const FETCH_URL = `${API_URL}lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

            try {
                let response = await fetch(FETCH_URL);
                if (!response.ok) {
                    alert("An error occurred while fetching the weather data.");
                    return;
                }
                let data = await response.json();
                displayWeather(data);
            } catch (error) {
                console.log(`Error has occurred: ${error.message}`);
                alert("An error occurred while fetching the weather data.");
            }
        }, (error) => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Permission denied.");
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                alert("Location information is unavailable.");
            } else if (error.code === error.TIMEOUT) {
                alert("The request to get your location timed out.");
            } else if (error.code === error.UNKNOWN_ERROR) {
                alert("An unknown error occurred.");
            }
        }
    );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

window.onload = function() {
    getUserLocation();
};

form.addEventListener("submit", async function(event) {
    event.preventDefault();

    const inputValue = document.querySelector('.search').value;
    const FETCH_URL = (`${API_URL}q=${inputValue}&appid=${API_KEY}&units=metric`);
    
    try {
        let response = await fetch(FETCH_URL);
        if (!response.ok) {
          if (response.status === 404) {
            alert("City not found. Please enter a valid city name.");
        } else {
            alert("An error occurred while fetching the weather data.");
        }
          return;
        }
        let data = await response.json();
           displayWeather(data);
    } catch (error) {
        console.log(`Error has occurred! ${error.message}`);
        alert("An error occurred while fetching the weather data.");
    }
});

function displayWeather(data) {
    document.querySelector('.city-name').innerHTML = `<h2>${data.name}</h2>`;
    document.querySelector('.country-name').innerHTML = `<h2>${data.sys.country}</h2>`;
    document.querySelector('.temp-value').innerHTML = `<h2>${data.main.temp}°C</h2>`;

    const iconTemp = document.querySelector('.weather-icon');
    iconTemp.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
}

