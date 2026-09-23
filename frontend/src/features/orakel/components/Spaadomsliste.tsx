import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";
import type { OrakelSvar } from "../types/orakel";
import { ikonForSkade } from "./skadeIkon";

function dramaFarge(score: number): string {
  if (score >= 5) return "red";
  if (score >= 3) return "orange";
  return "teal";
}

function forsikringsCta(skade: string): string {
  const tekst = skade.toLowerCase();
  if (tekst.includes("reise") || tekst.includes("bagasje")) return "Se reiseforsikring";
  if (tekst.includes("bil") || tekst.includes("sykkel") || tekst.includes("kjør")) return "Se kjøretøyforsikring";
  if (tekst.includes("vann") || tekst.includes("brann") || tekst.includes("hus")) return "Se husforsikring";
  if (tekst.includes("hund") || tekst.includes("dyr")) return "Se dyreforsikring";
  return "Se hva innboforsikring dekker";
}

export function Spaadomsliste({ svar }: { svar: OrakelSvar }) {
  return (
    <Stack gap="md" mt="xl">
      <Card
        withBorder
        radius="md"
        padding="lg"
        style={{ background: "#f5efff", borderColor: "#a267e8" }}
      >
        <Group gap="sm" wrap="nowrap">
          <Text fz={28}>🔮</Text>
          <Text fs="italic" c="#251149" fz="lg" fw={600} lh={1.5}>
            {svar.kommentar}
          </Text>
        </Group>
      </Card>

      {svar.predictions.map((p, i) => (
        <Card key={i} withBorder radius="md" padding="xl" style={{ background: "#ffffff", borderColor: "#d9d4e4" }}>
          <Group justify="space-between" wrap="nowrap" align="flex-start">
            <Group gap="md" wrap="nowrap" align="flex-start">
              <Text fz={40} style={{ lineHeight: 1 }}>
                {ikonForSkade(p.skade)}
              </Text>
              <Stack gap={4}>
                <Text fw={800} fz="xl" c="#171137">
                  {p.skade}
                </Text>
                <Text size="md" c="#3f3a4a">
                  Forventet: {p.dato}
                </Text>
                <Text size="md" c="#6b4100" fw={700}>
                  Anbefalt premie: {p.premie}
                </Text>
              </Stack>
            </Group>
            <Badge
              size="lg"
              color={dramaFarge(p.dramascore)}
              variant="filled"
              // Badgen klipper etiketten sin med ellipse når den blir klemt.
              // Lange skadetitler gjorde «Drama 4/6» til «DRAM…».
              style={{ flexShrink: 0 }}
              styles={{ label: { overflow: "visible" } }}
            >
              Drama {p.dramascore}/6
            </Badge>
          </Group>
          <Button mt="lg" size="md" color="grape" radius="xl" fw={700}>
            {forsikringsCta(p.skade)}
          </Button>
        </Card>
      ))}
    </Stack>
  );
}
