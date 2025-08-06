'use client';

import React from 'react';
import { Typography, Select, Button, Space, InputNumber, ColorPicker } from 'antd';
import { PlusOutlined, DeleteOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useStore } from '../../store/useStore';
import { ColorRule } from '../../types';
import { getDefaultColors } from '../../utils/colorUtils';

const { Title, Text } = Typography;
const { Option } = Select;

const DataSourceControl: React.FC = () => {
  const { dataSources, selectedDataSource, setSelectedDataSource, updateDataSource } = useStore();
  
  const currentDataSource = dataSources.find(ds => ds.id === selectedDataSource);
  const defaultColors = getDefaultColors();

  const addColorRule = () => {
    if (!currentDataSource) return;
    
    const newRule: ColorRule = {
      operator: '>=',
      value: 0,
      color: defaultColors[currentDataSource.colorRules.length % defaultColors.length],
    };

    updateDataSource(selectedDataSource, {
      colorRules: [...currentDataSource.colorRules, newRule],
    });
  };

  const updateColorRule = (index: number, updates: Partial<ColorRule>) => {
    if (!currentDataSource) return;
    
    const updatedRules = currentDataSource.colorRules.map((rule, i) =>
      i === index ? { ...rule, ...updates } : rule
    );

    updateDataSource(selectedDataSource, { colorRules: updatedRules });
  };

  const removeColorRule = (index: number) => {
    if (!currentDataSource) return;
    
    const updatedRules = currentDataSource.colorRules.filter((_, i) => i !== index);
    updateDataSource(selectedDataSource, { colorRules: updatedRules });
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <DatabaseOutlined className="text-blue-600" />
        </div>
        <div>
          <Title level={5} className="m-0 text-gray-900">Data Source Configuration</Title>
          <Text className="text-sm text-gray-500">Configure temperature thresholds and colors</Text>
        </div>
      </div>
      
      <div className="mb-6">
        <Text strong className="block mb-2">Selected Data Source:</Text>
        <Select
          value={selectedDataSource}
          onChange={setSelectedDataSource}
          className="w-full"
          size="large"
        >
          {dataSources.map(ds => (
            <Option key={ds.id} value={ds.id}>
              {ds.name}
            </Option>
          ))}
        </Select>
      </div>

      {currentDataSource && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <Text strong>Color Rules:</Text>
            <Button
              type="dashed"
              size="small"
              icon={<PlusOutlined />}
              onClick={addColorRule}
            >
              Add Rule
            </Button>
          </div>

          <div className="space-y-4">
            {currentDataSource.colorRules.map((rule, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <Space direction="vertical" className="w-full">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Select
                      value={rule.operator}
                      onChange={(value) => updateColorRule(index, { operator: value })}
                      style={{ width: 70 }}
                    >
                      <Option value="<">&lt;</Option>
                      <Option value="<=">&le;</Option>
                      <Option value="=">=</Option>
                      <Option value=">=">&ge;</Option>
                      <Option value=">">&gt;</Option>
                    </Select>
                    
                    <InputNumber
                      value={rule.value}
                      onChange={(value) => updateColorRule(index, { value: value || 0 })}
                      style={{ width: 100 }}
                      step={0.1}
                    />
                    
                    <Text strong>°C</Text>
                    
                    <ColorPicker
                      value={rule.color}
                      onChange={(color) => updateColorRule(index, { color: color.toHexString() })}
                    />
                    
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeColorRule(index)}
                    />
                  </div>
                  
                  <Text type="secondary" className="text-sm">
                    Temperature {rule.operator} {rule.value}°C → 
                    <span 
                      className="ml-2 px-2 py-1 rounded text-white text-xs"
                      style={{ backgroundColor: rule.color }}
                    >
                      {rule.color}
                    </span>
                  </Text>
                </Space>
              </div>
            ))}
          </div>

          {currentDataSource.colorRules.length === 0 && (
            <Text type="secondary" className="text-sm">
              No color rules defined. Add rules to colorize polygons based on data values.
            </Text>
          )}
        </div>
      )}
    </div>
  );
};

export default DataSourceControl;