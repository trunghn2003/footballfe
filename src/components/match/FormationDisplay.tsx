import React from "react";
import { Box, Typography, Paper } from "@mui/material";

interface Player {
  id: number;
  position: string | null;
  name: string;
  shirt_number: number;
  is_substitute: number;
  grid?: string; // Represents player's row:column position
}

interface FormationDisplayProps {
  homeLineup: {
    formation: string;
    startXI: { [key: string]: Player };
  };
  awayLineup: {
    formation: string;
    startXI: { [key: string]: Player };
  };
}

const FormationDisplay = ({ homeLineup, awayLineup }: FormationDisplayProps) => {
  /**
   * Calculates the position of a player on the field based on their `grid` and lineup context.
   * Properly fits players within the football field boundaries.
   */
  const calculatePosition = (
    grid: string,
    isHome: boolean,
    lineup: { startXI: { [key: string]: Player } }
  ) => {
    const [horizontal, vertical] = grid.split(":").map(Number);

    // Restrict grid values to prevent players from exceeding the field bounds
    const clampedHorizontal = Math.max(1, Math.min(horizontal, 4)); // Up to 4 rows
    const clampedVertical = Math.max(1, Math.min(vertical, 10)); // Up to 10 columns per row

    // Calculate horizontal (row) placement
    let horizontalPercentage;
    if (isHome) {
      // Home team: left side of the field
      switch (clampedHorizontal) {
        case 1: // Goalkeeper
          horizontalPercentage = 5; // Very close to left edge
          break;
        case 2: // Defenders
          horizontalPercentage = 15; // Defender line
          break;
        case 3: // Midfielders
          horizontalPercentage = 30; // Midfielder line
          break;
        case 4: // Forwards
          horizontalPercentage = 45; // Forward line - slightly before half line
          break;
        default:
          horizontalPercentage = 25;
      }
    } else {
      // Away team: right side of the field
      switch (clampedHorizontal) {
        case 1: // Goalkeeper
          horizontalPercentage = 95; // Very close to right edge
          break;
        case 2: // Defenders
          horizontalPercentage = 85; // Defender line
          break;
        case 3: // Midfielders
          horizontalPercentage = 70; // Midfielder line
          break;
        case 4: // Forwards
          horizontalPercentage = 55; // Forward line - slightly after half line
          break;
        default:
          horizontalPercentage = 75;
      }
    }

    // Calculate vertical (column) placement
    let verticalPercentage;

    // Determine number of players in this row to distribute them evenly
    const playersInRow = Object.values(isHome ? homeLineup.startXI : awayLineup.startXI)
      .filter(p => p.grid && p.grid.split(":")[0] === String(clampedHorizontal))
      .length;

    if (playersInRow === 1) {
      // If only one player in this row (like GK), center them
      verticalPercentage = 50;
    } else {
      // For goalkeeper (1.1), always center regardless
      if (clampedHorizontal === 1 && clampedVertical === 1) {
        verticalPercentage = 50;
      } else {
        // Calculate spacing based on number of players in the row
        // Ensure we stay within 15% to 85% of vertical space for better visibility
        const verticalSpacing = 70 / Math.max(playersInRow - 1, 1);
        verticalPercentage = 15 + (verticalSpacing * (clampedVertical - 1));
      }
    }

    return {
      left: `${horizontalPercentage}%`,
      top: `${verticalPercentage}%`,
    };
  };

  /**
   * Renders an individual player on the field.
   */
  const renderPlayer = (
    player: Player,
    isHome: boolean,
    lineup: { startXI: { [key: string]: Player } }
  ) => {
    if (!player.grid) return null;

    const { top, left } = calculatePosition(player.grid, isHome, lineup);

    // Determine player abbreviation based on position
    let positionAbbr = "";
    if (player.position) {
      if (player.position.includes("Goalkeeper")) positionAbbr = "GK";
      else if (player.position.includes("Defender")) positionAbbr = "DEF";
      else if (player.position.includes("Midfielder")) positionAbbr = "MID";
      else if (player.position.includes("Forward") || player.position.includes("Striker")) positionAbbr = "FWD";
      else positionAbbr = player.position.slice(0, 3);
    }

    return (
      <Box
        key={player.id}
        sx={{
          position: "absolute",
          top,
          left,
          transform: "translate(-50%, -50%)",
          width: "36px",
          height: "36px",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: isHome ? "#9ccc65" : "#90caf9", // Differentiates home and away players
            clipPath: "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          <Typography variant="caption" sx={{ fontSize: "0.7rem", lineHeight: 1 }}>
            {player.shirt_number}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: "0.6rem", lineHeight: 1 }}>
            {positionAbbr}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: "#1b5e20", // Dark green background for contrast
      }}
    >
      {/* Formation Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ color: "white", fontWeight: "bold" }}>
          FORMATION: {homeLineup.formation}
        </Typography>
        <Typography sx={{ color: "white", fontWeight: "bold" }}>
          FORMATION: {awayLineup.formation}
        </Typography>
      </Box>

      {/* Field */}
      <Box
        sx={{
          position: "relative",
          height: "500px",
          border: "2px solid white",
          borderRadius: "4px",
          backgroundColor: "#2e7d32", // Green field color
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 49px,
              rgba(255, 255, 255, 0.1) 49px,
              rgba(255, 255, 255, 0.1) 50px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 49px,
              rgba(255, 255, 255, 0.1) 49px,
              rgba(255, 255, 255, 0.1) 50px
            )
          `,
        }}
      >
        {/* Center Circle */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100px",
            height: "100px",
            border: "1px solid rgba(255,255,255,0.5)",
            borderRadius: "50%",
          }}
        />

        {/* Center Line */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: "1px",
            backgroundColor: "rgba(255,255,255,0.5)",
          }}
        />

        {/* Goal Areas */}
        <Box
          sx={{
            position: "absolute",
            top: "35%",
            left: 0,
            width: "10%",
            height: "30%",
            border: "1px solid rgba(255,255,255,0.5)",
            borderLeft: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "35%",
            right: 0,
            width: "10%",
            height: "30%",
            border: "1px solid rgba(255,255,255,0.5)",
            borderRight: "none",
          }}
        />

        {/* Penalty Areas */}
        <Box
          sx={{
            position: "absolute",
            top: "25%",
            left: 0,
            width: "15%",
            height: "50%",
            border: "1px solid rgba(255,255,255,0.5)",
            borderLeft: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "25%",
            right: 0,
            width: "15%",
            height: "50%",
            border: "1px solid rgba(255,255,255,0.5)",
            borderRight: "none",
          }}
        />

        {/* Corner Arcs */}
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: "20px",
              height: "20px",
              border: "1px solid rgba(255,255,255,0.5)",
              borderRadius: "50%",
              ...{
                0: { top: 0, left: 0, borderTopLeftRadius: 0 },
                1: { top: 0, right: 0, borderTopRightRadius: 0 },
                2: { bottom: 0, left: 0, borderBottomLeftRadius: 0 },
                3: { bottom: 0, right: 0, borderBottomRightRadius: 0 },
              }[i],
            }}
          />
        ))}

        {/* Players */}
        {Object.values(homeLineup.startXI).map((player) =>
          renderPlayer(player, true, homeLineup)
        )}
        {Object.values(awayLineup.startXI).map((player) =>
          renderPlayer(player, false, awayLineup)
        )}
      </Box>
    </Paper>
  );
};

export default FormationDisplay;
