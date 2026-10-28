import { createTheme } from "@mantine/core";

// Gjensidige-aktig uttrykk med Mantine (ingen interne @gjensidige/-pakker).
// Dyp blå primærfarge, rund radius, tydelig typografi.
export const theme = createTheme({
  primaryColor: "brand",
  primaryShade: 7,
  defaultRadius: "md",
  fontFamily:
    "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  headings: {
    fontWeight: "800",
  },
  colors: {
    brand: [
      "#e7f0f7",
      "#c7dcec",
      "#a1c4df",
      "#79acd2",
      "#5a99c8",
      "#3d87bf",
      "#2f72a6",
      "#235a85",
      "#174363",
      "#0b2c42",
    ],
  },
});
