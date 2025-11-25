'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Grid, Plus, Search, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';

// TypeScript interfaces
interface Zone {
  id: string;
  warehouseId: string;
  warehouseName: string;
  code: string;
  name: string;
  type: 'RECEIVING' | 'STORAGE' | 'PICKING' | 'SHIPPING' | 'QUARANTINE';
  capacity: number;
  usedSpace: number;
  bins: Array<{
    id: string;
    code: string;
  }>;
  temperature?: { min: number; max: number };
  humidity?: { min: number; max: number };
}

interface ZonesResponse {
  success: boolean;
  data: {
    items: Zone[];
    total: number;
  };
}

// Fetch zones data
const fetchZones = async (): Promise<ZonesResponse> => {
  const response = await axios.get('/api/v1/warehouses/zones');
  return response.data;
};

export default function BinsZonesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['warehouses', 'zones'],
    queryFn: fetchZones,
  });

  const zones = data?.data?.items || [];
  const totalZones = data?.data?.total || 0;

  // Calculate summary stats
  const totalCapacity = zones.reduce((sum, zone) => sum + zone.capacity, 0);
  const totalUsed = zones.reduce((sum, zone) => sum + zone.usedSpace, 0);
  const totalBins = zones.reduce((sum, zone) => sum + (zone.bins?.length || 0), 0);
  const avgUtilization = totalCapacity > 0 ? Math.round((totalUsed / totalCapacity) * 100) : 0;

  // Get zone type badge color
  const getZoneTypeBadgeColor = (type: Zone['type']) => {
    const colors = {
      RECEIVING: 'bg-blue-100 text-blue-800',
      STORAGE: 'bg-green-100 text-green-800',
      PICKING: 'bg-yellow-100 text-yellow-800',
      SHIPPING: 'bg-purple-100 text-purple-800',
      QUARANTINE: 'bg-red-100 text-red-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bins & Zones</h1>
          <p className="text-muted-foreground mt-1">
            Configure warehouse storage locations and zones
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Zone
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search zones and bins..."
          className="w-full pl-9 pr-4 py-2 border rounded-md bg-background"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading zones...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load zones. Please try again.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Display */}
      {!isLoading && !error && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Zones</p>
                  <p className="text-2xl font-bold">{totalZones}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Bins</p>
                  <p className="text-2xl font-bold">{totalBins}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Capacity</p>
                  <p className="text-2xl font-bold">{totalCapacity.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg Utilization</p>
                  <p className="text-2xl font-bold">{avgUtilization}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zones Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid className="h-5 w-5" />
                Zone Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {zones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Grid className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">No Zones Found</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Create your first zone to start organizing your warehouse storage locations.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Zone Name</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Code</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Capacity</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Used Space</th>
                        <th className="text-right py-3 px-4 font-medium text-muted-foreground">Utilization</th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Warehouse</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zones.map((zone) => {
                        const utilization = zone.capacity > 0
                          ? Math.round((zone.usedSpace / zone.capacity) * 100)
                          : 0;
                        return (
                          <tr key={zone.id} className="border-b hover:bg-muted/50 cursor-pointer">
                            <td className="py-3 px-4 font-medium">{zone.name}</td>
                            <td className="py-3 px-4">
                              <code className="text-sm bg-muted px-2 py-1 rounded">{zone.code}</code>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getZoneTypeBadgeColor(zone.type)}`}>
                                {zone.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">{zone.capacity.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right">{zone.usedSpace.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${utilization > 90 ? 'bg-red-500' : utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                    style={{ width: `${utilization}%` }}
                                  />
                                </div>
                                <span className="text-sm">{utilization}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{zone.warehouseName}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
