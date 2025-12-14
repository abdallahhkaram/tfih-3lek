
'use client';

import { useMemo, useState, useEffect } from 'react';
import type { Incident } from '@/lib/types';
import { useStore } from '@/lib/store';
import { AppHeader } from '@/components/header';
import { IncidentSheet } from '@/components/incident-sheet';
import { IncidentMap } from '@/components/incident-map';
import { APIProvider, useApiIsLoaded } from '@vis.gl/react-google-maps';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

function MainApp() {
  const {
    incidents,
    openReportSheet,
    openDetailsSheet,
    setNewIncidentLocation,
  } = useStore((state) => ({
    incidents: state.incidents,
    openReportSheet: state.openReportSheet,
    openDetailsSheet: state.openDetailsSheet,
    setNewIncidentLocation: state.setNewIncidentLocation,
  }));

  const apiIsLoaded = useApiIsLoaded();
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          toast({
            variant: 'destructive',
            title: 'Location Access Denied',
            description: 'Please enable location services to see your position on the map.',
          });
          // Fallback to default location
          setUserLocation({ lat: 34.0522, lng: -118.2437 });
        }
      );
    } else {
        // Fallback for old browsers
        setUserLocation({ lat: 34.0522, lng: -118.2437 });
    }
  }, [toast]);


  const handleMapClick = (e: { lat: number; lng: number }) => {
    if ( e) {
      setNewIncidentLocation({ lat: e.lat, lng: e.lng });
    }
  };
  
  return (
    <div className="flex flex-col h-screen w-screen bg-background">
      <AppHeader onReportClick={openReportSheet} />
      <main className="flex-1 relative">
        {(!apiIsLoaded || !userLocation) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Spinner className="w-8 h-8" />
          </div>
        )}
        {apiIsLoaded && userLocation && (
          <IncidentMap
            center={userLocation}
            userLocation={userLocation}
            onMapClick={handleMapClick}
          />
        )}
      </main>
      <IncidentSheet />
    </div>
  );
}

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Google Maps API Key Missing</AlertTitle>
          <AlertDescription>
            Please add your Google Maps API key to a 
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold mx-1">.env.local</code> 
            file to enable map functionality.
            <p className="mt-2">
              <code className="text-sm">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY</code>
            </p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['visualization']}>
      <MainApp />
    </APIProvider>
  );
}
