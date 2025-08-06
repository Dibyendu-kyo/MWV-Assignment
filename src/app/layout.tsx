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
            </head>
            <body className={`${inter.className} antialiased bg-gray-50`}>{children}</body>
        </html>
    )
}