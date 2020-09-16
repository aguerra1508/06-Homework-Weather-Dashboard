//Open weather API key
var apiKey = "0a788ecc2d25a7e8e1cbd39fd84dc58c";
var searches = [];

/*function getHistory() {
  var cityHist = localStorage.getItem("city");
  if (cityHist !== null) {
    console.log(cityHist);
    cityHist = cityHist.split(",")
    console.log(cityHist)
    //Adding search history list
    var searchList = document.getElementById("search-history");
    //For loop to make each into history item into a button
    for (var i = 0; i < cityHist.length; i++)
      console.log(cityHist[i]);
      searchList.append(cityHist);
  } else {
    console.log("No History");
  }
}*/

function weatherApp() {
  //City search function
  $("#search").on("click", function () {
    //Get city name from search input
    var cityName = document.getElementById("city-name").value;
    searches.push(cityName);
    localStorage.setItem("city", searches);
    console.log(searches);
    //Add to appropriate query URL
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
    //AJAX call
    $.ajax({
        url: queryURL,
        method: "GET",
      })
      //Then get response
      .then(function (response) {
        //add city to search list
        var searchList = document.getElementById("search-history");
        //making as buttons
        var cityBtn = document.createElement("button");
        cityBtn.setAttribute("id", "prevSearch");
        cityBtn.setAttribute("class", "list-group-item list-group-item-action");
        cityBtn.innerHTML = cityName;
        searchList.append(cityBtn);
        //City result from response
        var city = response.city.name
        //Add city to history list
        var selectedCity = document.getElementById("selected-city");
        //Date result from response
        var date = response.list[0].dt_txt;
        //Format date result
        date = moment().format("l", date)
        selectedCity.innerHTML = city + " " + date;
        //Icon result from response
        var weatherIcon = response.list[0].weather[0].icon;
        var iconEl = document.getElementById("weather-icon");
        //Set icon attributes
        iconEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
        iconEl.setAttribute("alt", response.list[0].weather[0].description);
        //Temperature result from response
        var temp = document.getElementById("temperature");
        var tempinK = response.list[0].main.temp;
        //Convert from Kelvin
        var temptoF = (tempinK * (9 / 5) - 459.67)
        //Round temperature
        temptoF = Math.floor(temptoF);
        temp.innerHTML = "Temperature: " + temptoF + "&#8457";
        //Humidity result from response
        var humidity = document.getElementById("humidity");
        var cityHumidity = response.list[0].main.humidity;
        humidity.innerHTML = "Humidity: " + cityHumidity + "%";
        //Wind speed result from response
        var windSpeed = document.getElementById("wind-speed");
        var cityWind = response.list[0].wind.speed;
        windSpeed.innerHTML = "Wind Speed: " + cityWind + " MPH";
        //5 Day Weather Forecast
        var fiveDayEls = document.querySelectorAll("#five-day");
        //For loop to create elements and add data
        for (var i = 0; i < fiveDayEls.length; i++) {
          //Clear any previous data
          fiveDayEls[i].innerHTML = "";
          //Change i to be for next day
          var nextDay = (i * 8) + 4;
          //5 day date
          var forecastDate = response.list[nextDay].dt_txt.split(" ")[0];
          var dateEl = document.createElement("h5");
          dateEl.innerHTML = forecastDate;
          fiveDayEls[i].append(dateEl);
          //5 day weather image
          var imgEl = document.createElement("img");
          var forecastPic = response.list[nextDay].weather[0].icon;
          imgEl.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastPic + "@2x.png");
          imgEl.setAttribute("alt", response.list[nextDay].weather[0].description);
          fiveDayEls[i].append(imgEl);
          //5 day temp
          var tempEl = document.createElement("p");
          var forecastTemp = response.list[nextDay].main.temp;
          //Convert temp from K to F
          var forecastTemptoF = (forecastTemp * (9 / 5) - 459.67);
          forecastTemptoF = Math.floor(forecastTemptoF);
          tempEl.innerHTML = "Temp: " + forecastTemptoF + "&#8457";
          fiveDayEls[i].append(tempEl);
          //5 day humidity
          var humidEl = document.createElement("p");
          var forecastHum = response.list[nextDay].main.humidity;
          humidEl.innerHTML = "Humidity: " + forecastHum + "%";
          fiveDayEls[i].append(humidEl);
        }
        //Lat & Long for UV index API
        var cityLat = response.city.coord.lat;
        var cityLon = response.city.coord.lon;
        //UV index url
        var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLon;
        //AJAX for UV index
        $.ajax({
            url: uvQueryURL,
            method: "GET",
          })
          .then(function (responseUV) {
            //UV index result from response
            var uvIndex = document.getElementById("uv-index");
            var uvVal = document.createElement("span");
            uvIndex.innerHTML = "UV Index: ";
            var cityUV = responseUV.value;
            uvVal.innerHTML = cityUV;
            uvIndex.append(uvVal)
            //Add color and change according to UV index level
            if (cityUV <= 5) {
              uvVal.style.color = "green";
            } else {
              uvVal.style.color = "red";
            }
          });
      });
  });
};
//getHistory();
weatherApp();