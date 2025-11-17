"use client";

import type { Client } from "@/hooks/use-clients";
import { Card } from "@/components/ui/card";

interface ClientsTableProps {
  clients: Client[];
  isLoading?: boolean;
}

export function ClientsTable({ clients, isLoading }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No clients found yet.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Email
              </th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Orders
              </th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Total Spent
              </th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">
                Member Since
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-muted/50">
                <td className="px-6 py-4 text-foreground">{client.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    {client.orderCount}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-foreground">
                  Ar {client.totalSpent}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
