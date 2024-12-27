import React, { useState, useEffect } from "react";
import ApiHandler from "./ApiHandler";

function Weatherapp(props) {
  // State variables for input and the city to trigger the API call
  const [inputCity, setInputCity] = useState("");
  const [city, setCity] = useState("mumbai");
  const [res, setRes] = useState([]);
  const [weatherData, setWeatherData] = useState("");
  const [placeholder, setPlaceholder] = useState("Enter city name");
  const [currentTime, setCurrentTime] = useState("Loading...");

  const { main, wind, sys, name, timezone } = res || {};

  const conditionToImageMap = {
    Clear: "/img/clear.png",
    Clouds: "/img/clouds.png",
    Drizzle: "/img/drizzle.png",
    Mist: "/img/mist.png",
    Rain: "/img/rain.png",
    Snow: "/img/snow.png",
  };

  // Handles input change (user typing in the search bar)
  const inputHandler = (e) => {
    setInputCity(e.target.value);
  };

  // Handles the search button click: updates the city state
  const onclickHandler = () => {
    if (inputCity !== "") {
      setCity(inputCity);
      setInputCity("");
      document.querySelector(".search_bar").value = "";
    }
  };

  // Handles "Enter" key press: updates the city state and triggers API call
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputCity !== "") {
        setCity(inputCity);
        setInputCity("");
        document.querySelector(".search_bar").value = "";
      }
    }
  };

  // Function to handle API data and update the state with fetched weather info
  const apidata = (data) => {
    setRes(data);
    setWeatherData(conditionToImageMap[data.weather?.[0]?.main] || "/img/clouds.png");
  };

  // Sets placeholder message when the city is invalid
  const placeholderMessage = (invalidCity) => {
    setPlaceholder(invalidCity);
  };

  // Function to calculate the local time based on the timezone offset (in seconds)
  const getCurrentTimeForLocation = (timezone) => {
    const currentUTCTime = Date.now();

    if (timezone === 19800) {
      return new Date(currentUTCTime).toLocaleTimeString("en-US", { hour12: false });
    }

    const offsetMilliseconds = timezone * 1000;
    const localTime = new Date(currentUTCTime + offsetMilliseconds);

    return localTime.toLocaleTimeString("en-US", { hour12: false });
  };

  useEffect(() => {
    const updateTime = () => {
      if (timezone) {
        const time = getCurrentTimeForLocation(timezone);
        setCurrentTime(time);
      }
    };

    updateTime();

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timezone]);

  return (
    <div>
      <ApiHandler
        datafromApi={apidata}
        city={city}
        invalidCity={placeholderMessage}
      />

      <div className="main_container">
        <div
          className="card"
          style={
            sys?.sunrise * 1000 < new Date().getTime() &&
              new Date().getTime() < sys?.sunset * 1000
              ? { backgroundImage: "url('/img/sun.jpg')" }
              : { backgroundImage: "url('/img/moon.jpg')" }
          }
        >
          <div className="search">
            <input
              type="text"
              className="search_bar"
              placeholder={placeholder}
              spellCheck="false"
              value={inputCity}
              onChange={inputHandler}
              onKeyDown={handleKeyPress}
            />
            <button className="search_btn" onClick={onclickHandler}>
              <img src="/img/search.png" alt="" />
            </button>
          </div>

          <div className="weather">
            <p className="current_time">{currentTime}</p>
            <img src={weatherData} className="wearther_image" alt="" />
            <h1 className="temp">{Math.round(Number(main?.temp)) + "°C"}</h1>
            <h2 className="city">{name}</h2>

            <div className="sunrise_sunset">
              <div className="left">
                <h3>Sunrise</h3>
                <p className="sunrise">
                  {new Date(sys?.sunrise * 1000).toLocaleTimeString("en-US")}
                </p>
              </div>
              <div className="right">
                <h3>Sunset</h3>
                <p className="sunset">
                  {new Date(sys?.sunset * 1000).toLocaleTimeString("en-US")}
                </p>
              </div>
            </div>
          </div>

          <div className="details">
            <div className="col">
              <img src="/img/humidity.png" alt="" />
              <div>
                <p className="humidity">{main?.humidity + " %"}</p>
                <p>Humidity</p>
              </div>
            </div>

            <div className="col">
              <img src="/img/wind.png" alt="" />
              <div>
                <p className="wind">{wind?.speed + " km/h"}</p>
                <p>Wind speed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Weatherapp;
