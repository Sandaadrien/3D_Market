"use client";

import { useState, useEffect } from "react";
import { useClients } from "@/hooks/use-clients";
import { ClientsTable } from "@/components/clients-table";

export default function ClientsPage() {
  const { clients, loading, fetchClients } = useClients();
  const [stats, setStats] = useState({
    total: 0,
    totalSpent: 0,
    avgOrderValue: 0,
  });

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    if (clients.length > 0) {
      const total = clients.length;
      const totalSpent = clients.reduce((sum, c) => sum + c.totalSpent, 0);
      const avgOrderValue =
        totalSpent / clients.reduce((sum, c) => sum + c.orderCount, 1);

      setStats({
        total,
        totalSpent,
        avgOrderValue,
      });
    }
  }, [clients]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Clients</h1>
        <p className="text-muted-foreground mt-1">
          View and manage customer information
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Total Clients
          </p>
          <p className="text-3xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Total Revenue
          </p>
          <p className="text-3xl font-bold text-foreground">
            Ar {stats.totalSpent}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Avg Order Value
          </p>
          <p className="text-3xl font-bold text-foreground">
            Ar {stats.avgOrderValue}
          </p>
        </div>
      </div>

      {/* Clients Table */}
      <ClientsTable clients={clients} isLoading={loading} />
    </div>
  );
}
