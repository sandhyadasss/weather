"use client";

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function WeatherSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center justify-center space-y-2 p-6 rounded-lg border">
                 <Skeleton className="h-20 w-20 rounded-full" />
                 <Skeleton className="h-6 w-32" />
            </div>
            <div className="col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-6 w-full" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-6 w-full" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-6 w-full" />
            </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
           <Skeleton className="h-8 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
           <Skeleton className="h-8 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center space-y-2 p-3 border rounded-lg">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
