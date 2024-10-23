import { useState, useEffect } from "react";
import countryService from "./services/countries";
import weatherService from "./services/weather";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

const SearchFilter = ({ filter, handleFilterChange }) => {
  return (
    <form>
      Filter: <input value={filter} onChange={handleFilterChange} />
    </form>
  );
};

const CountryCard = ({ country }) => {
  const languages = country.languages ? Object.values(country.languages) : [];
  const capitalCity = Array.isArray(country.capital)
    ? country.capital[0]
    : country.capital;

  // State to hold the weather data
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (capitalCity) {
      weatherService
        .getWeather(capitalCity)
        .then((response) => {
          const weatherData = response.data;
          setWeather(weatherData); // Set the weather data in state
        })
        .catch((error) => {
          console.log("Failed getting weather", error);
        });
    }
  }, [capitalCity]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital: {capitalCity}</div>
      <div>Population: {country.population}</div>
      <h2>Languages:</h2>
      <ul>
        {languages.map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt} />

      <h2>Weather in {capitalCity}</h2>

      {weather ? (
        <div>
          <div>Temperature: {weather.main.temp} °C</div>
          <div>Wind: {weather.wind.speed} m/s</div>
          <div>Status: {weather.weather[0].main} </div>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />
        </div>
      ) : (
        <div>Loading weather...</div>
      )}
    </div>
  );
};

const CountryDisplay = ({ countriesToShow, handleShowClick }) => {
  if (countriesToShow.length === 0) {
    return <div>No matches found</div>;
  }

  if (countriesToShow.length > 10) {
    return <div>Too many matches, be more specific</div>;
  }

  if (countriesToShow.length === 1) {
    return <CountryCard country={countriesToShow[0]} />;
  }

  return (
    <ul>
      {countriesToShow.map((country) => (
        <div key={country.name.common}>
          <li>{country.name.common}</li>
          <button onClick={() => handleShowClick(country)}>show</button>
        </div>
      ))}
    </ul>
  );
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);

  console.log(apiKey);

  useEffect(() => {
    countryService
      .getAll()
      .then((data) => {
        setCountries(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setSelectedCountry(null);
  };

  const handleShowClick = (country) => {
    setSelectedCountry(country);
  };

  const countriesToShow = filter
    ? countries.filter((country) =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
      )
    : countries;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Countries</h1>
      <SearchFilter filter={filter} handleFilterChange={handleFilterChange} />
      {selectedCountry ? (
        <CountryCard country={selectedCountry} />
      ) : (
        <CountryDisplay
          countriesToShow={countriesToShow}
          handleShowClick={handleShowClick}
        />
      )}
    </div>
  );
};

export default App;
