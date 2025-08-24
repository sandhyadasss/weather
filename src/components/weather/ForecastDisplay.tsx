"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from '@/components/weather/icons';

interface ForecastProps {
  data: {
    day: string;
    high: number;
    low: number;
    weatherDescription: string;
  }[];
}

export function ForecastDisplay({ data }: ForecastProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 text-center">
          {data.map((day, index) => (
            <div key={index} className="flex flex-col items-center p-3 rounded-lg bg-background border space-y-2 transition-all hover:shadow-md hover:border-primary/50">
              <p className="font-bold text-lg">{day.day}</p>
              <WeatherIcon description={day.weatherDescription} className="h-10 w-10 text-accent" />
              <div className='w-full'>
                <p className="font-semibold text-lg">{day.high}°</p>
                <p className="text-sm text-muted-foreground">{day.low}°</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
