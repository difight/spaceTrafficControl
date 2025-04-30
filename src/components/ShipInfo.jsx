// src/components/ShipInfo.jsx
import React, { useEffect, useState } from "react";
import { EventBus } from "../game/EventBus";

const ShipInfo = () => {
  const [ship, setShip] = useState(null);

  useEffect(() => {
    const listener = (shipData) => {
      setShip(shipData);
    };

    EventBus.on("ship-info", listener); // Слушаем событие

    return () => {
      EventBus.off("ship-info", listener); // Удаляем подписку
    };
  }, []);

  return (
    <div style={{
      position: "absolute",
      left: (ship) ? ship.x : 0,
      top: (ship) ? ship.y - 50 : 0,
      backgroundColor: "#000000",
      color: "#ffffff",
      padding: "10px",
      pointerEvents: "none",
      display: (ship) ? "block" : "none"
    }}
    >
      {ship && (
        <div>
          <p>Корабль: {ship.id}</p>
          <p>Позиция: ({ship.x}, {ship.y})</p>
        </div>
      )}
    </div>
  );
};

export default ShipInfo;