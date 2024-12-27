import { useEffect } from "react";

function ApiHandler(props) {
  let { city, invalidCity, datafromApi } = props;

  const api_key = import.meta.env.VITE_WEATHER_API_KEY;
  const api_url =
    "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(api_url + city + `&appid=${api_key}`);

        if (response.status === 404) {
          invalidCity("Invalid city name!!");
        } else if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          invalidCity("Something went wrong!");
        } else {
          const data = await response.json();
          invalidCity("Enter city name");
          datafromApi(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        invalidCity("Something went wrong!");
      }
    };
    fetchData();
  }, [city, api_key]);
}

export default ApiHandler;
