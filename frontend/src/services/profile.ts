import { API_URL } from "@/utils/api";

export interface ProfileDTO {
  userId: number;
  email: string;
  password?: string;
}

export async function updateProfile(data: ProfileDTO) {
  const res = await fetch(`${API_URL}/settings/change-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erreur lors de la mise à jour du profil");
  }
  return res.json();
}
export async function getLovedProduct(userId: number) {
  const res = await fetch(`${API_URL}/settings/get-loved-product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ UserId: userId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.message || "Erreur lors du chargement des produits favoris"
    );
  }
  return res.json();
}
export async function getLastProduct(userId: number) {
  const res = await fetch(`${API_URL}/settings/get-last-product`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ UserId: userId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.message || "Erreur lors du chargement des derniers produits"
    );
  }
  return res.json();
}
export async function toggleFavorite(userId: number, productId: number) {
  const response = await fetch(`${API_URL}/home/toggle-favorite`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ UserId: userId, ProductId: productId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Erreur lors du changement de favori");
  }

  return await response.json();
}
