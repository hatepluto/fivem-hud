import React, { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { debugData } from "../utils/debugData";
import shout from "../assets/shout.png";
import normal from "../assets/normal.png";
import whisper from "../assets/whisper.png";
import radio_logo from "../assets/radio.png";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme";
import "./App.css";

debugData([
  {
    action: "UpdateVoiceStatus",
    data: {
      voiceLevel: 3,
      isTalking: true,
      radioActive: true,
    },
  },
]);

interface VoiceStatusProps {
  voiceLevel: number;
  isTalking: boolean;
  radioActive: boolean;
}

const VoiceStatus: React.FC = () => {
  const [voiceLevelState, setVoiceLevelState] = useState(2); // Use 2 as default(normal)
  const [isTalking, setIsTalking] = useState(false); // Setting to default(false)
  const [isRadioActive, setIsRadioActive] = useState(false);

  // Setting Voice Level State Sent From Client
  useNuiEvent<VoiceStatusProps>("UpdateVoiceStatus", (data) => {
    setVoiceLevelState(data.voiceLevel);
    setIsTalking(data.isTalking);
    setIsRadioActive(data.radioActive);
  });

  function returnVoiceData(props: any) {
    if (props == 1) {
      return whisper;
    } else if (props == 2) {
      return normal;
    } else {
      return shout;
    }
  }

  // Icon Handler
  function SpeakingIconHandler(props: any) {
    if (isTalking && voiceLevelState !== null) {
      return (
        <ThemeProvider theme={theme}>
          <img
            style={{ filter: theme.voice.speakingFilter }}
            src={returnVoiceData(voiceLevelState)}
          />
        </ThemeProvider>
      );
    }
    return <img src={returnVoiceData(voiceLevelState)} />;
  }

  function RadioIconHandler(props: any) {
    if (isRadioActive) {
      return <img src={radio_logo} />;
    }
    return null;
  }

  return (
    <>
      <span className="voice">
        <SpeakingIconHandler />
      </span>
      <span className="radio">
        <RadioIconHandler />
      </span>
    </>
  );
};

export default VoiceStatus;
