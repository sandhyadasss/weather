"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { type SuggestPlacesOutput } from '@/ai/flows/suggest-places';
import { Compass } from 'lucide-react';

interface PlacesDisplayProps {
  places: SuggestPlacesOutput | null;
}

export function PlacesDisplay({ places }: PlacesDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <Compass className="h-6 w-6 text-primary" />
          Places to Visit
        </CardTitle>
        <CardDescription>AI-powered suggestions for your trip.</CardDescription>
      </CardHeader>
      <CardContent>
        {places ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {places.places.map((place, index) => (
              <div key={index} className="p-4 rounded-lg border bg-background hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-1">{place.name}</h3>
                <p className="text-sm text-muted-foreground">{place.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
