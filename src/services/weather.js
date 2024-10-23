import axios from "axios";

const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const getWeather = (city) => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;
  return axios.get(url);
};

export default { getWeather };
