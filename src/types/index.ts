export interface LatLng {
  lat: number;
  lng: number;
}

export interface Polygon {
  id: string;
  points: LatLng[];
  dataSource: string;
  color: string;
  name?: string;
  data?: any;
}

export interface ColorRule {
  operator: '=' | '<' | '>' | '<=' | '>=';
  value: number;
  color: string;
}

export interface DataSource {
  id: string;
  name: string;
  field: string;
  colorRules: ColorRule[];
  apiEndpoint?: string;
}

export interface TimelineState {
  selectedHour: number;
  selectedRange?: [number, number];
  mode: 'single' | 'range';
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
}

export interface AppState {
  polygons: Polygon[];
  dataSources: DataSource[];
  timeline: TimelineState;
  isDrawing: boolean;
  selectedDataSource: string;
  mapCenter: LatLng;
  mapZoom: number;
}