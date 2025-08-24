"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/weather/icons';

interface AdviceDisplayProps {
  advice: string | null;
}

export function AdviceDisplay({ advice }: AdviceDisplayProps) {
  return (
    <Card className="bg-accent/10 border-accent/20 transition-all hover:border-accent/40 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-lg">
          <Icons.advice className="h-6 w-6 text-accent" />
          Personalized Advice
        </CardTitle>
      </CardHeader>
      <CardContent>
        {advice ? (
          <p className="text-lg text-accent-foreground/90">{advice}</p>
        ) : (
          <Skeleton className="h-5 w-3/4" />
        )}
      </CardContent>
    </Card>
  );
}
