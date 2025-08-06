'use client';

import React from 'react';
import { Button, Typography, Alert } from 'antd';
import { PlusOutlined, StopOutlined, EditOutlined } from '@ant-design/icons';
import { useStore } from '../../store/useStore';

const { Title, Text } = Typography;

const DrawingControls: React.FC = () => {
  const { isDrawing, setIsDrawing } = useStore();

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
          <EditOutlined className="text-green-600" />
        </div>
        <div>
          <Title level={5} className="m-0 text-gray-900">Polygon Drawing</Title>
          <Text className="text-sm text-gray-500">Create areas for data analysis</Text>
        </div>
      </div>
      
      {!isDrawing ? (
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsDrawing(true)}
            block
            size="large"
            className="h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
          >
            Start Drawing Polygon
          </Button>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <Text className="text-sm text-gray-600">
              Click on the map to create polygon points (3-12 points). 
              Double-click to finish drawing.
            </Text>
          </div>
        </div>
      ) : (
        <div>
          <Button
            danger
            icon={<StopOutlined />}
            onClick={() => setIsDrawing(false)}
            block
            size="large"
            className="h-12 text-base font-medium"
          >
            Cancel Drawing
          </Button>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <Text className="font-medium text-blue-900">Drawing Mode Active</Text>
            </div>
            <Text className="text-sm text-blue-700">
              Click on the map to add points. Double-click or reach 12 points to finish.
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingControls;