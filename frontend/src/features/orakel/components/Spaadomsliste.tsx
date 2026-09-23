import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import type { OrakelSvar } from "../types/orakel";
import { ikonForSkade } from "./skadeIkon";

function dramaFarge(score: number): string {
  if (score >= 5) return "red";
  if (score >= 3) return "orange";
  return "teal";
}

export function Spaadomsliste({ svar }: { svar: OrakelSvar }) {
  return (
    <Stack gap="md" mt="xl">
      <Card
        withBorder
        radius="md"
        padding="md"
        style={{ background: "rgba(112, 72, 232, 0.12)", borderColor: "#7048e8" }}
      >
        <Group gap="sm" wrap="nowrap">
          <Text fz={28}>🔮</Text>
          <Text fs="italic" c="grape.1">
            {svar.kommentar}
          </Text>
        </Group>
      </Card>

      {svar.predictions.map((p, i) => (
        <Card key={i} withBorder radius="md" padding="lg" style={{ background: "rgba(0,0,0,0.25)" }}>
          <Group justify="space-between" wrap="nowrap" align="flex-start">
            <Group gap="md" wrap="nowrap" align="flex-start">
              <Text fz={40} style={{ lineHeight: 1 }}>
                {ikonForSkade(p.skade)}
              </Text>
              <Stack gap={4}>
                <Text fw={700} fz="lg" c="grape.1">
                  {p.skade}
                </Text>
                <Text size="sm" c="dimmed">
                  Forventet: {p.dato}
                </Text>
                <Text size="sm" c="yellow.4" fw={600}>
                  Anbefalt premie: {p.premie}
                </Text>
              </Stack>
            </Group>
            <Badge size="lg" color={dramaFarge(p.dramascore)} variant="filled">
              Drama {p.dramascore}/6
            </Badge>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
