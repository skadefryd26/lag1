import { useMemo } from "react";
import { Badge, Group, Stack, Text } from "@mantine/core";

type Props = {
  tilstand: "hvile" | "tenker" | "svart";
};

// Alle uttrykkene Bjarne-hodet kan vise før en vurdering (fra bjarne.html).
// «sint» er med vilje utelatt her — det vises bare når dommen er klar.
const UTTRYKK = [
  "skeptisk",
  "mistenksom",
  "tvilende",
  "irritert",
  "undrende",
  "tenkende",
  "forbauset",
  "sporrende",
  "forvirret",
  "hae",
  "noytral",
  "fornoyd",
  "oppgitt",
  "grimase",
];

// Bjarnes ansikt. Det ekte 3D-hodet hans, med et tilfeldig uttrykk.
export function BjarneAvatar({ tilstand }: Props) {
  const humor =
    tilstand === "tenker"
      ? "Sukker... vurderer... hvor er kaffen?"
      : tilstand === "svart"
        ? "Der, ja. Vær så god."
        : "Bjarne, til tjeneste. Motvillig.";

  // Velg ett tilfeldig uttrykk som holder seg stabilt mens komponenten lever.
  const tilfeldigUttrykk = useMemo(
    () => UTTRYKK[Math.floor(Math.random() * UTTRYKK.length)],
    [],
  );

  // Når dommen er klar, ser Bjarne alltid sint ut. Ellers et tilfeldig uttrykk.
  const uttrykk = tilstand === "svart" ? "sint" : tilfeldigUttrykk;

  // Adressen styrer hodet: uttrykk, skjult panel og hvit bakgrunn.
  const src = `/bjarne.html#uttrykk=${uttrykk}&ui=0&bg=ffffff`;

  return (
    <Group gap="sm" wrap="nowrap">
      <iframe
        src={src}
        title="Bjarnes ansikt"
        aria-label="Bjarnes ansikt"
        style={{
          width: 108,
          height: 108,
          border: "none",
          borderRadius: "50%",
          flex: "none",
          background: "#ffffff",
        }}
      />
      <Stack gap={2}>
        <Group gap="xs">
          <Text fw={700}>Bjarne</Text>
          <Badge variant="light" color="brand" size="sm">
            AI-risikovurderer
          </Badge>
        </Group>
        <Text size="sm" c="dimmed" fs={tilstand === "tenker" ? "italic" : undefined}>
          {humor}
        </Text>
      </Stack>
    </Group>
  );
}
