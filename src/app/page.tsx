
"use client";

import { useState, useEffect } from 'react';
import { getPersonalizedAdvice, type PersonalizedAdviceInput } from '@/ai/flows/personalized-advice';
import { getTravelSuggestion, type TravelSuggestionOutput, type TravelSuggestionInput } from '@/ai/flows/travel-suggestion';
import { suggestPlaces, type SuggestPlacesOutput, type SuggestPlacesInput } from '@/ai/flows/suggest-places';
import { getTicketFares, type GetTicketFaresOutput, type GetTicketFaresInput } from '@/ai/flows/get-ticket-fares';
import { getMockWeatherData, type WeatherData } from '@/lib/weather-mock';
import { WeatherDisplay } from '@/components/weather/WeatherDisplay';
import { ForecastDisplay } from '@/components/weather/ForecastDisplay';
import { AdviceDisplay } from '@/components/weather/AdviceDisplay';
import { TravelSuggestionDisplay } from '@/components/weather/TravelSuggestionDisplay';
import { PlacesDisplay } from '@/components/weather/PlacesDisplay';
import { TicketFareDisplay } from '@/components/weather/TicketFareDisplay';
import { WeatherSkeleton } from '@/components/weather/WeatherSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Terminal, MapPin, Search } from 'lucide-react';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Home() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [travelSuggestion, setTravelSuggestion] = useState<TravelSuggestionOutput | null>(null);
  const [places, setPlaces] = useState<SuggestPlacesOutput | null>(null);
  const [fares, setFares] = useState<GetTicketFaresOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState('INR');
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const city = data.address.city || data.address.town || data.address.village || 'your location';
          setLocation(city);
          await fetchWeatherData(city, currency);
        } catch (err) {
          setError("Could not determine your city from your location. Please enter it manually.");
          console.error(err);
        } finally {
            setInitialLoading(false);
        }
      }, (geoError) => {
        setError("Could not access your location. Please enable location services or enter a location manually.");
        console.error("Geolocation error:", geoError);
        setInitialLoading(false);
      });
    } else {
      setError("Geolocation is not supported by your browser. Please enter a location manually.");
      setInitialLoading(false);
    }
  }, []);

  const fetchWeatherData = async (city: string, currentCurrency: string) => {
    if (!city) {
      setError("Please enter a location.");
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const data = await getMockWeatherData(city);
      setWeatherData(data);
      await fetchAiData(data, currentCurrency);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again later.");
      console.error(err);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAiData = async (weatherData: WeatherData, currentCurrency: string) => {
      if (weatherData?.currentWeather) {
        try {
          setAdvice(null);
          setTravelSuggestion(null);
          setPlaces(null);
          setFares(null);

          const sharedInput = {
            temperature: weatherData.currentWeather.temperature,
            humidity: weatherData.currentWeather.humidity,
            windSpeed: weatherData.currentWeather.windSpeed,
            weatherDescription: weatherData.currentWeather.weatherDescription,
          };
          
          const advicePromise = getPersonalizedAdvice(sharedInput as PersonalizedAdviceInput);
          const travelSuggestionPromise = getTravelSuggestion(sharedInput as TravelSuggestionInput);
          const placesPromise = suggestPlaces({ city: weatherData.city, weatherDescription: weatherData.currentWeather.weatherDescription } as SuggestPlacesInput);
          const faresPromise = getTicketFares({ city: weatherData.city, currency: currentCurrency } as GetTicketFaresInput);

          const [adviceResult, travelSuggestionResult, placesResult, faresResult] = await Promise.all([advicePromise, travelSuggestionPromise, placesPromise, faresPromise]);
          
          setAdvice(adviceResult.advice);
          setTravelSuggestion(travelSuggestionResult);
          setPlaces(placesResult);
          setFares(faresResult);

        } catch (err) {
          console.error("Failed to fetch AI data:", err);
          // Don't set a user-facing error, just log it. The app is still usable.
          setAdvice("Could not load AI advice at the moment, but here is your weather!");
          setTravelSuggestion({suggestion: "Could not load travel suggestion.", safetyLevel: "Caution"});
          setPlaces({places: []});
          setFares({flightFare: 0, trainFare: 0});
        }
      }
    };
  
  const handleFetchWeather = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchWeatherData(location, currency);
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    setCurrency(newCurrency);
    if(weatherData) {
        setLoading(true);
        try {
            await fetchAiData(weatherData, newCurrency);
        } catch (err) {
            setError("Failed to fetch updated fare data.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
  };

  const renderContent = () => {
    if (initialLoading) {
        return <WeatherSkeleton />;
    }
    if (loading && !weatherData) { // Show skeleton only when it's the first load
      return <WeatherSkeleton />;
    }
    if (error && !weatherData) { // Only show full-page error if there's no data
      return (
        <Alert variant="destructive" className="max-w-md mx-auto">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }
    if (weatherData) {
      return (
        <div className="space-y-8">
          <WeatherDisplay city={weatherData.city} data={weatherData.currentWeather} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AdviceDisplay advice={advice} />
            <TravelSuggestionDisplay suggestion={travelSuggestion} />
            <TicketFareDisplay fares={fares} currency={currency} loading={loading && !!fares} />
          </div>
          <PlacesDisplay places={places} />
          <ForecastDisplay data={weatherData.forecast} />
        </div>
      );
    }
    return (
        <div className="flex flex-col items-center justify-center text-center p-10 border-dashed border-2 rounded-lg">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2 font-headline">Enter a location</h2>
            <p className="text-muted-foreground max-w-sm">Get the current weather and a 7-day forecast for any city in the world.</p>
        </div>
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-5xl font-bold font-headline text-primary-foreground tracking-tight" style={{color: "hsl(var(--primary))"}}>Trip Planner</h1>
          <p className="text-muted-foreground mt-2">Plan your trip with AI-powered weather safety</p>
        </header>
        
        <form onSubmit={handleFetchWeather} className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <Input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="E.g., London, New York, Tokyo"
                className="flex-grow"
                aria-label="Location"
            />
            <div className="flex gap-2">
              <Select value={currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto flex-grow">
                  <Search className="mr-2 h-4 w-4" />
                  Get Weather
              </Button>
            </div>
        </form>
        
        <div className="mt-8">
         {renderContent()}
        </div>
      </div>
    </main>
  );
}
