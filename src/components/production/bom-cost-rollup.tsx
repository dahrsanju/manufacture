'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CostComponent {
  category: string;
  amount: number;
  percentage: number;
  items: { name: string; cost: number }[];
}

interface BOMCostRollupProps {
  productName: string;
  totalCost: number;
  components: CostComponent[];
  margin?: number;
}

const mockData: BOMCostRollupProps = {
  productName: 'Widget Pro X100',
  totalCost: 156.50,
  margin: 35,
  components: [
    {
      category: 'Raw Materials',
      amount: 65.00,
      percentage: 41.5,
      items: [
        { name: 'Aluminum Sheet', cost: 45.00 },
        { name: 'Steel Rod', cost: 20.00 },
      ],
    },
    {
      category: 'Components',
      amount: 42.50,
      percentage: 27.2,
      items: [
        { name: 'Bearings', cost: 25.00 },
        { name: 'Screws M4', cost: 8.50 },
        { name: 'Washers', cost: 9.00 },
      ],
    },
    {
      category: 'Labor',
      amount: 35.00,
      percentage: 22.4,
      items: [
        { name: 'Assembly', cost: 20.00 },
        { name: 'Quality Check', cost: 10.00 },
        { name: 'Packaging', cost: 5.00 },
      ],
    },
    {
      category: 'Overhead',
      amount: 14.00,
      percentage: 8.9,
      items: [
        { name: 'Machine Time', cost: 8.00 },
        { name: 'Utilities', cost: 4.00 },
        { name: 'Depreciation', cost: 2.00 },
      ],
    },
  ],
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export function BOMCostRollup({
  productName = mockData.productName,
  totalCost = mockData.totalCost,
  components = mockData.components,
  margin = mockData.margin,
}: Partial<BOMCostRollupProps>) {
  const sellingPrice = margin ? totalCost * (1 + margin / 100) : totalCost;
  const profit = sellingPrice - totalCost;

  const chartData = components.map((c) => ({
    name: c.category,
    value: c.amount,
  }));

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-muted-foreground">{productName}</h3>
            <p className="text-3xl font-bold">${totalCost.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Manufacturing Cost</p>
          </div>

          {margin && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-lg font-bold">${totalCost.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Cost</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-success">${profit.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Profit ({margin}%)</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">${sellingPrice.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Selling Price</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {components.map((component, index) => (
              <div key={component.category} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{component.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">${component.amount.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({component.percentage}%)
                    </span>
                  </div>
                </div>

                <div className="space-y-1 pl-5">
                  {component.items.map((item) => (
                    <div key={item.name} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span>${item.cost.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
