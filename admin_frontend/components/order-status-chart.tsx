"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = [
  "hsl(var(--color-accent))",
  "hsl(var(--color-primary))",
  "hsl(var(--color-destructive))",
];

export function OrderStatusChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    fetch("http://localhost:5134/api/Dashboard/order-status")
      .then((res) => res.json())
      .then((result) => {
        const chartData = [
          { name: "Accepted", value: result.accepted },
          { name: "Pending", value: result.pending },
          { name: "Deleted", value: result.deleted },
        ];
        setData(chartData);
      });
  }, []);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Order Status Distribution
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}%`}
            outerRadius={80}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
