'use client';

import React, { useEffect } from 'react';
import { Polygon as LeafletPolygon, Tooltip } from 'react-leaflet';
import { useStore } from '../../store/useStore';
import { fetchWeatherData, getPolygonCentroid, getDateRange } from '../../utils/api';
import { applyColorRules } from '../../utils/colorUtils';
import { LatLng } from '../../types';

// Convert timeline hour index to actual date (shared with TimelineSlider)
const getDateFromHourIndex = (hourIndex: number): Date => {
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 15); // Start 15 days ago
  baseDate.setHours(0, 0, 0, 0); // Start at midnight

  // Add hours to get the exact time
  const resultDate = new Date(baseDate);
  resultDate.setHours(resultDate.getHours() + hourIndex);

  return resultDate;
};

// Rough temperature estimation based on latitude (for fallback)
const estimateTemperatureByLocation = (coords: LatLng): number => {
  const { lat } = coords;

  // Very rough estimation based on latitude
  if (lat > 60) return 5;   // Arctic regions
  if (lat > 45) return 15;  // Northern temperate
  if (lat > 30) return 25;  // Subtropical
  if (lat > 0) return 30;   // Tropical
  if (lat > -30) return 25; // Southern subtropical
  if (lat > -45) return 15; // Southern temperate
  return 5;                 // Antarctic regions
};

const PolygonLayer: React.FC = () => {
  const { polygons, dataSources, timeline, updatePolygon, renamePolygon } = useStore();

  const handlePolygonDoubleClick = (polygonId: string, currentName?: string) => {
    const newName = prompt('Enter new name for this area:', currentName || `Area ${polygonId.slice(-4)}`);
    if (newName && newName.trim()) {
      renamePolygon(polygonId, newName.trim());
    }
  };

  useEffect(() => {
    const updatePolygonColors = async () => {
      const { start, end } = getDateRange();

      for (const polygon of polygons) {
        try {
          const centroid = getPolygonCentroid(polygon.points);
          const weatherData = await fetchWeatherData(centroid, start, end);

          const dataSource = dataSources.find(ds => ds.id === polygon.dataSource);
          if (!dataSource || !weatherData.hourly?.temperature_2m) {
            continue;
          }

          // Get selected hour from timeline
          const selectedHourIndex = timeline.mode === 'single'
            ? timeline.selectedHour
            : Math.floor(((timeline.selectedRange?.[0] || 0) + (timeline.selectedRange?.[1] || 0)) / 2);

          // Map timeline to data index
          // Timeline: 0-719 (30 days * 24 hours)
          // Data: available for last 29 days (archive API limitation)
          const temperatures = weatherData.hourly.temperature_2m;

          // Ensure we don't exceed available data
          let dataIndex = Math.min(selectedHourIndex, temperatures.length - 1);
          dataIndex = Math.max(0, dataIndex); // Ensure non-negative

          let temperature = temperatures[dataIndex];



          if (temperature !== undefined && temperature !== null && !isNaN(temperature)) {
            const color = applyColorRules(temperature, dataSource.colorRules);

            // Always use timeline-based timestamp for consistency
            const timelineDate = getDateFromHourIndex(selectedHourIndex);
            const validTimestamp = timelineDate.toISOString();

            updatePolygon(polygon.id, {
              color,
              data: {
                temperature,
                timestamp: validTimestamp
              }
            });
          } else {
            // Use fallback temperature estimation
            const estimatedTemp = estimateTemperatureByLocation(centroid);
            const color = applyColorRules(estimatedTemp, dataSource.colorRules);

            // Calculate timestamp from timeline selection
            const timelineDate = getDateFromHourIndex(selectedHourIndex);

            updatePolygon(polygon.id, {
              color,
              data: {
                temperature: estimatedTemp,
                timestamp: timelineDate.toISOString()
              }
            });
          }
        } catch (error) {
          // Set fallback color for failed API calls with valid timestamp
          const fallbackDate = getDateFromHourIndex(timeline.selectedHour);

          updatePolygon(polygon.id, {
            color: '#d9d9d9', // Gray for no data
            data: {
              temperature: null,
              timestamp: fallbackDate.toISOString()
            }
          });
        }
      }
    };

    if (polygons.length > 0) {
      updatePolygonColors();
    }
  }, [polygons.length, timeline, dataSources, updatePolygon]);

  return (
    <>
      {polygons.map((polygon) => (
        <LeafletPolygon
          key={polygon.id}
          positions={polygon.points.map(p => [p.lat, p.lng])}
          pathOptions={{
            color: polygon.color || '#1890ff',
            fillColor: polygon.color || '#1890ff',
            fillOpacity: 0.6,
            weight: 2,
          }}
          eventHandlers={{
            dblclick: () => handlePolygonDoubleClick(polygon.id, polygon.name),
          }}
        >
          <Tooltip>
            <div style={{ minWidth: '200px' }}>
              <div style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: '8px', marginBottom: '8px' }}>
                <strong style={{ fontSize: '14px', color: '#1890ff' }}>
                  {polygon.name || `Area ${polygon.id.slice(-4)}`}
                </strong>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                  ID: {polygon.id.slice(-8)}
                </div>
              </div>

              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#333' }}>
                  Data Source: {dataSources.find(ds => ds.id === polygon.dataSource)?.name}
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>
                  Points: {polygon.points.length} vertices
                </div>
              </div>

              {polygon.data && (
                <>
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '8px', marginBottom: '8px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>
                      Temperature Data
                    </div>
                    <div style={{ fontSize: '12px', color: '#333', marginTop: '4px' }}>
                      Current: {polygon.data.temperature !== null ? `${polygon.data.temperature.toFixed(1)}°C` : 'No data'}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#333', marginBottom: '4px' }}>
                      Timeline Information
                    </div>
                    {timeline.mode === 'range' && timeline.selectedRange ? (
                      <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>
                        Range: {getDateFromHourIndex(timeline.selectedRange[0]).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })} - {getDateFromHourIndex(timeline.selectedRange[1]).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                        })}
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                          Selected Time: {polygon.data.timestamp ? new Date(polygon.data.timestamp).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          }) : 'Unknown'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                          Local Time: {polygon.data.timestamp ? new Date(polygon.data.timestamp).toLocaleDateString('en-GB', {
                            timeZone: 'America/New_York',
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          }) : 'Unknown'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                          UTC Time: {polygon.data.timestamp ? new Date(polygon.data.timestamp).toLocaleDateString('en-GB', {
                            timeZone: 'UTC',
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          }) : 'Unknown'}
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '8px', marginTop: '8px' }}>
                    <div style={{ fontSize: '11px', color: '#888' }}>
                      Click polygon to select • Double-click to rename
                    </div>
                  </div>
                </>
              )}
            </div>
          </Tooltip>
        </LeafletPolygon>
      ))}
    </>
  );
};

export default PolygonLayer;