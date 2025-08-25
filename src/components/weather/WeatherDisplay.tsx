
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Icons, WeatherIcon } from '@/components/weather/icons';

interface CurrentWeatherProps {
  city: string;
  data: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    weatherDescription: string;
  };
}

export function WeatherDisplay({ city, data }: CurrentWeatherProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-headline">
          <Icons.location className="h-7 w-7 text-primary" />
          Weather at Destination
        </CardTitle>
        <CardDescription>{city}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col col-span-1 lg:col-span-1 items-center justify-center space-y-2 bg-gradient-to-br from-primary/20 to-primary/5 p-6 rounded-lg border">
          <WeatherIcon description={data.weatherDescription} className="h-20 w-20 text-accent" />
          <p className="text-xl font-bold">{data.weatherDescription}</p>
        </div>
        
        <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-background border">
              <Icons.temperature className="h-10 w-10 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-3xl font-bold">{data.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-background border">
              <Icons.humidity className="h-10 w-10 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-3xl font-bold">{data.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 p-4 rounded-lg bg-background border">
              <Icons.wind className="h-10 w-10 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Wind Speed</p>
                <p className="text-3xl font-bold">{data.windSpeed} km/h</p>
              </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
