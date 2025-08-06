'use client';

import React from 'react';
import { Typography } from 'antd';
import { useStore } from '../../store/useStore';

const { Text } = Typography;

const TimelineDisplay: React.FC = () => {
  const { timeline } = useStore();

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

  const currentHourIndex = 15 * 24 + new Date().getHours();

  const getDisplayText = () => {
    if (timeline.mode === 'single') {
      return formatHour(timeline.selectedHour);
    } else {
      const startHour = timeline.selectedRange?.[0] || currentHourIndex;
      const endHour = timeline.selectedRange?.[1] || currentHourIndex + 12;
      return `Range: ${formatHour(startHour)} - ${formatHour(endHour)}`;
    }
  };

  return (
    <div className="text-right">
      <Text className="text-sm text-gray-500 block">Current Selection</Text>
      <Text className="text-lg font-semibold text-gray-900">
        {getDisplayText()}
      </Text>
    </div>
  );
};

export default TimelineDisplay;