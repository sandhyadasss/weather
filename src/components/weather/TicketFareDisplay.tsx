
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plane, Train } from 'lucide-react';
import { type GetTicketFaresOutput } from '@/ai/flows/get-ticket-fares';

interface TicketFareDisplayProps {
  fares: GetTicketFaresOutput | null;
  currency: string;
  loading: boolean;
}

const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    JPY: '¥',
    INR: '₹',
};


export function TicketFareDisplay({ fares, currency, loading }: TicketFareDisplayProps) {
    const symbol = currencySymbols[currency] || currency;
    const renderContent = () => {
        if (loading) {
            return (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
              </div>
            )
        }
        if (fares) {
            return (
                <>
                <div className="flex items-center gap-4">
                  <Plane className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Flight (est.)</p>
                    <p className="text-xl font-bold">{symbol}{fares.flightFare.toLocaleString()}</p>
                  </div>
                </div>
                {fares.trainFare > 0 && (
                    <div className="flex items-center gap-4">
                        <Train className="h-6 w-6 text-primary" />
                        <div>
                            <p className="text-sm text-muted-foreground">Train (est.)</p>
                            <p className="text-xl font-bold">{symbol}{fares.trainFare.toLocaleString()}</p>
                        </div>
                    </div>
                )}
              </>
            )
        }
        return (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          );
    }
  return (
    <Card className="bg-background/50 transition-all hover:border-primary/40 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-lg">
          Ticket Fares
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
