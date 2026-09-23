import { MantineProvider, createTheme } from "@mantine/core";
import { OrakelSide } from "./features/orakel/components/OrakelSide";

const theme = createTheme({
  primaryColor: "grape",
  fontFamily: "Georgia, 'Times New Roman', serif",
  headings: { fontFamily: "Georgia, 'Times New Roman', serif" },
});

export function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <OrakelSide />
    </MantineProvider>
  );
}
