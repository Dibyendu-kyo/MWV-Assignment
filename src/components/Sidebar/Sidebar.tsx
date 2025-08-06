'use client';

import React from 'react';
import { Card, Typography, Divider } from 'antd';
import DataSourceControl from './DataSourceControl';
import PolygonList from './PolygonList';
import DrawingControls from './DrawingControls';
import ColorLegend from './ColorLegend';


const { Title, Text } = Typography;

const Sidebar: React.FC = () => {
  return (
    <div className="h-full bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <Title level={3} className="mb-2 text-gray-900">Controls</Title>
          <Text className="text-sm text-gray-500">Manage polygons and data visualization</Text>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <DrawingControls />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <DataSourceControl />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <ColorLegend />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <PolygonList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;