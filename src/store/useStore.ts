import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Polygon, DataSource, TimelineState, LatLng } from '../types';

interface StoreActions {
  addPolygon: (polygon: Polygon) => void;
  removePolygon: (id: string) => void;
  updatePolygon: (id: string, updates: Partial<Polygon>) => void;
  renamePolygon: (id: string, name: string) => void;
  setTimeline: (timeline: Partial<TimelineState>) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setSelectedDataSource: (dataSource: string) => void;
  updateDataSource: (id: string, updates: Partial<DataSource>) => void;
  setMapCenter: (center: LatLng) => void;
  setMapZoom: (zoom: number) => void;
}

const defaultDataSources: DataSource[] = [
  {
    id: 'temperature',
    name: 'Temperature (°C)',
    field: 'temperature_2m',
    colorRules: [
      { operator: '<', value: 10, color: '#f5222d' },  // < 10 → Red
      { operator: '>=', value: 10, color: '#1890ff' }, // ≥ 10 and < 25 → Blue  
      { operator: '>=', value: 25, color: '#52c41a' }, // ≥ 25 → Green
    ],
  },
];

const initialState: AppState = {
  polygons: [],
  dataSources: defaultDataSources,
  timeline: {
    selectedHour: 15 * 24 + new Date().getHours(), // Current time: 15 days offset + current hour
    mode: 'single',
  },
  isDrawing: false,
  selectedDataSource: 'temperature',
  mapCenter: { lat: 52.52, lng: 13.41 }, // Berlin (as per requirements example)
  mapZoom: 10,
};

export const useStore = create<AppState & StoreActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addPolygon: (polygon) =>
        set((state) => ({
          polygons: [...state.polygons, polygon],
        })),

      removePolygon: (id) =>
        set((state) => ({
          polygons: state.polygons.filter((p) => p.id !== id),
        })),

      updatePolygon: (id, updates) =>
        set((state) => ({
          polygons: state.polygons.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      renamePolygon: (id, name) =>
        set((state) => ({
          polygons: state.polygons.map((p) =>
            p.id === id ? { ...p, name } : p
          ),
        })),

      setTimeline: (timeline) =>
        set((state) => ({
          timeline: { ...state.timeline, ...timeline },
        })),

      setIsDrawing: (isDrawing) => set({ isDrawing }),

      setSelectedDataSource: (selectedDataSource) => set({ selectedDataSource }),

      updateDataSource: (id, updates) =>
        set((state) => ({
          dataSources: state.dataSources.map((ds) =>
            ds.id === id ? { ...ds, ...updates } : ds
          ),
        })),

      setMapCenter: (mapCenter) => set({ mapCenter }),

      setMapZoom: (mapZoom) => set({ mapZoom }),
    }),
    {
      name: 'geo-dashboard-storage',
      partialize: (state) => ({
        polygons: state.polygons,
        dataSources: state.dataSources,
        timeline: state.timeline,
        selectedDataSource: state.selectedDataSource,
        mapCenter: state.mapCenter,
        mapZoom: state.mapZoom,
      }),
    }
  )
);