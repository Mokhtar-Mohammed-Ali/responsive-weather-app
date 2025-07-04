var searchInput = document.getElementById("search");
var forecastContainer = document.getElementById("forecast");
var apiKey = "f51b63687bc6499dbc3150416252606";

async function getWeather(location) {
  try {
    var response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3`
    );

    if (response.ok) {
      var data = await response.json();

      //console.log(data);
      displayWeather(data);
    } else {
      forecastContainer.innerHTML = `<div class="col-12"><p class="text-danger text-center">Could not find location. Please try another.</p></div>`;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    forecastContainer.innerHTML = `<div class="col-12"><p class="text-danger text-center">An error occurred while fetching weather data.</p></div>`;
  }
}

function displayWeather(data) {
  var { location, current, forecast } = data;
  var forecastDays = forecast.forecastday;

  var cartoona = ``;

  // Today's forecast
  //console.log(forecastDays[0].date);
  var today = new Date(forecastDays[0].date);

  var dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  var dayMonth = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  });

  // أيقونة النهار/الليل
  var todayIcon =
    current.is_day === 0 ? `https:${current.condition.icon}` : "images/113.png";

  cartoona += `
        <div class="col-lg-4 mb-4">
            <div class="card text-white text-center">
                <div class="card-header today d-flex justify-content-between align-items-center">
                    <span>${dayName}</span>
                    <span>${dayMonth}</span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${location.name}</h5>
                    <img src="${todayIcon}" alt="weather icon" class="weather-icon">
                    <p class="card-text display-1 fw-bold">${current.temp_c}°C</p>
                    <p class="text-info">${current.condition.text}</p>
                    <div class="details">
                        <span><img class="me-1" src='images/icon-umberella@2x.png' alt='' style='height:24px;width:auto;'> ${current.humidity}%</span>
                        <span class="mx-2"><img class="me-1" src='images/icon-wind@2x.png' alt='' style='height:24px;width:auto;'> ${current.wind_kph}km/h</span>
                        <span><img class="me-1" src='images/icon-compass@2x.png' alt='' style='height:24px;width:auto;'> ${current.wind_dir}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Next 2 days forecast
  for (var i = 1; i < forecastDays.length; i++) {
    var nextDay = new Date(forecastDays[i].date);
    var nextDayName = nextDay.toLocaleDateString("en-US", { weekday: "long" });
    var nextDayMonth = nextDay.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });

    // var dayIcon = forecastDays[i].astro.is_sunrise ? `https:${forecastDays[i].day.condition.icon}` : 'images/113.png';
    cartoona += `
            <div class="col-lg-4 mb-4">
                <div class="card text-white text-center">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <span>${nextDayName}</span>
                        <span>${nextDayMonth}</span>
                    </div>
                    <div class="card-body">
<img src="https:${forecastDays[i].day.condition.icon}" alt="weather icon" class="weather-icon">                        <p class="card-text fs-2 fw-bold mb-1">${forecastDays[i].day.maxtemp_c}°C</p>
                        <p class="card-text mb-2">${forecastDays[i].day.mintemp_c}°C</p>
                        <p class="text-info">${forecastDays[i].day.condition.text}</p>
                        <div class="details">
                            <span "><img class="me-1" src='images/icon-umberella@2x.png' alt='' style='height:24px;width:auto;'> ${forecastDays[i].day.avghumidity}%</span>
                            <span class="mx-2"><img class="me-1" src='images/icon-wind@2x.png' alt='' style='height:24px;width:auto;'> ${forecastDays[i].day.maxwind_kph}km/h</span>
                            <span ><img class="me-1" src='images/icon-compass@2x.png' alt='' style='height:24px;width:auto;'> UV: ${forecastDays[i].day.uv}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
  }

  forecastContainer.innerHTML = cartoona;
}

searchInput.addEventListener("keyup", function () {
  if (searchInput.value.length >= 3) {
    getWeather(searchInput.value);
  }
});

// Get user's current location using the browser's Geolocation API.
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        getWeather(`${lat},${lon}`);
      },
      () => {
        // If user denies location, default to a city
        getWeather("cairo");
      }
    );
  } else {
    // Geolocation not supported by browser
    getWeather("cairo");
  }
}
getUserLocation();

// Show only the "contact" section and hide all other sections, except the footer.

function showContact() {
  var contact = document.getElementById("contact-section");
  contact.classList.remove("d-none");
  document.querySelector(".forecast-table").classList.add("d-none");
  document.querySelector("header").classList.add("d-none");
  console.log(contact);
}

// Hide the "contact" section and show other sections
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function () {
    document
      .querySelectorAll(".nav-link")
      .forEach((link) => link.classList.remove("active"));

    this.classList.add("active");

    if (this.id !== "contactNav") {
      document.getElementById("contact-section").classList.add("d-none");
      document.querySelector("header").classList.remove("d-none");
      document.querySelector(".forecast-table").classList.remove("d-none");
    }
  });
});
