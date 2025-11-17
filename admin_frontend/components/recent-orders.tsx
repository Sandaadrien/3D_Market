"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

interface OrderItem {
  id: string;
  clientEmail: string;
  total: number;
  status: "ACCEPTED" | "PENDING" | "DELETED";
  date: string;
}

function StatusBadge({
  status,
}: {
  status: "ACCEPTED" | "PENDING" | "DELETED";
}) {
  const colors = {
    ACCEPTED: "bg-accent/10 text-accent",
    PENDING: "bg-primary/10 text-primary",
    DELETED: "bg-destructive/10 text-destructive",
  };

  return <Badge className={`${colors[status]} border-0`}>{status}</Badge>;
}

export function RecentOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5134/api/Dashboard/recent-orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des commandes:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Card className="col-span-1 p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <p className="text-muted-foreground">Chargement...</p>
      </Card>
    );
  }
  return (
    <Card className="col-span-1 p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Recent Orders
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Client
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Total
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border hover:bg-muted/50"
              >
                <td className="py-3 px-4">{order.clientEmail}</td>
                <td className="py-3 px-4 font-semibold">${order.total}</td>
                <td className="py-3 px-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
