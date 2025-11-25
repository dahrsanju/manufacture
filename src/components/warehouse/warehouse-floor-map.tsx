'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut, Move, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';

interface Zone {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'storage' | 'receiving' | 'shipping' | 'staging' | 'office';
  capacity: number;
  used: number;
}

interface WarehouseFloorMapProps {
  zones: Zone[];
  selectedZoneId?: string;
  onZoneSelect?: (zone: Zone) => void;
  onZoneUpdate?: (zone: Zone) => void;
  editable?: boolean;
}

const mockZones: Zone[] = [
  { id: 'z1', name: 'Zone A - Receiving', x: 10, y: 10, width: 180, height: 100, type: 'receiving', capacity: 500, used: 320 },
  { id: 'z2', name: 'Zone B - Storage', x: 200, y: 10, width: 200, height: 200, type: 'storage', capacity: 2000, used: 1650 },
  { id: 'z3', name: 'Zone C - Storage', x: 410, y: 10, width: 180, height: 200, type: 'storage', capacity: 1500, used: 890 },
  { id: 'z4', name: 'Zone D - Staging', x: 10, y: 120, width: 180, height: 90, type: 'staging', capacity: 300, used: 180 },
  { id: 'z5', name: 'Zone E - Shipping', x: 10, y: 220, width: 380, height: 80, type: 'shipping', capacity: 400, used: 220 },
  { id: 'z6', name: 'Office', x: 410, y: 220, width: 180, height: 80, type: 'office', capacity: 0, used: 0 },
];

const zoneColors = {
  storage: 'fill-primary/20 stroke-primary',
  receiving: 'fill-success/20 stroke-success',
  shipping: 'fill-warning/20 stroke-warning',
  staging: 'fill-secondary/20 stroke-secondary',
  office: 'fill-muted stroke-muted-foreground',
};

export function WarehouseFloorMap({
  zones = mockZones,
  selectedZoneId,
  onZoneSelect,
  onZoneUpdate,
  editable = false,
}: WarehouseFloorMapProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getUtilizationColor = (zone: Zone) => {
    if (zone.capacity === 0) return 'text-muted-foreground';
    const utilization = (zone.used / zone.capacity) * 100;
    if (utilization >= 90) return 'text-destructive';
    if (utilization >= 70) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="relative border rounded-lg overflow-hidden bg-muted/30">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="outline" size="icon" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom Level */}
      <div className="absolute top-4 left-4 z-10 text-sm text-muted-foreground">
        {Math.round(scale * 100)}%
      </div>

      {/* Map Container */}
      <div
        className="w-full h-[400px] cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 600 320"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          }}
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Zones */}
          {zones.map((zone) => (
            <g
              key={zone.id}
              onClick={() => onZoneSelect?.(zone)}
              className="cursor-pointer"
            >
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                className={`${zoneColors[zone.type]} ${
                  selectedZoneId === zone.id ? 'stroke-2' : 'stroke-1'
                }`}
                rx="4"
              />
              <text
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2 - 8}
                textAnchor="middle"
                className="text-xs font-medium fill-foreground"
              >
                {zone.name}
              </text>
              {zone.capacity > 0 && (
                <text
                  x={zone.x + zone.width / 2}
                  y={zone.y + zone.height / 2 + 8}
                  textAnchor="middle"
                  className={`text-[10px] ${getUtilizationColor(zone)}`}
                >
                  {zone.used}/{zone.capacity} ({Math.round((zone.used / zone.capacity) * 100)}%)
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 rounded-md p-2 text-xs">
        <div className="flex flex-wrap gap-3">
          {Object.entries(zoneColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded ${color.replace('stroke-', 'bg-').replace('/20', '')}`} />
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
