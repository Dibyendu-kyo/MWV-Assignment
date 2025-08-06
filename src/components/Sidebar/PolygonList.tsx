'use client';

import React from 'react';
import { Typography, List, Button, Tag, Space, Input } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, EnvironmentOutlined, DatabaseOutlined, InfoCircleOutlined, FireOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useStore } from '../../store/useStore';

const { Title, Text } = Typography;

const PolygonList: React.FC = () => {
  const { polygons, dataSources, removePolygon, renamePolygon } = useStore();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState<string>('');

  const getDataSourceName = (dataSourceId: string) => {
    return dataSources.find(ds => ds.id === dataSourceId)?.name || 'Unknown';
  };

  const startEditing = (polygon: any) => {
    setEditingId(polygon.id);
    setEditingName(polygon.name || `Area ${polygon.id.slice(-4)}`);
  };

  const saveEdit = () => {
    if (editingId && editingName.trim()) {
      renamePolygon(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
          <EnvironmentOutlined className="text-purple-600" />
        </div>
        <div>
          <Title level={5} className="m-0 text-gray-900">Polygons ({polygons.length})</Title>
          <Text className="text-sm text-gray-500">Manage your drawn areas</Text>
        </div>
      </div>
      
      {polygons.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3 text-gray-300"><EnvironmentOutlined /></div>
          <Text className="text-gray-500 block mb-2">No polygons created yet</Text>
          <Text className="text-sm text-gray-400">
            Use the drawing tool to create polygons on the map
          </Text>
        </div>
      ) : (
        <List
          dataSource={polygons}
          renderItem={(polygon) => (
            <List.Item
              className="px-0"
              actions={[
                <Button
                  key="edit"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => startEditing(polygon)}
                  title="Rename area"
                />,
                <Button
                  key="delete"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removePolygon(polygon.id)}
                  title="Delete area"
                />,
              ]}
            >
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  {editingId === polygon.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onPressEnter={saveEdit}
                        onBlur={saveEdit}
                        autoFocus
                        size="small"
                        className="flex-1"
                      />
                    </div>
                  ) : (
                    <Text strong className="text-base">
                      {polygon.name || `Area ${polygon.id.slice(-4)}`}
                    </Text>
                  )}
                  <div
                    className="w-6 h-6 rounded border-2 border-gray-300"
                    style={{ backgroundColor: polygon.color }}
                    title={`Color: ${polygon.color}`}
                  />
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <DatabaseOutlined className="text-xs" />
                    Data: {getDataSourceName(polygon.dataSource)}
                  </div>
                  <div className="flex items-center gap-2">
                    <EnvironmentOutlined className="text-xs" />
                    Points: {polygon.points.length} vertices
                  </div>
                  <div className="flex items-center gap-2">
                    <InfoCircleOutlined className="text-xs" />
                    ID: {polygon.id.slice(-8)}
                  </div>
                  {polygon.data && (
                    <>
                      <div className="flex items-center gap-2">
                        <FireOutlined className="text-xs" />
                        Temp: {polygon.data.temperature !== null ? `${polygon.data.temperature.toFixed(1)}°C` : 'No data'}
                      </div>
                      {polygon.data.timestamp && (
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <ClockCircleOutlined className="text-xs" />
                          {new Date(polygon.data.timestamp).toLocaleString()}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default PolygonList;