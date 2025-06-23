import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/system";

/* botón con “doble capa” */
const Outer = styled(Button)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxWidth: 480,
  padding: theme.spacing(1),     // 8 px  ← MÁS GRUESO
  borderRadius: 24,
  backgroundColor: theme.palette.primary.dark,     // borde teal
  color: theme.palette.text.primary,
  fontWeight: 700,
  textTransform: "none",
  "&:hover": { backgroundColor: theme.palette.primary.darker },

  /* capa interior */
  "& > span": {
    display: "block",
    width: "100%",
    padding: theme.spacing(1.5, 3),
    borderRadius: 20,
    backgroundColor: theme.palette.common.white,
  },
}));

export default function LargeActionButton({ children, ...rest }) {
  return (
    <Outer {...rest} disableRipple>
      <span>{children}</span>
    </Outer>
  );
}
