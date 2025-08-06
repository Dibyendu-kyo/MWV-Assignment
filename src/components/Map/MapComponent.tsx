'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useStore } from '../../store/useStore';
import { LatLng } from '../../types';
import PolygonLayer from './PolygonLayer';
import DrawingHandler from './DrawingHandler';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapEvents: React.FC = () => {
  const { setMapCenter, setMapZoom } = useStore();
  
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      setMapCenter({ lat: center.lat, lng: center.lng });
    },
    zoomend: () => {
      setMapZoom(map.getZoom());
    },
  });

  return null;
};

const MapComponent: React.FC = () => {
  const { mapCenter, mapZoom } = useStore();
  const mapRef = useRef<L.Map>(null);

  return (
    <div className="map-container">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={mapZoom}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        <PolygonLayer />
        <DrawingHandler />
      </MapContainer>
    </div>
  );
};

export default MapComponent;