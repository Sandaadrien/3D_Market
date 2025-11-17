"use client";
import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { RecentOrders } from "@/components/recent-orders";
import { OrderStatusChart } from "@/components/order-status-chart";
import { ProductsByCategoryChart } from "@/components/products-by-category-chart";
import { useEffect, useState } from "react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  acceptedOrders: number;
  activeClients: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("http://localhost:5134/api/Dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des commandes:", err);
      });
  }, []);

  if (!stats) return <p>Loading...</p>;
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your market.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          icon={Package}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={ShoppingCart}
        />
        <StatCard
          title="Accepted Orders"
          value={stats.acceptedOrders.toString()}
          icon={TrendingUp}
        />
        <StatCard
          title="Active Clients"
          value={stats.activeClients.toString()}
          icon={Users}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductsByCategoryChart />
        <OrderStatusChart />
        <RecentOrders />
      </div>
    </div>
  );
}
