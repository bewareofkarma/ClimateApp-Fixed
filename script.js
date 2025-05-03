const apiKey = 'ac8d76a0eeef3631cef9299e1da5fc28';

// Get favorite cities
const favorites = JSON.parse(localStorage.getItem("favoriteCities")) || [];

favorites.forEach(city => {
  console.log("Favorite city:", city);
});


function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error("City not found");
    }
    return response.json();
  });
}

function getWeather() {
  const city = document.getElementById("cityInput").value;
  const weatherResult = document.getElementById("weatherResult");

  if (!city) {
    weatherResult.innerText = "Please enter a city name.";
    return;
  }

  weatherResult.innerText = "Loading...";

  fetchWeather(city)
    .then(data => {
      const temp = data.main.temp;
      const humidity = data.main.humidity;
      const description = data.weather[0].description;
      weatherResult.innerHTML = `
        🌡️ Temperature: ${temp}°C<br/>
        💧 Humidity: ${humidity}%<br/>
        🌥️ Condition: ${description}
      `;
    })
    .catch(error => {
      weatherResult.innerText = error.message;
    });
}

function compareWeather() {
  const city1 = document.getElementById("cityInput1").value;
  const city2 = document.getElementById("cityInput2").value;
  const result1 = document.getElementById("weatherResult1");
  const result2 = document.getElementById("weatherResult2");

  if (!city1 || !city2) {
    result1.innerText = "Please enter both cities.";
    result2.innerText = "";
    return;
  }

  result1.innerHTML = "Loading...";
  result2.innerHTML = "Loading...";

  Promise.all([fetchWeather(city1), fetchWeather(city2)])
    .then(([data1, data2]) => {
      const temp1 = data1.main.temp;
      const temp2 = data2.main.temp;
      const humidity1 = data1.main.humidity;
      const humidity2 = data2.main.humidity;
      const desc1 = data1.weather[0].description;
      const desc2 = data2.weather[0].description;

      result1.innerHTML = `
        <strong>${city1}</strong><br>
        🌡️ Temp: ${temp1}°C<br>
        💧 Humidity: ${humidity1}%<br>
        🌥️ ${desc1}
      `;

      result2.innerHTML = `
        <strong>${city2}</strong><br>
        🌡️ Temp: ${temp2}°C<br>
        💧 Humidity: ${humidity2}%<br>
        🌥️ ${desc2}
      `;
    })
    .catch(error => {
      result1.innerText = error.message;
      result2.innerText = "";
    });
}

function saveFavorite() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return;

  let favorites = JSON.parse(localStorage.getItem("favoriteCities")) || [];
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem("favoriteCities", JSON.stringify(favorites));
    displayFavorites();
  }
}

function displayFavorites() {
  const favoritesList = document.getElementById("favoritesList");
  const favorites = JSON.parse(localStorage.getItem("favoriteCities")) || [];
  favoritesList.innerHTML = "";

  favorites.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => {
      document.getElementById("cityInput").value = city;
      getWeather();
    };
    favoritesList.appendChild(li);
  });
}

window.onload = function () {
  displayFavorites();
};
