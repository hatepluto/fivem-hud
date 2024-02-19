import React, { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { debugData } from "../utils/debugData";
import { ThemeProvider } from "@mui/material/styles";
import Fade from "@mui/material/Fade";
import theme from "./Theme";
import "./App.css";

debugData([
  {
    action: "UpdateReticuleStatus",
    data: true,
  },
]);

const ReticuleStatus: React.FC = () => {
  const [UIVisible, setUIVisible] = useState(false);

  useNuiEvent("UpdateReticuleStatus", (data) => {
    setUIVisible(data);
  });

  function HandleReticule() {
    return (
      <ThemeProvider theme={theme}>
        <Fade in={UIVisible} timeout={500}>
          <div
            className="reticule"
            style={{
              background: theme.reticule.color,
            }}
          ></div>
        </Fade>
      </ThemeProvider>
    );
  }

  return <>{UIVisible ? <HandleReticule /> : null}</>;
};

export default ReticuleStatus;
