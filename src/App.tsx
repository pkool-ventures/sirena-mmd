import { useState, useCallback } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import sirenaLogo from "/src-tauri/icons/icon.svg";
import MermaidEditor from "./components/MermaidEditor";
import MermaidPreview from "./components/MermaidPreview";
import Stack from "@mui/material/Stack";

const DEFAULT_CODE = `graph TD
    A[Start] --> B{Entscheidung}
    B -->|Ja| C[Aktion 1]
    B -->|Nein| D[Aktion 2]
    C --> E[Ende]
    D --> E`;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [renderCode, setRenderCode] = useState(DEFAULT_CODE);
  const [renderKey, setRenderKey] = useState(0);
  const [showEditor, setShowEditor] = useState(true);

  const handleRun = useCallback(() => {
    setRenderCode(code);
    setRenderKey((k) => k + 1);
  }, [code]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.paper",
      }}
    >
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Box>
            <Stack direction="row" alignItems="center" gap={1}>
              <Box
                component="img"
                src={sirenaLogo}
                alt="Sirena"
                sx={{ height: 18 }}
              />
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "#cdd6f4",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontSize: "14px",
                    mt: "2px",
                  }}
                >
                  Sirena
                </Typography>
              </Box>
            </Stack>
          </Box>
          <Box
            sx={{
              ml: "auto",
              mr: 1,
              gap: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Button variant="outlined" onClick={() => setShowEditor((v) => !v)}>
              {showEditor ? "Editor ausblenden" : "Editor einblenden"}
            </Button>
            <Button variant="run" onClick={handleRun}>
              <PlayArrowRoundedIcon sx={{ fontSize: 18 }} />
              Run
              <Box
                component="span"
                sx={{
                  fontSize: "11px",
                  fontWeight: 500,
                  bgcolor: "rgba(255,255,255,0.15)",
                  px: "8px",
                  py: "2px",
                  borderRadius: "4px",
                }}
              >
                Ctrl+Enter
              </Box>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Box
          sx={{
            width: "50%",
            minWidth: 0,
            pt: 1,
            borderRight: 1,
            borderColor: "divider",
            overflow: "hidden",
            display: showEditor ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          <MermaidEditor value={code} onChange={setCode} onRun={handleRun} />
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: "auto",
            bgcolor: "background.paper",
          }}
        >
          <MermaidPreview code={renderCode} renderKey={renderKey} />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
