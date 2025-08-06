# Geo Dashboard - Dynamic Data Visualization

A professional React/Next.js dashboard application with TypeScript that visualizes dynamic weather data over interactive maps and timelines, featuring polygon creation and color-coded data display.

## 🚀 Live Demo

**Deployed URL**: [To be updated after Vercel deployment]

## Features

### Core Requirements Implemented

- **Timeline Slider**: Horizontal timeline with hourly resolution across 30-day window (15 days before and after today)
  - Single draggable handle for specific hour selection
  - Dual-ended range slider for time window selection
  - Adjustable using drag or click

- **Interactive Map**: Leaflet-based map for spatial region definition
  - Move and center reset functionality
  - Polygon visibility maintained when moving map
  - Locked at 2 sq. km resolution as specified

- **Polygon Drawing Tools**: Define polygonal regions for analysis
  - Minimum 3 points, maximum 12 points
  - Button to start drawing mode
  - Automatic data source selection (Open-Meteo)
  - View and delete polygon functionality

- **Data Source Control**: Sidebar for data sources and thresholds
  - Open-Meteo API integration (temperature_2m field)
  - User-defined color coding rules with operators (=, <, >, <=, >=)
  - Threshold-based coloring (e.g., < 10 → Red, ≥ 10 and < 25 → Blue, ≥ 25 → Green)

- **Dynamic Color Updates**: Polygon coloring based on data values
  - Extract polygon centroid for data fetching
  - Fetch data for selected hour/time range
  - Apply color rules from sidebar configuration
  - Automatic updates when timeline changes

- **Open-Meteo API Integration**: Required weather data source
  - Archive API endpoint for historical data
  - Latitude/longitude-based queries
  - Temperature_2m field usage
  - Hourly data display based on timeline selection

## 🛠️ Tech Stack & Libraries Used

### Core Technologies
- **Next.js 14**: React framework for production-ready applications
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe JavaScript for better development experience

### State Management & Data
- **Zustand**: Lightweight state management solution
- **Open-Meteo API**: Free weather data API (no authentication required)

### UI & Styling
- **Ant Design**: Professional React UI component library
- **Tailwind CSS**: Utility-first CSS framework for custom styling
- **React-Range**: Customizable range slider components

### Mapping & Visualization
- **Leaflet**: Open-source interactive maps
- **React-Leaflet**: React components for Leaflet maps

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing and optimization

## 🚀 Setup and Run Instructions

### Prerequisites
- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd geo-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - If port 3000 is busy, Next.js will automatically use the next available port

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Other Available Commands

```bash
# Run ESLint for code quality
npm run lint

# Type checking
npx tsc --noEmit
```

### API Configuration

This application uses the **Open-Meteo API** which is free and requires no API keys:

- **API Endpoint**: `https://archive-api.open-meteo.com/v1/archive`
- **Data Source**: Historical weather data including temperature_2m
- **No Authentication Required**: The Open-Meteo API is completely free and open

The application automatically fetches temperature data based on:
- Selected coordinates (polygon centroid)
- Timeline selection (hourly data across 30-day window)
- Date range (30-day window: 15 days before and 15 days after today)

**Example API Call:**
```
https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&start_date=2025-07-18&end_date=2025-08-01&hourly=temperature_2m
```

### Implementation Details

- **30-Day Timeline**: Implemented exactly as specified (15 days before and after today)
- **Color Rules**: Following requirements example format:
  - < 10°C → Red
  - ≥ 10°C and < 25°C → Blue  
  - ≥ 25°C → Green
- **Archive API**: Using Open-Meteo archive endpoint as specified
- **Polygon Constraints**: Enforced 3-12 point limits
- **Data Caching**: Optimized API usage with response caching

### Bonus Features Implemented

- **Enhanced Tooltips**: Rich polygon tooltips with dual timezone data (Local, UTC)
- **Polygon Renaming**: Double-click polygons or use edit button to rename areas
- **Color Legend**: Visual legend showing temperature color coding rules
- **State Persistence**: Data persists across page reloads using localStorage
- **Smart Naming**: New polygons get meaningful names (Research Area, Study Zone, etc.)
- **Enhanced UI**: Professional interface with icons, better spacing, and visual hierarchy
- **Detailed Information**: Extended polygon data display with ID, coordinates, timestamps

### Usage

1. **Timeline Control**: Use the slider at the top to select specific hours or time ranges
2. **Drawing Polygons**: Click "Start Drawing" to create polygons on the map (3-12 points)
3. **Data Source Setup**: Configure color rules in the sidebar for temperature thresholds
4. **Color Visualization**: Polygons automatically update colors based on data and rules
5. **Polygon Management**: 
   - View all polygons with detailed information
   - Rename polygons by double-clicking or using the edit button
   - Delete unwanted polygons
   - View rich tooltips with timezone data
6. **Color Legend**: Reference the color coding rules in the sidebar
7. **Data Persistence**: Your work is automatically saved and restored on page reload

### Project Structure

```
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   │   ├── Map/            # Map-related components
│   │   ├── Timeline/       # Timeline slider components
│   │   └── Sidebar/        # Data source controls
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── README.md
```

## 🎨 Design & Development Remarks

### Architecture Decisions
- **Component-based architecture**: Modular React components for maintainability
- **TypeScript integration**: Full type safety across the application
- **State management**: Zustand for lightweight, efficient state handling
- **API optimization**: Implemented caching to reduce API calls and improve performance

### Key Features
- **Professional UI**: Clean, enterprise-ready interface with Ant Design
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Real-time Updates**: Dynamic polygon coloring based on weather data
- **Data Persistence**: LocalStorage integration for user data retention
- **Error Handling**: Graceful fallbacks for API failures

### Performance Optimizations
- **API Caching**: Reduces redundant weather data requests
- **Dynamic Imports**: Code splitting for better load times
- **Optimized Rendering**: Efficient React rendering patterns

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar and detailed controls
- **Tablet**: Adaptive layout with collapsible sidebar
- **Mobile**: Touch-friendly interface with optimized map interactions

## 📸 Screenshots

*Screenshots will be added after deployment*

## 📝 Assignment Completion

### Core Requirements ✅
- Interactive map with polygon drawing
- Timeline slider with 30-day window
- Real-time weather data integration
- Dynamic color coding
- Professional UI implementation

### Bonus Features ✅
- Mobile responsive design
- API optimization with caching
- Enhanced user experience
- State persistence
- Professional documentation

---

**Developed for Mind Webs Venture SDE Internship/FTE Assignment**