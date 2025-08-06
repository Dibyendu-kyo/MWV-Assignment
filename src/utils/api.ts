import axios from 'axios';
import { WeatherData, LatLng } from '../types';

const API_BASE = 'https://archive-api.open-meteo.com/v1/archive';

// Cache for API responses
const cache = new Map<string, WeatherData>();

export const fetchWeatherData = async (
  coordinates: LatLng,
  startDate: string,
  endDate: string
): Promise<WeatherData> => {
  const cacheKey = `${coordinates.lat},${coordinates.lng},${startDate},${endDate}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    const response = await axios.get(API_BASE, {
      params: {
        latitude: coordinates.lat.toFixed(4),
        longitude: coordinates.lng.toFixed(4),
        start_date: startDate,
        end_date: endDate,
        hourly: 'temperature_2m',
        timezone: 'UTC',
      },
    });

    const data = response.data as WeatherData;
    
    if (!data.hourly?.temperature_2m || data.hourly.temperature_2m.length === 0) {
      throw new Error('No temperature data in API response');
    }
    
    cache.set(cacheKey, data);
    return data;
  } catch (error) {
    throw new Error('Failed to fetch weather data from API');
  }
};

export const getPolygonCentroid = (points: LatLng[]): LatLng => {
  const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
  const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length;
  return { lat, lng };
};

export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDateRange = (): { start: string; end: string } => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 30); // 30 days before today (archive data available)
  
  const end = new Date(now);
  end.setDate(now.getDate() - 1); // Yesterday (archive API has 1-day delay)
  
  return {
    start: formatDateForAPI(start),
    end: formatDateForAPI(end),
  };
};