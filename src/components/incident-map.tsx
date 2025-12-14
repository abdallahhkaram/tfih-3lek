"use client";

import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { User } from "lucide-react";
import type { MapMouseEvent } from "@vis.gl/react-google-maps";

interface IncidentMapProps {
  center: { lat: number; lng: number };
  userLocation: { lat: number; lng: number };
  onMapClick: (e: MapMouseEvent) => void;
}

export function IncidentMap({
  center,
  userLocation,
  onMapClick,
}: IncidentMapProps) {
  return (
    <Map
      mapId="tfih-3lek-map"
      defaultCenter={center}
      defaultZoom={15}
      disableDefaultUI={false}
      onClick={onMapClick}
      className="w-full h-full"
    >
      <AdvancedMarker position={userLocation}>
        <div className="p-2 bg-primary rounded-full shadow-lg">
          <User className="h-5 w-5 text-primary-foreground" />
        </div>
      </AdvancedMarker>
    </Map>
  );
}
