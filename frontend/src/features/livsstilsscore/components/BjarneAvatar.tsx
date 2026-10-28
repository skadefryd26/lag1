import { useMemo } from "react";
import { Badge, Group, Stack, Text } from "@mantine/core";

type Props = {
  tilstand: "hvile" | "tenker" | "svart";
};

// Alle uttrykkene Bjarne-hodet kan vise (fra bjarne.html).
const UTTRYKK = [
  "skeptisk",
  "mistenksom",
  "tvilende",
  "irritert",
  "sint",
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
  const uttrykk = useMemo(
    () => UTTRYKK[Math.floor(Math.random() * UTTRYKK.length)],
    [],
  );

  // Adressen styrer hodet: uttrykk, skjult panel og lys bakgrunn som matcher kortet.
  const src = `/bjarne.html#uttrykk=${uttrykk}&ui=0&bg=f8f9fb`;

  return (
    <Group gap="sm" wrap="nowrap">
      <iframe
        src={src}
        title="Bjarnes ansikt"
        aria-label="Bjarnes ansikt"
        style={{
          width: 72,
          height: 72,
          border: "2px solid var(--mantine-color-brand-2)",
          borderRadius: "50%",
          flex: "none",
          background: "#f8f9fb",
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
