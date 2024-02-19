import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
declare module "@mui/material/styles" {
  interface Theme {
    reticule: {
      color: string;
    };
    voice: {
      speakingFilter: string;
    };
    statuses: {
      hunger: {
        color: string;
        size: number;
      };
      thirst: {
        color: string;
        size: number;
      };
      heart: {
        color: string;
        size: number;
        hurtColor: string;
      };
      armor: {
        color: string;
        size: number;
      };
      death: {
        color: string;
        size: number;
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    reticule?: {
      color?: string;
    };
    voice?: {
      speakingFilter?: string;
    };
    statuses?: {
      hunger?: {
        color?: string;
        size?: number;
      };
      thirst?: {
        color?: string;
        size?: number;
      };
      heart?: {
        color?: string;
        size?: number;
        hurtColor?: string;
      };
      armor?: {
        color?: string;
        size?: number;
      };
      death?: {
        color?: string;
        size?: number;
      };
    };
  }
}

const theme = createTheme({
  reticule: {
    color: grey[50],
  },
  voice: {
    speakingFilter: "drop-shadow(0px 0px 6px #f1f3f5)",
  },
  statuses: {
    hunger: {
      size: 35,
      color: "#ffc078",
    },
    thirst: {
      size: 35,
      color: "#228be6",
    },
    heart: {
      size: 75,
      color: "#69db7c",
      hurtColor: "red",
    },
    armor: {
      size: 75,
      color: "#1C7ED6",
    },
    death: {
      size: 75,
      color: "#F03E3E",
    },
  },
});

export default theme;
