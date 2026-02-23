import { createTheme } from "@mui/material/styles";

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    run: true;
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#00111d",
    },
    primary: {
      main: "#369d99",
    },
    secondary: {
      main: "#cba6f7",
    },
    error: {
      main: "#f38ba8",
    },
    text: {
      primary: "#cdd6f4",
    },
    divider: "#313244",
  },
  typography: {
    fontFamily: "Inter, Avenir, Helvetica, Arial, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body, #root": {
          height: "100%",
          overflow: "hidden",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {          
          backgroundColor: "#00111d",
          boxShadow: "none",       
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "auto !important",
          padding: "8px 12px !important",
          gap: "8px",
        },

      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "13px",
          padding: "6px 14px",
          borderRadius: "6px",
        },
        outlined: {
          "&:hover": {
            backgroundColor: "#369d99",
            color: "white",
          },
        },
      },
      variants: [
        {
          props: { variant: "run" },
          style: {
            color: "#fff",
            fontWeight: 600,
            fontSize: "14px",
            padding: "6px 10px 6px 14px",
            borderRadius: "8px",
            gap: "8px",
            background: "linear-gradient(135deg, #3BA7A0 0%, #0F4C5C 100%)",
            boxShadow: "0 2px 8px 0 rgba(59, 167, 160, 0.30)",
            border: "none",
            "&:hover": {
              background: "linear-gradient(135deg, #45b8b0 0%, #145e6f 100%)",
              boxShadow: "0 3px 12px 0 rgba(59, 167, 160, 0.40)",
            },
          },
        },
      ],
    },
    MuiAlert: {
      styleOverrides: {
        standardError: {
          backgroundColor: "rgba(243, 139, 168, 0.1)",
          border: "1px solid #f38ba8",
          borderRadius: "8px",
          maxWidth: "600px",
          width: "100%",
          "& .MuiAlert-message pre": {
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: "12px",
            color: "#f38ba8",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            margin: 0,
            lineHeight: 1.5,
          },
        },
      },
    },
  },
});

export default theme;
