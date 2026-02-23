import { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { TEMPLATES } from "./variables";
import { Template } from "./type";

interface TemplateMenuProps {
  label: string;
  onSelect: (template: Template) => void;
}

export default function TemplateMenu({ label, onSelect }: TemplateMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        variant="outlined"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        endIcon={<KeyboardArrowDownRoundedIcon />}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.default",
              border: "1px solid",
              borderColor: "primary.main",
              borderRadius: "8px",
              mt: 0.5,
              minWidth: 180,
            },
          },
        }}
      >
        {TEMPLATES.map((t) => (
          <MenuItem
            key={t.label}
            onClick={() => {
              onSelect(t);
              handleClose();
            }}
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#cdd6f4",
              py: 1.25,
              px: 2.5,
              "&:hover": { bgcolor: "rgba(54, 157, 153, 0.3)" },
            }}
          >
            {t.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
