// clé API
const apiKey = "6529bbf8a404d9dc7494e5331f646f82"; // ⚠️ Ane pas afficher normalement

// Récupération des éléments HTML5
const locButton = document.querySelector(".loc-button");
const todayInfo = document.querySelector(".today-info");
const todayWeatherIcon = document.querySelector(".today-weather i");
const todayTemp = document.querySelector(".weather-temp");
const daysList = document.querySelector(".days-list");
const copyrightYear = document.querySelector(".year");

// Correspondance entre les codes de conditions météorologiques et les noms de classes d'icônes (selon la réponse de l'API OpenWeather)
const weatherIconMap = {
  "01d": "sun",
  "01n": "moon",
  "02d": "sun",
  "02n": "moon",
  "03d": "cloud",
  "03n": "cloud",
  "04d": "cloud",
  "04n": "cloud",
  "09d": "cloud-drizzle", // cloud-rain
  "09n": "cloud-drizzle", // cloud-rain
  "10d": "cloud-rain",
  "10n": "cloud-rain",
  "11d": "cloud-lightning",
  "11n": "cloud-lightning",
  "13d": "cloud-snow",
  "13n": "cloud-snow",
  "50d": "water",
  "50n": "water",
};

// Déclaration de la fonction asynchrone fetchWeatherData qui va permettre de récupérer les données de l'api et de les afficher sur la apge web
const fetchWeatherData = async (location) => {
  // Construction de l'URL de l'API avec l'emplacement et la clé API
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric&lang=fr`;

  // Récupération des données météorologiques depuis l'API
  await fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      // Affichage d'un message de réussite de la requête dans la console
      console.log("✅ Requête réussie");

      // Mise à jour de la météo actuelle
      const todayWeather = data.list[0].weather[0].description;
      const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
      const todayWeatherIconCode = data.list[0].weather[0].icon;

      todayInfo.querySelector("h2").textContent = new Date().toLocaleDateString(
        "fr-FR",
        { weekday: "long" }
      );
      todayInfo.querySelector("span").textContent =
        new Date().toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
      todayTemp.textContent = todayTemperature;

      // Mise à jour de la localisation et de la météo dans la section "letf-info"
      const locationElement = document.querySelector(
        ".today-info > div > span"
      );
      locationElement.textContent = `${data.city.name}, ${data.city.country}`;

      const weatherDescriptionElement = document.querySelector(
        ".today-weather > h3"
      );
      weatherDescriptionElement.textContent = todayWeather;

      // Mise à jour de la section "day-info"
      const todayPrecipitation = `${data.list[0].pop}%`;
      const todayHumidity = `${data.list[0].main.humidity}%`;
      const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

      const dayInfoContainer = document.querySelector(".day-info");
      dayInfoContainer.innerHTML = `
            <div>
                <span class="title">Précipitation :</span>
                <span class="value">${todayPrecipitation}</span>
            </div>
            <div>
                <span class="title">Humidité :</span>
                <span class="value">${todayHumidity}</span>
            </div>
            <div>
                <span class="title">vent :</span>
                <span class="value">${todayWindSpeed}</span>
            </div>
        `;

      // Mise à jour des prévisions sur 4 jours
      const today = new Date();
      const nextDaysData = data.list.slice(1);

      const uniqueDays = new Set();
      let count = 0;
      daysList.innerHTML = "";
      // boucle for of qui va parcourir nextDaysData
      for (const dayData of nextDaysData) {
        const forecastDate = new Date(dayData.dt_txt);
        const dayAbbreviation = forecastDate.toLocaleDateString("fr-FR", {
          weekday: "short",
        });
        const dayTemp = `${Math.round(dayData.main.temp)}°C`;
        const iconCode = dayData.weather[0].icon;

        // S'assurer que la date n'est pas un doublon et aujourd'hui
        if (
          !uniqueDays.has(dayAbbreviation) &&
          forecastDate.getDate() !== today.getDate()
        ) {
          uniqueDays.add(dayAbbreviation);
          daysList.innerHTML += `
                    <li>
                        <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                        <span>${dayAbbreviation}</span>
                        <span class="day-temp">${dayTemp}</span>
                    </li>
                `;
          count++;
        }

        // S'arrêter après avoir obtenu 4 jours différents.
        if (count === 4) break;
      }
    })
    .catch((error) => {
      console.error(`Error fetching weather data: ${error} (Api Error)`);
    });
};

// Ecoute de l'événement chargement de la page et affichage des données de la ville du Puy-en-Vealy
document.addEventListener("DOMContentLoaded", () => {
  const defaultLocation = "Puy-en-Velay";
  // Appel de la fonction fetchWeatherData ayant comme paramètre defaultLocation
  fetchWeatherData(defaultLocation);
});

// Ecoute de l'événement "click" sur le bouton
locButton.addEventListener("click", () => {
  // La méthode prompt() demande au navigateur d'afficher une boîte de dialogue
  const location = prompt("Saisissez une ville :");
  if (!location) return;

  // Appel de la fonctionfetchWeatherData(loaction)
  fetchWeatherData(location);
});

const getCurrentYear = () => {
  const today = new Date();
  const getCurrentYear = today.getFullYear();
  copyrightYear.textContent = `${getCurrentYear}`;
};

// Appel de la fonction getCurrentYear()
getCurrentYear();
