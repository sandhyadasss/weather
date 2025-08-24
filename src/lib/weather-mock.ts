import { format, addDays } from 'date-fns';

export interface WeatherData {
  city: string;
  currentWeather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    weatherDescription: string;
  };
  forecast: {
    day: string;
    high: number;
    low: number;
    weatherDescription: string;
  }[];
}

const weatherDescriptions = ["Sunny", "Cloudy", "Rain", "Partly cloudy", "Thunderstorm", "Snow"];

// These functions will only be called on the client, so Math.random is safe.
const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;


export const getMockWeatherData = async (city: string): Promise<WeatherData> => {
  await new Promise((res) => setTimeout(res, 1500)); // Simulate API delay

  const today = new Date();
  
  return {
    city: city,
    currentWeather: {
      temperature: getRandomInt(5, 25),
      humidity: getRandomInt(40, 90),
      windSpeed: getRandomInt(5, 25),
      weatherDescription: getRandomElement(weatherDescriptions),
    },
    forecast: Array.from({ length: 7 }, (_, i) => {
      const high = getRandomInt(10, 30);
      return {
        day: i === 0 ? 'Today' : format(addDays(today, i), 'EEE'),
        high: high,
        low: high - getRandomInt(5, 10),
        weatherDescription: getRandomElement(weatherDescriptions),
      };
    }),
  };
};
