'use client';

import React from 'react';
import { Typography, Card } from 'antd';
import { BgColorsOutlined } from '@ant-design/icons';
import { useStore } from '../../store/useStore';

const { Title, Text } = Typography;

const ColorLegend: React.FC = () => {
  const { dataSources, selectedDataSource } = useStore();
  
  const currentDataSource = dataSources.find(ds => ds.id === selectedDataSource);

  if (!currentDataSource || currentDataSource.colorRules.length === 0) {
    return null;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
          <BgColorsOutlined className="text-indigo-600" />
        </div>
        <div>
          <Title level={5} className="m-0 text-gray-900">Color Legend</Title>
          <Text className="text-sm text-gray-500">Temperature color coding</Text>
        </div>
      </div>

      <div className="space-y-3">
        {currentDataSource.colorRules.map((rule, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-6 h-6 rounded border-2 border-gray-300 flex-shrink-0"
              style={{ backgroundColor: rule.color }}
            />
            <div className="flex-1">
              <Text className="text-sm font-medium">
                Temperature {rule.operator} {rule.value}°C
              </Text>
              <div className="text-xs text-gray-500">
                Color: {rule.color}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Text className="text-xs text-blue-700">
          Polygon colors update automatically based on temperature data and timeline selection
        </Text>
      </div>
    </div>
  );
};

export default ColorLegend;