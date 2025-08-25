"use client";

import { useState, useEffect } from 'react';
import { getPersonalizedAdvice, type PersonalizedAdviceInput } from '@/ai/flows/personalized-advice';
import { getTravelSuggestion, type TravelSuggestionOutput } from '@/ai/flows/travel-suggestion';
import { suggestPlaces, type SuggestPlacesOutput } from '@/ai/flows/suggest-places';
import { getMockWeatherData, type WeatherData } from '@/lib/weather-mock';
import { WeatherDisplay } from '@/components/weather/WeatherDisplay';
import { ForecastDisplay } from '@/components/weather/ForecastDisplay';
import { AdviceDisplay } from '@/components/weather/AdviceDisplay';
import { TravelSuggestionDisplay } from '@/components/weather/TravelSuggestionDisplay';
import { PlacesDisplay } from '@/components/weather/PlacesDisplay';
import { WeatherSkeleton } from '@/components/weather/WeatherSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Terminal, MapPin, Search } from 'lucide-react';
import React from 'react';

export default function Home() {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [travelSuggestion, setTravelSuggestion] = useState<TravelSuggestionOutput | null>(null);
  const [places, setPlaces] = useState<SuggestPlacesOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (city: string) => {
    if (!city) {
      setError("Please enter a location.");
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const data = await getMockWeatherData(city);
      setWeatherData(data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again later.");
      console.error(err);
      setWeatherData(null);
    } finally {
      // setLoading(false) is handled in the advice useEffect
    }
  };
  
  useEffect(() => {
    const fetchAiData = async () => {
      if (weatherData?.currentWeather) {
        try {
          setAdvice(null);
          setTravelSuggestion(null);
          setPlaces(null);

          const sharedInput = {
            temperature: weatherData.currentWeather.temperature,
            humidity: weatherData.currentWeather.humidity,
            windSpeed: weatherData.currentWeather.windSpeed,
            weatherDescription: weatherData.currentWeather.weatherDescription,
          };
          
          const advicePromise = getPersonalizedAdvice(sharedInput as PersonalizedAdviceInput);
          const travelSuggestionPromise = getTravelSuggestion(sharedInput as TravelSuggestionInput);
          const placesPromise = suggestPlaces({ city: weatherData.city });

          const [adviceResult, travelSuggestionResult, placesResult] = await Promise.all([advicePromise, travelSuggestionPromise, placesPromise]);
          
          setAdvice(adviceResult.advice);
          setTravelSuggestion(travelSuggestionResult);
          setPlaces(placesResult);

        } catch (err) {
          console.error("Failed to fetch AI data:", err);
          // Don't set a user-facing error, just log it. The app is still usable.
          setAdvice("Could not load AI advice at the moment, but here is your weather!");
          setTravelSuggestion({suggestion: "Could not load travel suggestion.", safetyLevel: "Caution"});
          setPlaces({places: []});
        } finally {
          setLoading(false);
        }
      }
    };

    if (weatherData) {
      fetchAiData();
    } else {
        setLoading(false);
    }
  }, [weatherData]);
  
  const handleFetchWeather = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeatherData(location);
  };

  const renderContent = () => {
    if (loading) {
      return <WeatherSkeleton />;
    }
    if (error) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AdviceDisplay advice={advice} />
            <TravelSuggestionDisplay suggestion={travelSuggestion} />
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
        
        <form onSubmit={handleFetchWeather} className="flex gap-2 max-w-md mx-auto">
            <Input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="E.g., London, New York, Tokyo"
                className="flex-grow"
                aria-label="Location"
            />
            <Button type="submit" disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                Get Weather
            </Button>
        </form>
        
        <div className="mt-8">
         {renderContent()}
        </div>
      </div>
    </main>
  );
}
