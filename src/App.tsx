import { useState, useCallback, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import sirenaLogo from "/src-tauri/icons/icon.svg";
import mermaid from "mermaid";
import MermaidEditor from "./components/MermaidEditor";
import MermaidPreview from "./components/MermaidPreview";
import TabBar from "./components/TabBar";
import type { Tab } from "./components/TabBar";
import Stack from "@mui/material/Stack";
import TemplateMenu from "./components/TemplateMenu";
import { Template } from "./components/type";

const STORAGE_KEY = "sirena-tabs";
const ACTIVE_TAB_KEY = "sirena-active-tab";

const DEFAULT_CODE = `graph TD
    A[Start] --> B{Entscheidung}
    B -->|Ja| C[Aktion 1]
    B -->|Nein| D[Aktion 2]
    C --> E[Ende]
    D --> E`;

let nextTabId = 1;

function createTab(name?: string, code = ""): Tab {
  const id = String(nextTabId++);
  return {
    id,
    name: name ?? `diagram-${id}.mmd`,
    code,
    renderCode: code,
    renderKey: 0,
  };
}

interface StoredTab {
  id: string;
  name: string;
  code: string;
}

function loadTabs(): { tabs: Tab[]; activeTabId: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored: StoredTab[] = JSON.parse(raw);
    if (!Array.isArray(stored) || stored.length === 0) return null;

    const maxId = Math.max(...stored.map((t) => Number(t.id) || 0));
    nextTabId = maxId + 1;

    const tabs: Tab[] = stored.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      renderCode: s.code,
      renderKey: 0,
    }));

    const savedActiveId = localStorage.getItem(ACTIVE_TAB_KEY);
    const activeTabId =
      tabs.find((t) => t.id === savedActiveId)?.id ?? tabs[0].id;

    return { tabs, activeTabId };
  } catch {
    return null;
  }
}

async function validateMermaid(code: string): Promise<boolean> {
  if (!code.trim()) return true;
  try {
    await mermaid.parse(code);
    return true;
  } catch {
    return false;
  }
}

async function saveTabs(tabs: Tab[], activeTabId: string) {
  const stored: StoredTab[] = await Promise.all(
    tabs.map(async (t) => {
      const valid = await validateMermaid(t.code);
      return { id: t.id, name: t.name, code: valid ? t.code : t.renderCode };
    }),
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  localStorage.setItem(ACTIVE_TAB_KEY, activeTabId);
}

function initState(): { tabs: Tab[]; activeTabId: string } {
  const loaded = loadTabs();
  if (loaded) return loaded;
  const tab = createTab("diagram.mmd", DEFAULT_CODE);
  return { tabs: [tab], activeTabId: tab.id };
}

const initial = initState();

function App() {
  const [tabs, setTabs] = useState<Tab[]>(initial.tabs);
  const [activeTabId, setActiveTabId] = useState(initial.activeTabId);
  const [showEditor, setShowEditor] = useState(true);
  const skipSave = useRef(true);

  // Persist tabs on change
  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    saveTabs(tabs, activeTabId);
  }, [tabs, activeTabId]);

  const activeTab = tabs.find((t) => t.id === activeTabId);
  const hasTabs = tabs.length > 0;

  const updateActiveTab = useCallback(
    (updater: (tab: Tab) => Tab) => {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? updater(t) : t)),
      );
    },
    [activeTabId],
  );

  const handleCodeChange = useCallback(
    (code: string) => {
      updateActiveTab((t) => ({ ...t, code }));
    },
    [updateActiveTab],
  );

  const handleRun = useCallback(() => {
    updateActiveTab((t) => ({
      ...t,
      renderCode: t.code,
      renderKey: t.renderKey + 1,
    }));
  }, [updateActiveTab]);

  const addTab = useCallback(() => {
    const tab = createTab();
    setTabs((prev) => [...prev, tab]);
    setActiveTabId(tab.id);
  }, []);

  const addTabFromTemplate = useCallback((template: Template) => {
    const tab = createTab(template.name, template.code);
    setTabs((prev) => [...prev, tab]);
    setActiveTabId(tab.id);
  }, []);

  const closeTab = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const next = prev.filter((t) => t.id !== id);
        if (id === activeTabId) {
          if (next.length === 0) {
            setActiveTabId("");
          } else {
            const idx = prev.findIndex((t) => t.id === id);
            const newIdx = Math.min(idx, next.length - 1);
            setActiveTabId(next[newIdx].id);
          }
        }
        return next;
      });
    },
    [activeTabId],
  );

  const renameTab = useCallback((id: string, name: string) => {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
  }, []);

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
            <TemplateMenu label="Vorlagen" onSelect={addTabFromTemplate} />
            <Button variant="outlined" onClick={() => setShowEditor((v) => !v)}>
              {showEditor ? "Editor ausblenden" : "Editor einblenden"}
            </Button>
            <Button variant="run" onClick={handleRun} disabled={!hasTabs}>
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
            borderRight: 1,
            borderColor: "divider",
            overflow: "hidden",
            display: showEditor ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onSwitch={setActiveTabId}
            onAdd={addTab}
            onClose={closeTab}
            onRename={renameTab}
          />
          {activeTab ? (
            <MermaidEditor
              key={activeTabId}
              value={activeTab.code}
              onChange={handleCodeChange}
              onRun={handleRun}
            />
          ) : (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                color: "#6c7086",
              }}
            >
              <Typography variant="body1" sx={{ color: "#6c7086" }}>
                Kein Diagramm geöffnet
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddRoundedIcon />}
                onClick={addTab}
              >
                Neues Diagramm erstellen
              </Button>
              <TemplateMenu
                label="Aus Vorlage erstellen"
                onSelect={addTabFromTemplate}
              />
            </Box>
          )}
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              height: 36,
              minHeight: 36,
              px: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Vorschau
            </Typography>
          </Box>
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {activeTab ? (
              <MermaidPreview
                code={activeTab.renderCode}
                renderKey={activeTab.renderKey}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#6c7086",
                }}
              >
                <Typography variant="body2">
                  Erstelle ein Diagramm, um die Vorschau zu sehen
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
