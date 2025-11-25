'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Columns3, ArrowLeftRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui';

// TypeScript interfaces
interface Warehouse {
  id: string;
  name: string;
  code: string;
}

interface Metric {
  name: string;
  unit: string;
  values: Record<string, number>;
}

interface ChartDataPoint {
  date: string;
  [warehouseId: string]: number | string;
}

interface WarehouseComparison {
  warehouses: Warehouse[];
  metrics: Metric[];
  charts: {
    throughput: ChartDataPoint[];
    efficiency: ChartDataPoint[];
  };
}

interface ComparisonResponse {
  success: boolean;
  data: WarehouseComparison;
}

// Fetch comparison data
const fetchComparison = async (): Promise<ComparisonResponse> => {
  const response = await axios.get('/api/v1/warehouses/comparison');
  return response.data;
};

export default function WarehouseComparisonPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['warehouses', 'comparison'],
    queryFn: fetchComparison,
  });

  const comparison = data?.data;
  const warehouses = comparison?.warehouses || [];
  const metrics = comparison?.metrics || [];

  // Format metric value based on unit
  const formatValue = (value: number, unit: string) => {
    if (unit === '%') return `${value}%`;
    if (unit === '$') return `$${value.toFixed(2)}`;
    if (unit === 'mins') return `${value} mins`;
    return value.toLocaleString();
  };

  // Get the best value for a metric (highest is better except for time/cost)
  const getBestValue = (metric: Metric): string | null => {
    const values = Object.entries(metric.values);
    if (values.length === 0) return null;

    const lowerIsBetter = ['Avg Pick Time', 'Cost per Unit'].includes(metric.name);

    const [bestId] = values.reduce((best, current) => {
      if (lowerIsBetter) {
        return current[1] < best[1] ? current : best;
      }
      return current[1] > best[1] ? current : best;
    });

    return bestId;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Warehouse Comparison</h1>
          <p className="text-muted-foreground mt-1">
            Compare performance metrics across warehouses
          </p>
        </div>
        <Button variant="outline">
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          Select Warehouses
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading comparison data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to load comparison data. Please try again.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Display */}
      {!isLoading && !error && comparison && (
        <>
          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Columns3 className="h-5 w-5" />
                Side-by-Side Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              {warehouses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Columns3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium">No Warehouses to Compare</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    Select warehouses to compare their performance metrics.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Metric
                        </th>
                        {warehouses.map((warehouse) => (
                          <th key={warehouse.id} className="text-center py-3 px-4 font-medium">
                            <div>
                              <span className="block">{warehouse.name}</span>
                              <span className="text-xs text-muted-foreground font-normal">
                                {warehouse.code}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.map((metric) => {
                        const bestId = getBestValue(metric);
                        return (
                          <tr key={metric.name} className="border-b hover:bg-muted/50">
                            <td className="py-4 px-4">
                              <div>
                                <span className="font-medium">{metric.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({metric.unit})
                                </span>
                              </div>
                            </td>
                            {warehouses.map((warehouse) => {
                              const value = metric.values[warehouse.id];
                              const isBest = warehouse.id === bestId;
                              return (
                                <td
                                  key={warehouse.id}
                                  className={`py-4 px-4 text-center ${
                                    isBest ? 'bg-green-50' : ''
                                  }`}
                                >
                                  <span
                                    className={`text-lg font-semibold ${
                                      isBest ? 'text-green-600' : ''
                                    }`}
                                  >
                                    {formatValue(value, metric.unit)}
                                  </span>
                                  {isBest && (
                                    <span className="block text-xs text-green-600 mt-1">
                                      Best
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Throughput Chart Placeholder */}
          {comparison.charts && comparison.charts.throughput && (
            <Card>
              <CardHeader>
                <CardTitle>Throughput Trend (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Date</th>
                        {warehouses.map((warehouse) => (
                          <th key={warehouse.id} className="text-right py-2 px-3 font-medium text-muted-foreground">
                            {warehouse.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.charts.throughput.map((dataPoint, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-3">{dataPoint.date}</td>
                          {warehouses.map((warehouse) => (
                            <td key={warehouse.id} className="text-right py-2 px-3">
                              {Number(dataPoint[warehouse.id]).toLocaleString()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Efficiency Chart Placeholder */}
          {comparison.charts && comparison.charts.efficiency && (
            <Card>
              <CardHeader>
                <CardTitle>Efficiency Trend (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Date</th>
                        {warehouses.map((warehouse) => (
                          <th key={warehouse.id} className="text-right py-2 px-3 font-medium text-muted-foreground">
                            {warehouse.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.charts.efficiency.map((dataPoint, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-3">{dataPoint.date}</td>
                          {warehouses.map((warehouse) => (
                            <td key={warehouse.id} className="text-right py-2 px-3">
                              {Number(dataPoint[warehouse.id]).toLocaleString()}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {warehouses.map((warehouse) => {
              const utilization = metrics.find(m => m.name === 'Utilization')?.values[warehouse.id] || 0;
              const throughput = metrics.find(m => m.name === 'Throughput')?.values[warehouse.id] || 0;
              const accuracy = metrics.find(m => m.name === 'Accuracy')?.values[warehouse.id] || 0;

              return (
                <Card key={warehouse.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Utilization</span>
                        <span className="font-semibold">{utilization}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${utilization > 90 ? 'bg-red-500' : utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${utilization}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-muted-foreground">Throughput</span>
                        <span className="font-medium">{throughput.toLocaleString()} units/day</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Accuracy</span>
                        <span className="font-medium">{accuracy}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
