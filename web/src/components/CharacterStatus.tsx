import React, { useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { debugData } from "../utils/debugData";
import HeartIcon from "@mui/icons-material/FavoriteRounded";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import { keyframes } from "@mui/system";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./Theme";
import "./App.css";

debugData([
  {
    action: "UpdatePlayerStatus",
    data: {
      visible: true,
      health: 100,
      armor: 0,
      hunger: 94,
      thirst: 93,
    },
  },
]);

debugData([
  {
    action: "FlashUIData",
    data: true,
  },
]);

const pulse = keyframes`
  from {
    transform: rotate(1.0);
  }
  to {
    transform: scale(0.97);
    color: red;
    -webkit-filter: drop-shadow(0px 0px 8px red);
  }
`;

interface CharacterStatusProps {
  visible: boolean;
  health: number;
  armor: number;
  hunger: number;
  thirst: number;
}

const CharacterStatus: React.FC = () => {
  const [UIVisible, setUIVisible] = useState(false);
  const [playerHealth, setPlayerHealth] = useState(0);
  const [playerArmor, setPlayerArmor] = useState(0);
  const [playerHunger, setPlayerHunger] = useState(0);
  const [playerThirst, setPlayerThirst] = useState(0);

  const [playerHungerVisibility, setPlayerHungerVisibility] = useState(false);
  const [playerThirstVisibility, setPlayerThirstVisibility] = useState(false);
  const [valueVisibility, setValueVisibility] = useState(false);

  useNuiEvent<CharacterStatusProps>("UpdatePlayerStatus", (data) => {
    setUIVisible(data.visible);
    setPlayerHealth(data.health);
    setPlayerArmor(data.armor);
    setPlayerHunger(data.hunger);
    setPlayerThirst(data.thirst);
  });
  const [handle, setHandle] = useState<NodeJS.Timeout>();
  useNuiEvent("FlashUIData", (data: any) => {
    if (valueVisibility) {
      setValueVisibility(false);
    } else {
      if (handle) clearTimeout(handle);
      setValueVisibility(true);
      setHandle(setTimeout(() => setValueVisibility(false), 3000));
    }
  });

  function ReturnAnimSpeed(status: any) {
    let numvar = new Number(0.01);
    let playervar = new Number(status);
    let stringifiednumvar = numvar.toString();
    let stringifiedplayervar = playervar.toString();
    let ans = stringifiednumvar + stringifiedplayervar;
    let ans_final = Number(ans);
    let animspeed = status * ans_final;
    if (status != 0) {
      return animspeed + 0.25;
    } else {
      return null;
    }
  }

  function ReturnStatusAnimSpeed(props: string) {
    if (props == "hunger") {
      if (playerHunger > 75) {
        return `${pulse} 1.0s infinite ease`;
      } else {
        return null;
      }
    } else {
      if (playerThirst > 75) {
        return `${pulse} 1.0s infinite ease`;
      } else {
        return null;
      }
    }
  }

  function HandlePlayerStatus() {
    if (playerThirst > 25) {
      setPlayerThirstVisibility(true);
    } else {
      setPlayerThirstVisibility(false);
    }
    if (playerHunger > 25) {
      setPlayerHungerVisibility(true);
    } else {
      setPlayerHungerVisibility(false);
    }

    function PlayerUIValues() {
      return (
        <>
          <ThemeProvider theme={theme}>
            <div className="UIValueContainer">
              {playerHealth ? (
                <span
                  style={{ color: theme.statuses.heart.color }}
                  className="playerUIValue-health"
                >{`${playerHealth}%`}</span>
              ) : (
                <span
                  style={{ color: theme.statuses.heart.hurtColor }}
                  className="playerUIValue-health"
                >{`${playerHealth}%`}</span>
              )}
              <span
                style={{ color: theme.statuses.armor.color }}
                className="playerUIValue-armor"
              >{`${playerArmor}%`}</span>
              <span
                style={{ color: theme.statuses.thirst.color }}
                className="playerUIValue-thirst"
              >{`${playerThirst}%`}</span>
              <span
                style={{ color: theme.statuses.hunger.color }}
                className="playerUIValue-hunger"
              >{`${playerHunger}%`}</span>
            </div>

            {playerArmor ? (
              <HealthAndSafetyIcon
                sx={{
                  fontSize: theme.statuses.thirst.size,
                  color: theme.statuses.armor.color,
                  animation: `${pulse} ${ReturnAnimSpeed(
                    playerArmor
                  )}s infinite ease`,
                }}
                className="armor-element-small"
              />
            ) : (
              <HealthAndSafetyIcon
                sx={{
                  fontSize: theme.statuses.thirst.size,
                  color: theme.statuses.armor.color,
                }}
                className="armor-element-small"
              />
            )}

            {playerHealth <= 0 ? (
              <HeartBrokenIcon
                sx={{
                  fontSize: theme.statuses.death.size,
                  color: theme.statuses.death.color,
                }}
                className="death-element"
              />
            ) : playerHealth ? (
              <HeartIcon
                sx={{
                  fontSize: theme.statuses.heart.size,
                  color: theme.statuses.heart.color,
                }}
                className="heart-element"
              />
            ) : (
              <HeartIcon
                sx={{
                  fontSize: theme.statuses.heart.size,
                  color: theme.statuses.heart.color,
                  animation: `${pulse} ${ReturnAnimSpeed(
                    playerHealth
                  )}s infinite ease`,
                }}
                className="heart-element"
              />
            )}

            {playerHunger ? (
              <RestaurantMenuRoundedIcon
                sx={{
                  fontSize: theme.statuses.hunger.size,
                  color: theme.statuses.hunger.color,
                  animation: ReturnStatusAnimSpeed("hunger"),
                }}
                className="hunger-element"
              />
            ) : (
              <RestaurantMenuRoundedIcon
                sx={{
                  fontSize: theme.statuses.hunger.size,
                  color: theme.statuses.hunger.color,
                }}
                className="hunger-element"
              />
            )}

            {playerThirst ? (
              <WaterDropIcon
                sx={{
                  fontSize: theme.statuses.thirst.size,
                  color: theme.statuses.thirst.color,
                  animation: ReturnStatusAnimSpeed("thirst"),
                }}
                className="thirst-element"
              />
            ) : (
              <WaterDropIcon
                sx={{
                  fontSize: theme.statuses.thirst.size,
                  color: theme.statuses.thirst.color,
                }}
                className="thirst-element"
              />
            )}
          </ThemeProvider>
        </>
      );
    }

    return (
      <>
        <ThemeProvider theme={theme}>
          {valueVisibility ? (
            <PlayerUIValues />
          ) : (
            <>
              {playerHealth <= 0 ? (
                <HeartBrokenIcon
                  sx={{
                    fontSize: theme.statuses.death.size,
                    color: theme.statuses.death.color,
                  }}
                  className="death-element"
                />
              ) : playerHealth <= 90 && playerArmor <= 90 ? (
                <>
                  {playerHealth > 0 && playerArmor > 0 ? (
                    <>
                      <HeartIcon
                        sx={{
                          fontSize: theme.statuses.heart.size,
                          color: theme.statuses.heart.color,
                          animation: `${pulse} ${ReturnAnimSpeed(
                            playerHealth
                          )}s infinite ease`,
                        }}
                        className="heart-element"
                      />
                      <HealthAndSafetyIcon
                        sx={{
                          fontSize: theme.statuses.thirst.size,
                          color: theme.statuses.armor.color,
                          animation: `${pulse} ${ReturnAnimSpeed(
                            playerArmor
                          )}s infinite ease`,
                        }}
                        className="armor-element-small"
                      />
                    </>
                  ) : (
                    <>
                      <HeartIcon
                        sx={{
                          fontSize: theme.statuses.heart.size,
                          color: theme.statuses.heart.color,
                          animation: `${pulse} ${ReturnAnimSpeed(
                            playerHealth
                          )}s infinite ease`,
                        }}
                        className="heart-element"
                      />
                    </>
                  )}
                </>
              ) : playerArmor > 0 && playerHealth > 90 ? (
                <>
                  {playerArmor < 90 ? (
                    <HealthAndSafetyIcon
                      sx={{
                        fontSize: theme.statuses.armor.size,
                        color: theme.statuses.armor.color,
                        animation: `${pulse} ${ReturnAnimSpeed(
                          playerArmor
                        )}s infinite ease`,
                      }}
                      className="armor-element"
                    />
                  ) : (
                    <HealthAndSafetyIcon
                      sx={{
                        fontSize: theme.statuses.armor.size,
                        color: theme.statuses.armor.color,
                      }}
                      className="armor-element"
                    />
                  )}
                </>
              ) : (
                <>
                  {playerHealth < 90 && playerArmor > 90 ? (
                    <>
                      <HeartIcon
                        sx={{
                          fontSize: theme.statuses.heart.size,
                          color: theme.statuses.heart.color,
                          animation: `${pulse} ${ReturnAnimSpeed(
                            playerHealth
                          )}s infinite ease`,
                        }}
                        className="heart-element"
                      />
                      {playerArmor < 90 ? (
                        <HealthAndSafetyIcon
                          sx={{
                            fontSize: theme.statuses.thirst.size,
                            color: theme.statuses.armor.color,
                            animation: `${pulse} ${ReturnAnimSpeed(
                              playerArmor
                            )}s infinite ease`,
                          }}
                          className="armor-element-small"
                        />
                      ) : (
                        <HealthAndSafetyIcon
                          sx={{
                            fontSize: theme.statuses.thirst.size,
                            color: theme.statuses.armor.color,
                          }}
                          className="armor-element-small"
                        />
                      )}
                    </>
                  ) : (
                    <HeartIcon
                      sx={{
                        fontSize: theme.statuses.heart.size,
                        color: theme.statuses.heart.color,
                      }}
                      className="heart-element"
                    />
                  )}
                </>
              )}

              {playerThirstVisibility ? (
                <WaterDropIcon
                  sx={{
                    fontSize: theme.statuses.thirst.size,
                    color: theme.statuses.thirst.color,
                    animation: ReturnStatusAnimSpeed("thirst"),
                  }}
                  className="thirst-element"
                />
              ) : null}

              {playerHungerVisibility ? (
                <RestaurantMenuRoundedIcon
                  sx={{
                    fontSize: theme.statuses.hunger.size,
                    color: theme.statuses.hunger.color,
                    animation: ReturnStatusAnimSpeed("hunger"),
                  }}
                  className="hunger-element"
                />
              ) : null}
            </>
          )}
        </ThemeProvider>
      </>
    );
  }

  return <>{UIVisible ? <HandlePlayerStatus /> : null}</>;
};

export default CharacterStatus;
