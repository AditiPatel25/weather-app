import "./styles.css";

console.log("App is running!");

const searchButton = document.getElementById("searchButton");

async function loadIcons() {
    const [
        cloudyIcon,
        rainyIcon,
        snowIcon,
        stormIcon,
        sunIcon,
        thunderIcon,
        windIcon
    ] = await Promise.all([
        import("./icons/cloudy.png").then(m => m.default),
        import("./icons/rainy-day.png").then(m => m.default),
        import("./icons/snow.png").then(m => m.default),
        import("./icons/storm.png").then(m => m.default),
        import("./icons/sun.png").then(m => m.default),
        import("./icons/thunder.png").then(m => m.default),
        import("./icons/wind.png").then(m => m.default)
    ]);

    return {
        "Clear": sunIcon,
        "Sunny": sunIcon,
        "Partly Cloudy": cloudyIcon,
        "Mostly Cloudy": cloudyIcon,
        "Overcast": cloudyIcon,
        "Cloudy": cloudyIcon,
        "Rain": rainyIcon,
        "Showers": rainyIcon,
        "Drizzle": rainyIcon,
        "Snow": snowIcon,
        "Sleet": snowIcon,
        "Thunderstorm": thunderIcon,
        "T-Storms": thunderIcon,
        "Storm": stormIcon,
        "Wind": windIcon,
        "Breezy": windIcon
    };
}

let iconMap = null; 

async function getWeather(query) {
    const loading = document.getElementById("loading");
    if (loading) loading.style.display = "block"; 


    try {
        if (!iconMap) {
            iconMap = await loadIcons();
        }
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=A2N78FL6MR9RVEHPWHMHC62XF`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const weatherData = await response.json();
        const processedWeather = processWeatherData(weatherData);
        console.log(processedWeather);
        updateUI(processedWeather);
    } catch (error) {
        console.error(error);
        alert("Unable to fetch weather data. Please try again.");
    } finally {
        if (loading) loading.style.display = "none"; 
    }
}

searchButton.addEventListener("click", function () {
    const query = document.querySelector(".search input").value;
    getWeather(query);
});

function getWeatherIcon(condition) {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes("thunder")) return iconMap["Thunderstorm"];
    if (lowerCondition.includes("storm") && !lowerCondition.includes("thunder")) return iconMap["Storm"];
    if (lowerCondition.includes("partly cloudy")) return iconMap["Partly Cloudy"];
    if (lowerCondition.includes("rain") || lowerCondition.includes("shower")) return iconMap["Rain"];
    if (lowerCondition.includes("snow") || lowerCondition.includes("sleet")) return iconMap["Snow"];
    if (lowerCondition.includes("cloudy") || lowerCondition.includes("overcast")) return iconMap["Cloudy"];
    if (lowerCondition.includes("wind") || lowerCondition.includes("breezy")) return iconMap["Wind"];
    if (lowerCondition.includes("clear") || lowerCondition.includes("sunny")) return iconMap["Sunny"];
    
    return iconMap["Sunny"]; // default
}


function processWeatherData(data) {
    console.log(data);
    const today = data.days[0];
    const current = data.currentConditions?.temp ?? today.temp;
    const feelslike = data.currentConditions?.feelslike ?? today.feelslike;

    const condition = data.currentConditions?.conditions ?? today.conditions;
    const iconFile = getWeatherIcon(condition);

    const weather = {
        location: data.resolvedAddress,
        high: today.tempmax,
        low: today.tempmin,
        current,
        feelslike,
        description: condition,
        humidity: data.currentConditions?.humidity ?? today.humidity,
        windSpeed: data.currentConditions?.windspeed ?? today.windspeed,
        visibility: data.currentConditions?.visibility ?? today.visibility,
        icon: iconFile
    };

    return weather;
}

function updateUI(weather) {
    document.getElementById("location").querySelector("h2").innerText = weather.location;
    document.getElementById("weather-icon").src = weather.icon;
    document.getElementById("high-temp").innerText = weather.high;
    document.getElementById("low-temp").innerText = weather.low;
    document.getElementById("weather-description").innerText = weather.description;
    document.getElementById("current-temp").innerText = weather.current;
    document.getElementById("feels-like").innerText = weather.feelslike;
    document.getElementById("humidity").innerText = weather.humidity;
    document.getElementById("wind-speed").innerText = weather.windSpeed;
    document.getElementById("visibility").innerText = weather.visibility;
}

window.addEventListener("load", () => {
    const defaultCity = "Chicago";
    getWeather(defaultCity);
});

