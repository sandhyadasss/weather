"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/weather/icons';
import type { TravelSuggestionOutput } from '@/ai/flows/travel-suggestion';
import { cn } from '@/lib/utils';

interface TravelSuggestionDisplayProps {
  suggestion: TravelSuggestionOutput | null;
}

const safetyConfig = {
    Safe: {
        icon: Icons.safe,
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        hover: "hover:border-green-500/40",
    },
    Caution: {
        icon: Icons.caution,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        hover: "hover:border-yellow-500/40",
    },
    Dangerous: {
        icon: Icons.dangerous,
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        hover: "hover:border-red-500/40",
    },
};

export function TravelSuggestionDisplay({ suggestion }: TravelSuggestionDisplayProps) {
  const config = suggestion ? safetyConfig[suggestion.safetyLevel] : safetyConfig.Caution;

  return (
    <Card className={cn("transition-all h-full", config.bg, config.border, config.hover)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-lg">
           {React.createElement(config.icon, { className: cn("h-6 w-6", config.color) })}
          Travel Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent>
        {suggestion ? (
          <p className={cn("text-lg", config.color.replace('text-', 'text-'))}>{suggestion.suggestion}</p>
        ) : (
          <Skeleton className="h-5 w-3/4" />
        )}
      </CardContent>
    </Card>
  );
}
