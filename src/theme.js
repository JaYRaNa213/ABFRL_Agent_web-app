import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#FFE600", // EY Yellow
            contrastText: "#000000",
        },
        secondary: {
            main: "#000000", // Black
        },
        background: {
            default: "#000000", // Black background
            paper: "#2E2E2E",   // Medium Gray for cards
        },
        text: {
            primary: "#FFFFFF", // White text
            secondary: "#B3B3B3", // Muted Gray
        },
        divider: "rgba(255, 255, 255, 0.08)", // EY Border
    },
    typography: {
        fontFamily: "'Inter', sans-serif",
        h6: {
            fontWeight: 600,
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
    },
});
