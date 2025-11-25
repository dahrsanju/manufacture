'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button } from '@/components/ui';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  TrendingDown,
  Calendar,
  RefreshCw,
  AlertTriangle,
  Package,
  Loader2,
  Info,
  CheckCircle,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface ForecastKPI {
  id: string;
  name: string;
  currentValue: number;
  forecastValue: number;
  unit: string;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

interface InventoryForecast {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  forecastedDemand: number;
  reorderPoint: number;
  stockoutRisk: 'low' | 'medium' | 'high';
  daysUntilStockout: number | null;
  recommendedOrder: number;
}

interface ForecastChartData {
  date: string;
  actual: number | null;
  forecast: number;
  upperBound: number;
  lowerBound: number;
}

interface ModelInfo {
  version: string;
  accuracy: number;
  lastTrained: string;
  dataPoints: number;
}

interface ForecastingData {
  kpis: ForecastKPI[];
  inventoryForecasts: InventoryForecast[];
  demandChart: ForecastChartData[];
  modelInfo: ModelInfo;
}

export default function ForecastingPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['analytics-forecasting'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/analytics/forecasting');
      return response.data.data as ForecastingData;
    },
    refetchInterval: 120000,
  });

  // Helper to get stockout risk badge variant
  const getStockoutRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium Risk</Badge>;
      case 'low':
        return <Badge variant="success">Low Risk</Badge>;
      default:
        return <Badge variant="secondary">{risk}</Badge>;
    }
  };

  // Helper to format values with units
  const formatValue = (value: number, unit: string) => {
    if (unit === '$') {
      return `$${value.toLocaleString()}`;
    } else if (unit === '%') {
      return `${value}%`;
    } else if (unit) {
      return `${value.toLocaleString()} ${unit}`;
    }
    return value.toLocaleString();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">Loading forecasting data...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <p className="mt-4 text-destructive font-medium">Failed to load forecasting data</p>
        <p className="text-sm text-muted-foreground mt-1">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
        <Button variant="outline" className="mt-4" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Forecasting</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered demand and inventory forecasting
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Time Range
          </Button>
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Run Forecast
          </Button>
        </div>
      </div>

      {/* Forecast KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(data?.kpis ?? []).map((kpi) => {
          const isPositive = kpi.trend === 'up';
          const isNegative = kpi.trend === 'down';
          const changePercent = kpi.forecastValue > 0
            ? ((kpi.forecastValue - kpi.currentValue) / kpi.currentValue * 100).toFixed(1)
            : '0';

          return (
            <Card key={kpi.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{kpi.name}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-2xl font-bold">{formatValue(kpi.forecastValue, kpi.unit)}</p>
                      <span className="text-sm text-muted-foreground">
                        (current: {formatValue(kpi.currentValue, kpi.unit)})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`flex items-center text-sm ${
                        isPositive ? 'text-success' : isNegative ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : isNegative ? (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        ) : null}
                        {isPositive ? '+' : ''}{changePercent}%
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {kpi.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                  <LineChartIcon className={`h-8 w-8 ${
                    isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-primary'
                  }`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Demand Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChartIcon className="h-5 w-5" />
            Demand Forecast
          </CardTitle>
          <CardDescription>
            Historical data with AI-generated forecast and confidence intervals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data?.demandChart || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  const label = name === 'actual' ? 'Actual' :
                    name === 'forecast' ? 'Forecast' :
                    name === 'upperBound' ? 'Upper Bound' : 'Lower Bound';
                  return [value, label];
                }}
              />
              <Area
                type="monotone"
                dataKey="upperBound"
                stroke="transparent"
                fill="#3b82f620"
                name="upperBound"
              />
              <Area
                type="monotone"
                dataKey="lowerBound"
                stroke="transparent"
                fill="#ffffff"
                name="lowerBound"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e' }}
                name="actual"
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#3b82f6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#3b82f6' }}
                name="forecast"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-muted-foreground">Forecast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500/20" />
              <span className="text-sm text-muted-foreground">Confidence Interval</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Forecast Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Forecast
          </CardTitle>
          <CardDescription>
            Stock levels and stockout risk predictions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">SKU</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Current Stock</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Forecasted Demand</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Reorder Point</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Stockout Risk</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Days Until Stockout</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Recommended Order</th>
                </tr>
              </thead>
              <tbody>
                {(data?.inventoryForecasts ?? []).map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{item.productName}</td>
                    <td className="py-3 px-4 text-muted-foreground">{item.sku}</td>
                    <td className="py-3 px-4 text-right">{item.currentStock.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{item.forecastedDemand.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{item.reorderPoint.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">{getStockoutRiskBadge(item.stockoutRisk)}</td>
                    <td className="py-3 px-4 text-right">
                      {item.daysUntilStockout !== null ? (
                        <span className={item.daysUntilStockout <= 7 ? 'text-destructive font-medium' : ''}>
                          {item.daysUntilStockout} days
                        </span>
                      ) : (
                        <span className="text-success">Safe</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {item.recommendedOrder > 0 ? item.recommendedOrder.toLocaleString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!data?.inventoryForecasts || data.inventoryForecasts.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No inventory forecast data available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Model Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Model Information
          </CardTitle>
          <CardDescription>
            Details about the AI forecasting model
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Model Version</p>
              <p className="text-lg font-semibold mt-1">{data?.modelInfo.version || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-1">
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <CheckCircle className="h-3 w-3 text-success" />
              </div>
              <p className="text-lg font-semibold mt-1">{data?.modelInfo.accuracy || 0}%</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-1">
                <p className="text-sm text-muted-foreground">Last Trained</p>
                <Clock className="h-3 w-3 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold mt-1">
                {data?.modelInfo.lastTrained
                  ? new Date(data.modelInfo.lastTrained).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Training Data Points</p>
              <p className="text-lg font-semibold mt-1">
                {data?.modelInfo.dataPoints?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
