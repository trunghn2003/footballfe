import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';

interface Player {
  id: number;
  position: string | null;
  name: string;
  shirt_number: number;
  is_substitute: number;
  grid?: string; // Represents player's row:column position
  statistics: {
    rating?: number;
    [key: string]: any;
  };
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
  const getRatingColor = (rating: number | undefined) => {
    if (!rating) return '#9e9e9e'; // Default gray for no rating

    if (rating >= 8.0) return '#2196f3'; // Blue for excellent
    if (rating >= 7.0) return '#8bc34a'; // Light green for good
    if (rating >= 6.0) return '#ffc107'; // Yellow for average
    if (rating >= 5.0) return '#ff9800'; // Orange for below average
    return '#f44336'; // Red for poor
  };

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

  const formatPlayerName = (name: string) => {
    const parts = name.split(' ');
    if (parts.length === 1) return name;
    return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
  };

  // Find MOTM across both teams
  const findOverallMOTM = () => {
    const allPlayers = [...Object.values(homeLineup.startXI), ...Object.values(awayLineup.startXI)];
    return allPlayers.reduce((highest, current) => {
      const currentRating = current.statistics?.rating || 0;
      const highestRating = highest?.statistics?.rating || 0;
      return currentRating > highestRating ? current : highest;
    });
  };

  const overallMOTM = findOverallMOTM();

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
    const rating = player.statistics?.rating;
    const ratingColor = getRatingColor(rating);
    const isMOTM = player.id === overallMOTM.id;

    return (
      <Box
        key={player.id}
        sx={{
          position: "absolute",
          top,
          left,
          transform: "translate(-50%, -50%)",
          width: "64px",
          height: "64px",
          zIndex: 1,
        }}
      >
        {rating && (
          <Box
            sx={{
              position: "absolute",
              top: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              fontSize: "0.8rem",
              fontWeight: "bold",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              minWidth: "32px",
              textAlign: "center"
            }}
          >
            {rating.toFixed(1)}
          </Box>
        )}
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: ratingColor,
            borderRadius: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            border: "2px solid white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            "&:hover": {
              transform: "scale(1.1)",
              zIndex: 2,
            },
          }}
        >
          {isMOTM && (
            <StarIcon
              sx={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                color: '#FFD700',
                fontSize: '24px',
                filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.3))'
              }}
            />
          )}
          <Typography
            variant="caption"
            sx={{
              fontSize: "0.7rem",
              lineHeight: 1.2,
              maxWidth: "56px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textAlign: "center",
              padding: "0 4px"
            }}
          >
            {formatPlayerName(player.name)}
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
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto"
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
          height: "80vh",
          width: "100%",
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
            width: "150px",
            height: "150px",
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
              width: "30px",
              height: "30px",
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

      {/* Rating Legend */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#4caf50', borderRadius: '50%' }} />
          <Typography variant="caption" sx={{ color: 'white' }}>8.0+</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#8bc34a', borderRadius: '50%' }} />
          <Typography variant="caption" sx={{ color: 'white' }}>7.0-7.9</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#ffc107', borderRadius: '50%' }} />
          <Typography variant="caption" sx={{ color: 'white' }}>6.0-6.9</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#ff9800', borderRadius: '50%' }} />
          <Typography variant="caption" sx={{ color: 'white' }}>5.0-5.9</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#f44336', borderRadius: '50%' }} />
          <Typography variant="caption" sx={{ color: 'white' }}>&lt;5.0</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default FormationDisplay;
