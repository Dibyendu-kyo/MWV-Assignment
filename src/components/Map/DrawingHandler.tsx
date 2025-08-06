'use client';

import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useStore } from '../../store/useStore';
import { LatLng, Polygon } from '../../types';

const DrawingHandler: React.FC = () => {
  const map = useMap();
  const { isDrawing, selectedDataSource, addPolygon, setIsDrawing, polygons } = useStore();
  const drawingPointsRef = useRef<LatLng[]>([]);
  const tempMarkersRef = useRef<L.Marker[]>([]);
  const tempLinesRef = useRef<L.Polyline[]>([]);

  useEffect(() => {
    if (!isDrawing) {
      // Clear temporary drawing elements
      tempMarkersRef.current.forEach(marker => map.removeLayer(marker));
      tempLinesRef.current.forEach(line => map.removeLayer(line));
      tempMarkersRef.current = [];
      tempLinesRef.current = [];
      drawingPointsRef.current = [];
      return;
    }

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const point: LatLng = { lat: e.latlng.lat, lng: e.latlng.lng };
      drawingPointsRef.current.push(point);

      // Add marker for the point
      const marker = L.marker([point.lat, point.lng], {
        icon: L.divIcon({
          className: 'drawing-point',
          html: `<div style="background: #1890ff; width: 8px; height: 8px; border-radius: 50%; border: 2px solid white;"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
      }).addTo(map);
      tempMarkersRef.current.push(marker);

      // Draw line to previous point
      if (drawingPointsRef.current.length > 1) {
        const prevPoint = drawingPointsRef.current[drawingPointsRef.current.length - 2];
        const line = L.polyline([
          [prevPoint.lat, prevPoint.lng],
          [point.lat, point.lng]
        ], {
          color: '#1890ff',
          weight: 2,
          dashArray: '5, 5',
        }).addTo(map);
        tempLinesRef.current.push(line);
      }

      // Complete polygon on double-click or when reaching max points
      if (drawingPointsRef.current.length >= 3) {
        // Add completion hint
        const completionMarker = L.marker([point.lat, point.lng], {
          icon: L.divIcon({
            className: 'completion-hint',
            html: `<div style="background: #52c41a; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; white-space: nowrap;">Double-click to finish (${drawingPointsRef.current.length}/12)</div>`,
            iconSize: [100, 20],
            iconAnchor: [50, -10],
          }),
        }).addTo(map);
        
        setTimeout(() => {
          if (map.hasLayer(completionMarker)) {
            map.removeLayer(completionMarker);
          }
        }, 2000);
      }

      if (drawingPointsRef.current.length >= 12) {
        completePolygon();
      }
    };

    const handleDoubleClick = (e: L.LeafletMouseEvent) => {
      e.originalEvent.preventDefault();
      if (drawingPointsRef.current.length >= 3) {
        completePolygon();
      }
    };

    const completePolygon = () => {
      if (drawingPointsRef.current.length >= 3) {
        const polygonCount = polygons.length + 1;
        const areaNames = [
          'Research Area', 'Study Zone', 'Analysis Region', 'Data Point', 'Survey Area',
          'Monitoring Zone', 'Sample Region', 'Observation Area', 'Test Site', 'Field Area'
        ];
        const randomName = areaNames[Math.floor(Math.random() * areaNames.length)];
        
        const newPolygon: Polygon = {
          id: Date.now().toString(),
          points: [...drawingPointsRef.current],
          dataSource: selectedDataSource,
          color: '#d9d9d9', // Default gray until data is loaded
          name: `${randomName} ${polygonCount}`,
        };

        addPolygon(newPolygon);
        setIsDrawing(false);
      }
    };

    map.on('click', handleMapClick);
    map.on('dblclick', handleDoubleClick);

    return () => {
      map.off('click', handleMapClick);
      map.off('dblclick', handleDoubleClick);
    };
  }, [isDrawing, map, selectedDataSource, addPolygon, setIsDrawing, polygons]);

  return null;
};

export default DrawingHandler;