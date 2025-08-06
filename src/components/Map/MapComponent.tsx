'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { LatLng } from '../../types';
import PolygonLayer from './PolygonLayer';
import DrawingHandler from './DrawingHandler';

// Dynamic imports for SSR safety
let MapContainer: any, TileLayer: any, useMapEvents: any, L: any;

const MapComponent: React.FC = () => {
  const { mapCenter, mapZoom, setMapCenter, setMapZoom } = useStore();
  const mapRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadMap = async () => {
      try {
        // Dynamic imports
        const leaflet = await import('leaflet');
        const reactLeaflet = await import('react-leaflet');
        
        L = leaflet.default;
        MapContainer = reactLeaflet.MapContainer;
        TileLayer = reactLeaflet.TileLayer;
        useMapEvents = reactLeaflet.useMapEvents;

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to load map:', error);
      }
    };

    if (typeof window !== 'undefined') {
      loadMap();
    }
  }, []);

  const MapEvents: React.FC = () => {
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

  if (!isLoaded) {
    return (
      <div className="map-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>🗺️</div>
          <div style={{ fontSize: '16px', color: '#666' }}>Loading interactive map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
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