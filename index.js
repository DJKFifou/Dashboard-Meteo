const access_key = "a3b39cbd93b86a7797503b56d6da66d9";

const urlCurrent = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=`;

const urlDaily = `https://api.openweathermap.org/data/2.5/forecast?units=metric&cnt=6&q=`;

const input = document.querySelector(".query-input");
const search = document.querySelector(".search-input");

async function currentWeather(query) {
  const response = await fetch(urlCurrent + query + `&appid=${access_key}`);
  const data = await response.json();

  const rightContent = document.querySelector(".right-content");
  const error = document.querySelector(".error");

  if (data.cod === "404") {
    rightContent.style.display = "none";
    error.innerHTML = " /!\\ Ville non trouvée /!\\ ";
    document.querySelector(
      "iframe"
    ).src = `https://maps.google.com/maps?hl=fr&z=12&output=embed`;
    return;
  } else {
    rightContent.style.display = "flex";
    error.innerHTML = "";
    document.querySelector(
      "iframe"
    ).src = `https://maps.google.com/maps?q=${data.coord.lat},${data.coord.lon}&hl=fr&z=12&output=embed`;

    document.querySelector(".query").textContent = data.name;

    document.querySelector(
      ".informations-icon"
    ).src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    document.querySelector(".temp").textContent =
      Math.round(data.main.temp) + " °C";

    const type = document.querySelector(".type");
    const weather = data.weather[0].main;

    const weatherDescriptions = {
      Clouds: "Nuages",
      Clear: "Dégagé",
      Rain: "Pluie",
      Snow: "Neige",
      Mist: "Brouillard",
      Drizzle: "Bruine",
      Thunderstorm: "Orage",
      Haze: "Brume",
      Fog: "Brouillard",
      Smoke: "Fumée",
      Dust: "Poussière",
      Sand: "Sable",
      Ash: "Cendres",
      Squall: "Rafale",
      Tornado: "Tornade",
    };

    if (weatherDescriptions.hasOwnProperty(weather)) {
      type.textContent = weatherDescriptions[weather];
    }

    document.querySelector(".humidity").textContent = data.main.humidity + " %";

    document.querySelector(".wind").textContent =
      Math.round(data.wind.speed) + " km/h";
  }
}

async function dailyWeather(query) {
  const response = await fetch(urlDaily + query + `&appid=${access_key}`);
  const data = await response.json();

  const dailyContainer = document.querySelector(".daily-container");
  dailyContainer.innerHTML = "";

  for (let i = 0; i < data.list.length; i++) {
    let fullTime = data.list[i].dt_txt;
    let time = fullTime.split(" ")[1];
    let hours = time.slice(0, 5);

    const dayContainer = document.createElement("div");
    dayContainer.className = `day`;

    const hoursElem = document.createElement("h3");
    hoursElem.className = `hours`;
    hoursElem.textContent = hours;
    dayContainer.appendChild(hoursElem);

    const iconElem = document.createElement("img");
    iconElem.className = `hours-type-icon-${i}`;
    iconElem.src = `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`;
    dayContainer.appendChild(iconElem);

    const detailsContainer = document.createElement("div");
    detailsContainer.className = `hours-details`;
    const temp = document.querySelector(".temp");

    const tempElem = document.createElement("h4");
    tempElem.className = `hours-temp`;
    tempElem.textContent = Math.round(data.list[i].main.temp) + " °C";
    if (data.list[i].main.temp <= 0) {
      tempElem.style.color = "blue";
      temp.style.color = "blue";
    } else if (data.list[i].main.temp > 0 && data.list[i].main.temp <= 10) {
      tempElem.style.color = "green";
      temp.style.color = "green";
    } else if (data.list[i].main.temp >= 10 && data.list[i].main.temp < 20) {
      tempElem.style.color = "yellow";
      temp.style.color = "yellow";
    } else if (data.list[i].main.temp >= 20 && data.list[i].main.temp < 30) {
      tempElem.style.color = "orange";
      temp.style.color = "orange";
    } else {
      tempElem.style.color = "red";
      temp.style.color = "red";
    }
    detailsContainer.appendChild(tempElem);

    const humidityElem = document.createElement("h4");
    humidityElem.className = `hours-humidity`;
    humidityElem.textContent = data.list[i].main.humidity + " %";
    detailsContainer.appendChild(humidityElem);

    const windElem = document.createElement("h4");
    windElem.className = `hours-wind`;
    windElem.textContent = Math.round(data.list[i].wind.speed) + " km/h";
    detailsContainer.appendChild(windElem);

    dayContainer.appendChild(detailsContainer);

    dailyContainer.appendChild(dayContainer);
  }
}

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    currentWeather(input.value);
    dailyWeather(input.value);
    window.localStorage.setItem("city", input.value);
  }
});

search.addEventListener("click", () => {
  currentWeather(input.value);
  dailyWeather(input.value);
  window.localStorage.setItem("city", input.value);
});

let city = window.localStorage.getItem("city");

currentWeather(city ? city : "Paris");
dailyWeather(city ? city : "Paris");
