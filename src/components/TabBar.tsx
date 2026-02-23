import { useState, useRef, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

export interface Tab {
  id: string;
  name: string;
  code: string;
  renderCode: string;
  renderKey: number;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSwitch: (id: string) => void;
  onAdd: () => void;
  onClose: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export default function TabBar({
  tabs,
  activeTabId,
  onSwitch,
  onAdd,
  onClose,
  onRename,
}: TabBarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const obs = new ResizeObserver(updateScrollState);
    obs.observe(el);
    return () => obs.disconnect();
  }, [updateScrollState, tabs.length]);

  // Scroll active tab into view
  useEffect(() => {
    if (!activeTabId) return;
    const tabEl = tabRefs.current.get(activeTabId);
    if (!tabEl) return;
    tabEl.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [activeTabId]);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -120 : 120, behavior: "smooth" });
  };

  const commitRename = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  const scrollBtnSx = {
    width: 24,
    height: 24,
    color: "#6c7086",
    flexShrink: 0,
    "&:hover": { color: "text.primary" },
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: 36,
        minHeight: 36,
        bgcolor: "#0a0a0a",
        borderBottom: 1,
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {canScrollLeft && (
        <IconButton size="small" onClick={() => scroll("left")} sx={scrollBtnSx}>
          <ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      )}
      <Box
        ref={scrollRef}
        onScroll={updateScrollState}
        sx={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          overflowX: "auto",
          overflowY: "hidden",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const hasUnsavedChanges = tab.code !== tab.renderCode;

          return (
            <Box
              key={tab.id}
              ref={(el: HTMLDivElement | null) => {
                if (el) tabRefs.current.set(tab.id, el);
                else tabRefs.current.delete(tab.id);
              }}
              onClick={() => onSwitch(tab.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.5,
                height: 36,
                cursor: "pointer",
                borderRight: 1,
                borderColor: "divider",
                bgcolor: isActive ? "#1a1a2e" : "transparent",
                borderBottom: isActive ? "2px solid" : "2px solid transparent",
                borderBottomColor: isActive ? "primary.main" : "transparent",
                "&:hover": {
                  bgcolor: isActive ? "#1a1a2e" : "#111122",
                },
                userSelect: "none",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: hasUnsavedChanges ? "#a6e3a1" : "transparent",
                  flexShrink: 0,
                }}
              />
              {editingId === tab.id ? (
                <Box
                  component="input"
                  ref={inputRef}
                  value={editValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditValue(e.target.value)
                  }
                  onBlur={commitRename}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  sx={{
                    background: "none",
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: "3px",
                    color: "text.primary",
                    fontSize: "12px",
                    fontFamily: "inherit",
                    px: 0.5,
                    py: 0,
                    width: 100,
                    outline: "none",
                  }}
                />
              ) : (
                <Typography
                  variant="caption"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingId(tab.id);
                    setEditValue(tab.name);
                  }}
                  sx={{
                    fontSize: "12px",
                    color: isActive ? "text.primary" : "#6c7086",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.name}
                </Typography>
              )}
              <CloseRoundedIcon
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab.id);
                }}
                sx={{
                  fontSize: 14,
                  color: "#6c7086",
                  cursor: "pointer",
                  borderRadius: "3px",
                  "&:hover": { color: "text.primary", bgcolor: "#313244" },
                }}
              />
            </Box>
          );
        })}
      </Box>
      {canScrollRight && (
        <IconButton size="small" onClick={() => scroll("right")} sx={scrollBtnSx}>
          <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      )}
      <IconButton
        onClick={onAdd}
        size="small"
        sx={{
          mx: 0.5,
          color: "#6c7086",
          flexShrink: 0,
          "&:hover": { color: "text.primary" },
        }}
      >
        <AddRoundedIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}
