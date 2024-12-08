const API_URL = "http://localhost:3001";

export const getParticipants = async () => {
  const response = await fetch(`${API_URL}/participants`);
  return response.json();
};

export const addWishlist = async (name, wishlist) => {
  const response = await fetch(`${API_URL}/addWishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, wishlist }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al guardar la lista de deseos.");
  }

  return response.json();
};

export const drawParticipant = async (excludeName) => {
  const response = await fetch(`${API_URL}/draw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ excludeName }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error al realizar el sorteo.");
  }

  return response.json();
};
