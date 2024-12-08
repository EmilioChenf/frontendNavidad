import React, { useState, useEffect } from "react";
import { getParticipants, addWishlist, drawParticipant } from "./api";

function App() {
  const [participants, setParticipants] = useState([]);
  const [selectedName, setSelectedName] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [message, setMessage] = useState("");
  const [drawResult, setDrawResult] = useState(null);
  const [hasDrawn, setHasDrawn] = useState(false);  // Estado para controlar si el usuario ya ha sorteado

  useEffect(() => {
    const fetchParticipants = async () => {
      const data = await getParticipants();
      setParticipants(data);
    };

    fetchParticipants();
  }, []);

  // Verificamos si el participante seleccionado ya ha realizado el sorteo
  useEffect(() => {
    if (selectedName) {
      const participant = participants.find((p) => p.name === selectedName);
      if (participant && participant.hasDrawn) {
        setHasDrawn(true);
      } else {
        setHasDrawn(false);
      }
    }
  }, [selectedName, participants]);

  const handleAddWishlist = async () => {
    try {
      await addWishlist(selectedName, wishlist);
      setMessage("Lista de deseos guardada correctamente.");
      setWishlist([]);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDraw = async () => {
    try {
      const result = await drawParticipant(selectedName);
      setDrawResult(result);
      setMessage("");
      setHasDrawn(true);  // Actualizamos el estado para indicar que ya sorteó
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Sorteo de Navidad</h1>
      <label>
        Escoge tu nombre:
        <select
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
        >
          <option value="">Escoge tu nombre</option>
          {participants.map((participant) => (
            <option key={participant.id} value={participant.name}>
              {participant.name}
            </option>
          ))}
        </select>
      </label>

      <h2>Lista de deseos</h2>
      <textarea
        value={wishlist.join(", ")}
        onChange={(e) => setWishlist(e.target.value.split(",").map((item) => item.trim()))}
        placeholder="Ingresa tus deseos separados por comas (máximo 10)"
      />
      <button onClick={handleAddWishlist} disabled={!selectedName || wishlist.length === 0}>
        Guardar lista de deseos
      </button>

      {message && <p>{message}</p>}

      <button onClick={handleDraw} disabled={!selectedName || hasDrawn}>
        Realizar Sorteo
      </button>

      {drawResult && (
        <div>
          <h2>¡Resultado del Sorteo!</h2>
          <p>El participante seleccionado es: {drawResult.name}</p>
          <h3>Lista de deseos:</h3>
          <ul>
            {drawResult.wishlist.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
