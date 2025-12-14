
'use client';

import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { User } from 'lucide-react';

interface IncidentMapProps {
  center: { lat: number; lng: number };
  userLocation: { lat: number; lng: number };
  onMapClick: (e: {lat:number,lng:number}) => void;
}


export function IncidentMap({ center, userLocation, onMapClick }: IncidentMapProps) {
  return (
    <Map
      mapId="safespot-map"
      defaultCenter={center}
      zoom={15}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      onClick={(e) => e.detail.latLng && onMapClick(e.detail.latLng)}
      className="w-full h-full"
      styles={[
        {
          "featureType": "poi",
          "elementType": "labels.icon",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [{ "visibility": "off" }]
        },
        {
          "featureType": "transit",
          "stylers": [{ "visibility": "off" }]
        }
      ]}
    >
      <AdvancedMarker position={userLocation}>
        <div className="p-2 bg-primary rounded-full shadow-lg">
          <User className="h-5 w-5 text-primary-foreground" />
        </div>
      </AdvancedMarker>
    </Map>
  );
}
