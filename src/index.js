import "./styles.css";

console.log("App is running!");

const searchButton = document.getElementById("searchButton");

async function getWeather(query) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=A2N78FL6MR9RVEHPWHMHC62XF`,
  );
  const weatherData = await response.json();
  console.log(weatherData);
  console.log(processWeatherData(weatherData));
}

searchButton.addEventListener("click", function () {
  const query = document.querySelector(".search input").value;
  getWeather(query);
});

function processWeatherData(data) {
  var high = data.days[0].tempmax;
  console.log("high: " + high);
  var low = data.days[0].tempmin;
  console.log("low: " + low);
  var current = data.days[0].temp;
  console.log("current: " + current);
}
