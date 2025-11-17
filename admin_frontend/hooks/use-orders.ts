"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export type OrderStatus = "ACCEPTE" | "EN_ATTENTE" | "SUPPRIMEE";

export interface OrderItem {
  productId: string;
  nomProduit: string;
  quantiteProduit: number;
  prixUnitaire: number;
}

export interface Order {
  id: string;
  userId: string;
  clientEmail: string;
  articles: OrderItem[];
  netAPayer: number;
  statutPaiement: OrderStatus;
  dateCommande: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    const user = localStorage.getItem("user") || "";
    try {
      const response = await apiClient.post<Order[]>(
        "/Cart/list-all-commande",
        {
          UserId: JSON.parse(user).id,
        }
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch orders");
      }
      setOrders(response.data || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch orders";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const acceptOrder = useCallback(
    async (orderId: string) => {
      setError(null);
      const user = localStorage.getItem("user") || "";
      try {
        const response = await apiClient.post(`/Cart/accept-commande`, {
          IdCommande: orderId,
          IdApprobateur: JSON.parse(user).id,
        });

        if (!response.success) {
          throw new Error(response.error || "Failed to accept order");
        }

        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, status: "ACCEPTED" as OrderStatus } : o
          )
        );
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to accept order";
        setError(message);
        return { success: false, error: message };
      }
    },
    [orders]
  );

  const deleteOrder = useCallback(
    async (orderId: string) => {
      setError(null);
      const user = localStorage.getItem("user") || "";

      try {
        const response = await apiClient.post(`/Cart/delete-commande`, {
          IdCommande: orderId,
          IdApprobateur: JSON.parse(user).id,
        });

        if (!response.success) {
          throw new Error(response.error || "Failed to delete order");
        }

        setOrders(
          orders.map((o) =>
            o.id === orderId ? { ...o, status: "DELETED" as OrderStatus } : o
          )
        );
        return { success: true };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete order";
        setError(message);
        return { success: false, error: message };
      }
    },
    [orders]
  );

  return {
    orders,
    loading,
    error,
    fetchOrders,
    acceptOrder,
    deleteOrder,
  };
};
