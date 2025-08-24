"use client";

import { useState, useEffect } from 'react';
import { getPersonalizedAdvice, type PersonalizedAdviceInput } from '@/ai/flows/personalized-advice';
import { getMockWeatherData, type WeatherData } from '@/lib/weather-mock';
import { WeatherDisplay } from '@/components/weather/WeatherDisplay';
import { ForecastDisplay } from '@/components/weather/ForecastDisplay';
import { AdviceDisplay } from '@/components/weather/AdviceDisplay';
import { WeatherSkeleton } from '@/components/weather/WeatherSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, MapPin } from 'lucide-react';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd use lat/lon to fetch real data.
          // Here we just trigger the mock data fetch.
          fetchWeatherData();
        },
        () => {
          setError("Location access denied. Please enable it in your browser settings to see weather for your location.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Please use a different browser or enable it.");
      setLoading(false);
    }
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const data = await getMockWeatherData();
      setWeatherData(data);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again later.");
      console.error(err);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchAdvice = async () => {
      if (weatherData?.currentWeather) {
        try {
          const adviceInput: PersonalizedAdviceInput = {
            temperature: weatherData.currentWeather.temperature,
            humidity: weatherData.currentWeather.humidity,
            windSpeed: weatherData.currentWeather.windSpeed,
            weatherDescription: weatherData.currentWeather.weatherDescription,
          };
          const result = await getPersonalizedAdvice(adviceInput);
          setAdvice(result.advice);
        } catch (err) {
          console.error("Failed to fetch personalized advice:", err);
          // Don't set a user-facing error, just log it. The app is still usable.
          setAdvice("Could not load AI advice at the moment, but here is your weather!");
        } finally {
          setLoading(false);
        }
      }
    };

    if (weatherData) {
      fetchAdvice();
    }
  }, [weatherData]);

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
          <AdviceDisplay advice={advice} />
          <ForecastDisplay data={weatherData.forecast} />
        </div>
      );
    }
    return (
        <div className="flex flex-col items-center justify-center text-center p-10 border-dashed border-2 rounded-lg">
            <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2 font-headline">Waiting for your location...</h2>
            <p className="text-muted-foreground max-w-sm">Please allow location access in your browser to get your local weather forecast.</p>
        </div>
    );
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-5xl font-bold font-headline text-primary-foreground tracking-tight" style={{color: "hsl(var(--primary))"}}>WeatherWise</h1>
          <p className="text-muted-foreground mt-2">Your personal weather companion powered by AI</p>
        </header>
        
        <div className="mt-8">
         {renderContent()}
        </div>
      </div>
    </main>
  );
}
