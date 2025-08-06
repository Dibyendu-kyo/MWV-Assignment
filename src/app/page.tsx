'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Layout } from 'antd';
import TimelineSlider from '../components/Timeline/TimelineSlider';
import TimelineDisplay from '../components/Timeline/TimelineDisplay';
import Sidebar from '../components/Sidebar/Sidebar';

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('../components/Map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-lg">Loading map...</div>
    </div>
  ),
});

const { Content, Sider } = Layout;

export default function Home() {
  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Geo Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Dynamic data visualization with interactive maps and timelines</p>
          </div>
          <div className="flex items-center gap-6">
            <TimelineDisplay />
            <div className="text-sm text-gray-500">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Live Data
            </div>
          </div>
        </div>
      </div>

      <Layout className="bg-transparent">
        <Content className="p-6">
          <div className="mb-6">
            <TimelineSlider />
          </div>
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <MapComponent />
              </div>
            </div>
          </div>
        </Content>
        <Sider width={420} theme="light" className="bg-transparent">
          <Sidebar />
        </Sider>
      </Layout>
    </Layout>
  );
}