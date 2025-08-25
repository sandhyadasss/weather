
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { type GetHotelSuggestionsOutput } from '@/ai/flows/get-hotel-suggestions';
import { Hotel } from 'lucide-react';

interface HotelDisplayProps {
  hotels: GetHotelSuggestionsOutput | null;
  currency: string;
}

const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    JPY: '¥',
    INR: '₹',
};

export function HotelDisplay({ hotels, currency }: HotelDisplayProps) {
  const symbol = currencySymbols[currency] || currency;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <Hotel className="h-6 w-6 text-primary" />
          Hotel Suggestions
        </CardTitle>
        <CardDescription>Estimated prices per night.</CardDescription>
      </CardHeader>
      <CardContent>
        {hotels ? (
          hotels.hotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hotels.hotels.map((hotel, index) => (
                <div key={index} className="p-4 rounded-lg border bg-background hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg mb-1">{hotel.name}</h3>
                    <p className="font-semibold text-primary">{symbol}{hotel.price.toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{hotel.description}</p>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center text-muted-foreground py-4">
                <p>No hotel suggestions available at the moment.</p>
              </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
