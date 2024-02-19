import React, { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { debugData } from "../utils/debugData";
import "./App.css";

debugData([
  {
    action: "UpdateAmmoStatus",
    data: {
      visible: true,
      ammo: 99,
      clipammo: 9999,
    },
  },
]);

interface AmmoStatusProps {
  visible: boolean;
  ammo: number;
  clipammo: number;
}

const AmmoStatus: React.FC = () => {
  const [ammoState, setAmmoState] = useState(10);
  const [clipammoState, setClipAmmoState] = useState(10);
  const [UIVisible, setUIVisible] = useState(false);

  useNuiEvent<AmmoStatusProps>("UpdateAmmoStatus", (data) => {
    setUIVisible(data.visible);
    setAmmoState(data.ammo);
    setClipAmmoState(data.clipammo);
  });

  function HandleAmmo() {
    return (
      <>
        <div className="ammo">
          <div>
            {ammoState}
            {"/"}
            <span
              style={{
                color: "rgba(64, 64, 64, 1.0)",
              }}
            >
              {clipammoState}
            </span>{" "}
          </div>
        </div>
      </>
    );
  }

  return <>{UIVisible ? <HandleAmmo /> : null}</>;
};

export default AmmoStatus;
