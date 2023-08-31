const root = document.querySelector("#root");

const apiKey = "e1d3efd80e3244d4b2885905231505";

function create(tag, options) {
  options;
  const element = document.createElement(tag);
  const keys = Object.keys(options);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    element[key] = options[key];
  }
  return element;
}

function createRoot() {
  const title = create("h1", { className: "title", innerText: "Weather App" });
  root.append(title);

  createSearchPart();

  const actualWeatherAndCity = create("div", {
    className: "actualWeatherAndCity",
  });
  root.append(actualWeatherAndCity);

  const weatherDiv = create("div", { className: "weather-div" });
  weatherDiv.style.display = "none";
  actualWeatherAndCity.append(weatherDiv);

  const imageDiv = create("div", { className: "imageDiv" });
  actualWeatherAndCity.append(imageDiv);
}
createRoot();

//Autocomplete dropdown
let qCity = "";
let inputEl = document.querySelector("#inputField");
let citySubmitted = "Paris";
let cityNames = [];
let favCities = [];

function createSearchPart() {
  const divSearchMain = create("div", { id: "divSMain" });
  const searchDiv = create("div", { id: "inputWrapper" });
  const inputField = create("input", {
    type: "text",
    autocomplete: "off",
    id: "inputField",
    placeholder: "Search city",
  });
  const submitBtn = create("button", { id: "submit", innerText: "Submit" });

  const favDivMain = create("div", { id: "favDivMain" });
  const favDiv = create("div", { id: "favDiv" });
  const favorites = create("h3", { innerText: "Favorite cities" });
  const removeAll = create("button", {
    id: "removeAll",
    innerText: "Remove all",
  });
  removeAll.addEventListener("click", removeAllFavs);

  favDiv.append(favorites, removeAll);
  favDivMain.append(favDiv);
  searchDiv.append(inputField, submitBtn);
  divSearchMain.append(searchDiv, favDivMain);
  root.append(divSearchMain);
}

async function getCityForAutoComplete(city) {
  let searchApi = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${city}`;

  const res = await fetch(searchApi);
  const dat = await res.json();

  cityNames = dat.map((ct) => {
    return ct.name;
  });

  console.log(cityNames);

  return cityNames;
}

document.getElementById("inputField").addEventListener("input", onInputChange);
async function onInputChange() {
  qCity = document.querySelector("#inputField").value;
  clearDropDown();

  if (qCity.length >= 3) {
    await getCityForAutoComplete(qCity);
    createAutocompleteDopdown(cityNames);
  }
}

function createAutocompleteDopdown(list) {
  const ul = create("ul", { classname: "ulClass", id: "ulAuto" });

  list.forEach((city) => {
    const li = create("li", {});

    const btn = create("button", {
      innerHTML: `${city}`,
      className: "cityBtn",
    });
    const fav = create("button", { innerHTML: `+`, className: `favBtn` });

    btn.addEventListener("click", citySelected);
    //btn.addEventListener("click", createPopUp);

    fav.addEventListener("click", addToFavorites);
    function addToFavorites() {
      if (favCities.includes(city) === false) {
        favCities.push(city);
      }
      clearFavorites();
      const favUl = create("div", { id: "favUl" });
      document.querySelector("#favDivMain").append(favUl);
      for (let i = 0; i < favCities.length; i++) {
        const favLi = create("button", {
          innerText: `${favCities[i]}`,
          className: "favCity",
          id: `${favCities[i]}`,
        });
        /*const btnRemove = create("button", {
          className: "btnRemove",
          innerText: "-",
          id: `${favCities[i]}`,
        });
        favLi.append(btnRemove);*/
        favUl.appendChild(favLi);
        favLi.addEventListener("click", citySelected);
      }
    }

    li.append(btn, fav);
    ul.appendChild(li);
  });
  document.querySelector("#inputWrapper").appendChild(ul);
}

/*function removeFavorite() {
  const btnDelete = document.querySelector(".btnRemove");
  btnDelete.addEventListener("click", deleteFavorite(btnDelete.id));
  function deleteFavorite(id){
    for (let i = 0; i < favCities.length; i++) {
      if (favCities[i] === id) {
        favCities.splice(i, 1);
      }
    }
    console.log(favCities);
  }

}
removeFavorite();*/

function removeAllFavs() {
  clearFavorites();
  favCities = [];
}

function clearDropDown() {
  const listEl = document.querySelector("#ulAuto");
  if (listEl) {
    listEl.remove();
  }
}

function clearFavorites() {
  const favCt = document.querySelector("#favUl");
  if (favCt) {
    favCt.remove();
  }
}

function citySelected(e) {
  e.preventDefault();

  const btnEl = e.target;

  document.querySelector("#inputField").value = btnEl.innerHTML;

  clearDropDown();
}

function submitCitySelected() {
  document.querySelector("#submit").addEventListener("click", submitEvent);
  function submitEvent(e) {
    e.preventDefault();
    citySubmitted = document.querySelector("#inputField").value;
    console.log(citySubmitted);
    const weatherDiv = document.querySelector(".weather-div");
    weatherDiv.innerHTML = "";
    weatherDiv.style.display = "flex";
    let weatherPromise = getApiData(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${citySubmitted}`
    );

    weatherPromise.then(function (apiData) {
      weatherDiv.innerHTML = "";
      createDom(apiData);
    });
    const imageDiv = document.querySelector(".imageDiv");
    imageDiv.innerHTML = "";
    fetch(`https://api.pexels.com/v1/search?query=${citySubmitted}`, {
      headers: {
        Authorization:
          "9ZnQNmYzw7fLLZkzpgxaT8dvmU1yyeKbGTsSLjl7hDk5RZXJVy2FRA9k",
      },
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        const image = create("img", {
          className: "image",
          src: data.photos[0].src.original,
        });
        imageDiv.append(image);
        console.log(data.photos);
      });

      
  }

  document.querySelector("#inputField").value = "";
  return citySubmitted;
}

/*loader létrehozása*/
const spinDiv = create("div", { id: "loader", hidden: "true" });
root.append(spinDiv);

function spinnerFunction() {
  document.querySelector("#submit").addEventListener("click", appearLoader);
  function appearLoader() {
    spinDiv.hidden = false;
    setTimeout(()=> {
      spinDiv.hidden = true;
    } , 2000);
  }
}

spinnerFunction();
submitCitySelected();

// Current weather of the selected city

function getApiGeneral(url) {
  return fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      return data;
    });
}

function getApiData(url) {
  const weather_url = url;
  return getApiGeneral(weather_url);
}

function createDom(apiData) {
  const weatherDiv = document.querySelector(".weather-div");
  const cityName = create("h1", {
    className: "city-name",
    innerText: apiData.location.name,
  });
  weatherDiv.append(cityName);

  const temperature = create("div", {
    className: "temperature",
    innerText: `${apiData.current.temp_c} C˚`,
  });
  weatherDiv.append(temperature);

  /*const weatherData = create("div", { className: "weather-data" });
  weatherDiv.append(weatherData);*/

  const icon = create("img", {
    className: "icon",
    src: apiData.current.condition.icon,
  });
  weatherDiv.append(icon);

  const info = create("div", {
    className: "info",
    innerText: `${apiData.current.wind_kph} km/h`,
  });
  weatherDiv.append(info);
}

/*function main() {
    document.querySelector("#submit").addEventListener("click",renderWeather);
    function renderWeather(){
        if(citySubmitted.length > 0){
        let weatherPromise = getApiData(
        `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${citySubmitted}`
    );

    weatherPromise.then(function (apiData) {
        weatherDiv.innerHTML = "";
        createDom(apiData);
    });
   }
function main() {
  document.querySelector("#submit").addEventListener("click", renderWeather);
  function renderWeather() {
    if (citySubmitted.length > 0) {
      let weatherPromise = getWeather(
        `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${citySubmitted}`
      );

      weatherPromise.then(function (apiData) {
        console.log(apiData);
        createDom(apiData);
      });
    }
  }
}
main();*/

const imageApiKey = "9ZnQNmYzw7fLLZkzpgxaT8dvmU1yyeKbGTsSLjl7hDk5RZXJVy2FRA9k";

/* function imageFetch(){
    if(citySubmitted.length > 0) {
    fetch(`https://api.pexels.com/v1/search?query=${citySubmitted}`,{
  headers: {
    Authorization: "9ZnQNmYzw7fLLZkzpgxaT8dvmU1yyeKbGTsSLjl7hDk5RZXJVy2FRA9k"
  }
})
   .then(resp => {
     return resp.json()
   })
   .then(data => {
    const image = create("img", {className: "image", src: data.photos[0].src.original})
    imageDiv.append(image);
    imageDiv.innerHTML = "";
    console.log(data.photos)
   })
  }
}
imageFetch();*/
