const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const weatherInfoSection = document.querySelector('.weather-info');

const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummeryImg = document.querySelector('.weather-summery-img');
const currentDateTxt = document.querySelector('.current-date-txt');

const updateForecastitemsContainer = document.querySelector('.forecast-items-container')

const apiKey = '57cbec3bce5ecf15038acfb13ebb8cc3';

// Focus on cityInput when the page loads
document.addEventListener('DOMContentLoaded', () => {
    cityInput.focus();
});
// Focus on cityInput after search button click
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
        cityInput.focus(); // Focus back on the input field
    }
});

// Focus on cityInput after pressing Enter key
cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value);
        cityInput.value = '';
        cityInput.blur();
        cityInput.focus(); // Focus back on the input field
    }
});


async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    return response.json();
}

function getWeatherIcon(id) { // Corrected function name
    if (id >= 200 && id <= 232) { 
        return 'thunderstorm.svg';
    } else if (id >= 300 && id <= 321) { 
        return 'Drizzle.svg'; // Corrected case
    } else if (id >= 500 && id <= 531) { 
        return 'rain1.png';
    } else if (id >= 600 && id <= 622) { 
        return 'snow.png';
    } else if (id >= 700 && id <= 781) {  
        return 'Atmosphere2.png'; // Corrected case
    } else if (id === 800) { 
        return 'sun (2).svg';
    } else { 
        return 'clouds.png';
    }
}

function getCurrentDate() {
    const currentDate = new Date();
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    };
    return currentDate.toLocaleDateString('en-GB', options);
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchData('weather', city);

    if (!weatherData || weatherData.cod !== 200) {
        showDisplaySection(notFoundSection);
        return;
    }

    console.log(weatherData); // Check the API response

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed },
    } = weatherData;

    countryTxt.textContent = country;
    tempTxt.textContent = Math.round(temp) + ' °C';
    conditionTxt.textContent = main;
    humidityValueTxt.textContent = humidity + '%';
    windValueTxt.textContent = speed + ' M/s';

    weatherSummeryImg.src = `assets/${getWeatherIcon(id)}`; // Call the corrected function
    currentDateTxt.textContent = getCurrentDate();

    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection);
}

async function updateForecastsInfo(city){
    const forecastsData = await getFetchData('forecast', city);

    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    updateForecastitemsContainer.innerHTML=''
    forecastsData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken)&& !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastitem(forecastWeather)

        }
        
    })

}

function updateForecastitem(weatherData){
    console.log(weatherData)
    const{
        dt_txt:date,
        weather:[{id}],
        main:{temp}
    }=weatherData

    const dateTaken = new Date(date)
    const dateOption={
        day:'2-digit',
        month:'short'
    }
    const dateResult= dateTaken.toLocaleDateString('en-US',dateOption)

    const forecastItem=`
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp"> ${Math.round(temp)} ॰C</h5>
        </div>
    `

    updateForecastitemsContainer.insertAdjacentHTML('beforeend',forecastItem)
}

function showDisplaySection(Section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none');

    Section.style.display = 'flex';
}

