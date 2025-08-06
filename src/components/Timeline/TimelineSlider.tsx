'use client';

import React from 'react';
import { Range } from 'react-range';
import { Button, Radio, Typography } from 'antd';
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { useStore } from '../../store/useStore';

const { Title, Text } = Typography;

const TimelineSlider: React.FC = () => {
  const { timeline, setTimeline } = useStore();

  // Convert timeline hour index to actual date/time
  const getDateFromHour = (hourIndex: number): Date => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 15); // Start 15 days ago
    baseDate.setHours(0, 0, 0, 0); // Start at midnight
    
    // Add hours to get the exact time
    const resultDate = new Date(baseDate);
    resultDate.setHours(resultDate.getHours() + hourIndex);
    
    return resultDate;
  };

  // Format hour index to readable string
  const formatHour = (hourIndex: number): string => {
    const date = getDateFromHour(hourIndex);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      hour12: true,
    });
  };

  const handleSingleChange = (values: number[]) => {
    setTimeline({ selectedHour: values[0] });
  };

  const handleRangeChange = (values: number[]) => {
    setTimeline({ selectedRange: [values[0], values[1]] });
  };

  const resetToNow = () => {
    // Calculate current hour index (15 days * 24 hours + current hour)
    const now = new Date();
    const currentHourIndex = 15 * 24 + now.getHours();
    
    if (timeline.mode === 'single') {
      setTimeline({ selectedHour: currentHourIndex, selectedRange: undefined });
    } else {
      // For range mode, set a 12-hour range around current time
      const rangeStart = Math.max(0, currentHourIndex - 6);
      const rangeEnd = Math.min(maxHours - 1, currentHourIndex + 6);
      setTimeline({ 
        selectedHour: currentHourIndex, 
        selectedRange: [rangeStart, rangeEnd] 
      });
    }
  };

  const setPresetTime = (dayOffset: number, hour: number) => {
    // Calculate hour index: (15 days base + day offset) * 24 + hour
    const hourIndex = (15 + dayOffset) * 24 + hour;
    
    if (timeline.mode === 'single') {
      setTimeline({ selectedHour: hourIndex, selectedRange: undefined });
    } else {
      // For range mode, set a 12-hour range around the preset time
      const rangeStart = Math.max(0, hourIndex - 6);
      const rangeEnd = Math.min(maxHours - 1, hourIndex + 6);
      setTimeline({ 
        selectedHour: hourIndex, 
        selectedRange: [rangeStart, rangeEnd] 
      });
    }
  };

  const maxHours = 30 * 24; // 30 days * 24 hours
  const currentHourIndex = 15 * 24 + new Date().getHours(); // Current time index

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <ClockCircleOutlined className="text-blue-600 text-lg" />
          </div>
          <div>
            <Title level={4} className="m-0 text-gray-900">Time Control</Title>
            <Text className="text-sm text-gray-500">Select time of day for weather data</Text>
          </div>
        </div>
        <Button 
          onClick={resetToNow} 
          type="primary" 
          ghost 
          icon={<ClockCircleOutlined />}
          className="border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          Reset to Now
        </Button>
      </div>

      <div className="mb-8">
        <div className="bg-gray-50 rounded-lg p-1 inline-flex">
          <Radio.Group
            value={timeline.mode}
            onChange={(e) => {
              const newMode = e.target.value;
              if (newMode === 'range' && !timeline.selectedRange) {
                // Initialize range mode with current hour ± 6 hours
                const rangeStart = Math.max(0, timeline.selectedHour - 6);
                const rangeEnd = Math.min(maxHours - 1, timeline.selectedHour + 6);
                setTimeline({ 
                  mode: newMode, 
                  selectedRange: [rangeStart, rangeEnd] 
                });
              } else if (newMode === 'single') {
                setTimeline({ mode: newMode, selectedRange: undefined });
              } else {
                setTimeline({ mode: newMode });
              }
            }}
            className="flex"
          >
            <Radio.Button value="single" className="border-none shadow-none">
              <span className="px-3 py-1">Specific Hour</span>
            </Radio.Button>
            <Radio.Button value="range" className="border-none shadow-none">
              <span className="px-3 py-1">Time Range</span>
            </Radio.Button>
          </Radio.Group>
        </div>
      </div>

      <div className="mb-6">
        {timeline.mode === 'single' ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <Text className="text-2xl font-semibold text-gray-900 block">
                  {formatHour(timeline.selectedHour)}
                </Text>
                <Text className="text-sm text-gray-500">
                  Selected time
                </Text>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="small" 
                  onClick={() => setPresetTime(-1, 6)}
                  className="border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                >
                  Yesterday 6AM
                </Button>
                <Button 
                  size="small" 
                  onClick={() => setPresetTime(0, 12)}
                  className="border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                >
                  Today 12PM
                </Button>
                <Button 
                  size="small" 
                  onClick={() => setPresetTime(1, 18)}
                  className="border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                >
                  Tomorrow 6PM
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Range
                step={1}
                min={0}
                max={maxHours - 1}
                values={[timeline.selectedHour]}
                onChange={handleSingleChange}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="w-full h-2 bg-gradient-to-r from-indigo-200 via-amber-200 via-orange-200 to-indigo-400 rounded-full shadow-inner"
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="w-6 h-6 bg-white rounded-full shadow-lg cursor-pointer border-2 border-blue-500 flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-3">
              <span>15 days ago</span>
              <span>Today</span>
              <span>15 days ahead</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <Text className="text-2xl font-semibold text-gray-900 block">
                Range: {formatHour(timeline.selectedRange?.[0] || currentHourIndex)} - {formatHour(timeline.selectedRange?.[1] || currentHourIndex + 12)}
              </Text>
              <Text className="text-sm text-gray-500">
                Selected time range
              </Text>
            </div>
            <div className="mt-4">
              <Range
                step={1}
                min={0}
                max={maxHours - 1}
                values={timeline.selectedRange || [currentHourIndex, currentHourIndex + 12]}
                onChange={handleRangeChange}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="w-full h-3 bg-gradient-to-r from-blue-200 via-yellow-200 to-blue-800 rounded-full"
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props, isDragged }) => (
                  <div
                    {...props}
                    className={`w-8 h-8 rounded-full shadow-lg cursor-pointer border-4 border-white flex items-center justify-center ${
                      isDragged ? 'bg-blue-600' : 'bg-blue-500'
                    }`}
                  >
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-3">
              <span>15 days ago</span>
              <span>Today</span>
              <span>15 days ahead</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <CalendarOutlined className="text-blue-600" />
          <Text className="font-medium text-gray-900">Live Weather Data</Text>
        </div>
        <Text className="text-sm text-gray-600">
          Temperature data updates automatically when you adjust the time. 
          Polygon colors reflect real weather conditions for the selected hour.
        </Text>
      </div>
    </div>
  );
};

export default TimelineSlider;