"use client";

import { useState, useEffect } from "react";
import { useOrders } from "@/hooks/use-orders";
import { OrdersTable } from "@/components/orders-table";
import { OrderDetailsModal } from "@/components/order-details-modal";
import type { Order } from "@/hooks/use-orders";

export default function OrdersPage() {
  const { orders, loading, fetchOrders, acceptOrder, deleteOrder } =
    useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleAcceptOrder = async (orderId: string) => {
    if (confirm("Accept this order?")) {
      await acceptOrder(orderId);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm("Delete this order?")) {
      await deleteOrder(orderId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track customer orders
        </p>
      </div>

      {/* Filters - placeholder for future enhancement */}
      <div className="flex gap-3">
        <div className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium cursor-pointer hover:bg-muted/80">
          All Orders ({orders.length})
        </div>
        <div className="px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground text-sm font-medium cursor-pointer hover:bg-muted">
          Pending (
          {orders.filter((o) => o.statutPaiement === "EN_ATTENTE").length})
        </div>
        <div className="px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground text-sm font-medium cursor-pointer hover:bg-muted">
          Accepted (
          {orders.filter((o) => o.statutPaiement === "ACCEPTE").length})
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        onViewDetails={setSelectedOrder}
        onAccept={handleAcceptOrder}
        onDelete={handleDeleteOrder}
        isLoading={loading}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
