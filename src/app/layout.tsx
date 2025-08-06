import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
    title: 'Geo Dashboard - Dynamic Data Visualization',
    description: 'Interactive dashboard for visualizing dynamic data over maps and timelines with polygon creation and color-coded data display',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://unpkg.com/antd@5.12.8/dist/reset.css" />
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <style dangerouslySetInnerHTML={{
                    __html: `
                        * { box-sizing: border-box; }
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            background-color: #f9fafb;
                            margin: 0;
                            padding: 0;
                            color: #111827;
                        }
                        .ant-layout { background: transparent !important; }
                        .ant-layout-sider { background: white !important; }
                        .ant-btn { 
                            border-radius: 8px; 
                            height: 40px; 
                            font-weight: 500;
                            border: 1px solid #d9d9d9;
                            background: white;
                            cursor: pointer;
                            padding: 4px 15px;
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .ant-btn-primary { 
                            background-color: #1890ff; 
                            border-color: #1890ff; 
                            color: white;
                        }
                        .ant-btn-primary:hover { 
                            background-color: #40a9ff; 
                            border-color: #40a9ff; 
                        }
                        .ant-btn-danger { 
                            background-color: #ff4d4f; 
                            border-color: #ff4d4f; 
                            color: white;
                        }
                        .ant-card { 
                            border-radius: 12px; 
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                            border: 1px solid #e5e7eb;
                            background: white;
                            margin-bottom: 16px;
                        }
                        .ant-card-body { padding: 24px; }
                        .ant-list-item {
                            padding: 16px 0 !important;
                            border-bottom: 1px solid #f3f4f6 !important;
                        }
                        .ant-input {
                            border-radius: 8px;
                            border: 1px solid #d9d9d9;
                            padding: 8px 12px;
                            height: 40px;
                            width: 100%;
                        }
                        .ant-select {
                            border-radius: 8px;
                            width: 100%;
                        }
                        .ant-select-selector {
                            border-radius: 8px !important;
                            height: 40px !important;
                            border: 1px solid #d9d9d9 !important;
                        }
                        .ant-typography h1, .ant-typography h2, .ant-typography h3, .ant-typography h4, .ant-typography h5 { 
                            color: #111827 !important; 
                            font-weight: 600 !important; 
                            margin: 0 0 8px 0 !important;
                        }
                        .leaflet-container { height: 100%; width: 100%; }
                        .map-container { 
                            height: calc(100vh - 200px); 
                            width: 100%; 
                            border-radius: 12px;
                            overflow: hidden;
                            background: white;
                            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                            border: 1px solid #e5e7eb;
                        }
                        .sidebar {
                            background: white;
                            height: 100vh;
                            overflow-y: auto;
                            min-width: 400px;
                        }
                        .timeline-container {
                            background: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                            padding: 16px;
                            margin-bottom: 24px;
                        }
                        .react-range-track {
                            height: 8px;
                            background: #f0f0f0;
                            border-radius: 4px;
                        }
                        .react-range-thumb {
                            height: 24px;
                            width: 24px;
                            background: #1890ff;
                            border-radius: 50%;
                            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
                        }
                    `
                }} />
            </head>
            <body className={`${inter.className} antialiased bg-gray-50`}>{children}</body>
        </html>
    )
}