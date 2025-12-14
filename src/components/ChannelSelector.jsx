import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import StorefrontIcon from "@mui/icons-material/Storefront";

export default function ChannelSelector({ current, onChange }) {
  return (
    <FormControl size="small" sx={{ minWidth: 120, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 1 }}>
      <Select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        sx={{
          color: "white",
          ".MuiSelect-icon": { color: "white" },
          "& .MuiOutlinedInput-notchedOutline": { border: "none" }
        }}
      >
        <MenuItem value="web">
          <Box display="flex" alignItems="center" gap={1}>
            <LanguageIcon fontSize="small" /> Web
          </Box>
        </MenuItem>
        <MenuItem value="whatsapp">
          <Box display="flex" alignItems="center" gap={1}>
            <WhatsAppIcon fontSize="small" /> WhatsApp
          </Box>
        </MenuItem>
        <MenuItem value="kiosk">
          <Box display="flex" alignItems="center" gap={1}>
            <StorefrontIcon fontSize="small" /> Kiosk
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
}
import { Box } from "@mui/material";
