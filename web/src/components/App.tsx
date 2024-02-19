import React, { useState } from "react";
import "./App.css";
import { debugData } from "../utils/debugData";
import { fetchNui } from "../utils/fetchNui";

import VoiceStatus from "./VoiceStatus";
import AmmoStatus from "./Ammo";
import ReticuleStatus from "./Reticule";
import CharacterStatus from "./CharacterStatus";

// This will set the NUI to visible if we are
// developing in browser
debugData([
  {
    action: "setVisible",
    data: true,
  },
]);

const App: React.FC = () => {
  return (
    <div className="nui-wrapper">
      <VoiceStatus />
      <CharacterStatus />
      <AmmoStatus />
      <ReticuleStatus />
    </div>
  );
};

export default App;
