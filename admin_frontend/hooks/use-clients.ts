"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";

export interface Client {
  id: string;
  email: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<Client[]>("/Authentication/client");

      if (!response.success) {
        throw new Error(response.error || "Failed to fetch clients");
      }

      // Filter out admins, show only regular clients
      setClients(
        (response.data || []).filter((c) => !c.email?.includes("admin"))
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch clients";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    clients,
    loading,
    error,
    fetchClients,
  };
};
