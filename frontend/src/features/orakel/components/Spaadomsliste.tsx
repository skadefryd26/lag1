import { useMemo, useState } from "react";
import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";
import type { OrakelSvar } from "../types/orakel";
import { ikonForSkade } from "./skadeIkon";
import { si, stoppAllLyd } from "../lyd/bjarneLyd";
import {
  formaterKr,
  kjopAltKvittering,
  kjopKvittering,
  neiReplikk,
  premieTall,
} from "./kjopTekster";

function dramaFarge(score: number): string {
  if (score >= 5) return "red";
  if (score >= 3) return "orange";
  return "teal";
}

type Valg = "ingen" | "sikret" | "avslatt";

export function Spaadomsliste({ svar }: { svar: OrakelSvar }) {
  const [valg, setValg] = useState<Valg[]>(() => svar.predictions.map(() => "ingen"));
  const [bjarneSier, setBjarneSier] = useState<string | null>(null);

  function settValg(i: number, nyttValg: Valg, replikk: string) {
    setValg((forrige) => forrige.map((v, idx) => (idx === i ? nyttValg : v)));
    setBjarneSier(replikk);
    stoppAllLyd();
    si(replikk, { rate: 0.85, pitch: 0.65 });
  }

  function sikreAlt() {
    setValg(svar.predictions.map(() => "sikret"));
    const replikk = kjopAltKvittering();
    setBjarneSier(replikk);
    stoppAllLyd();
    si(replikk, { rate: 0.8, pitch: 0.6 });
  }

  // Total for det som er sikret
  const total = useMemo(
    () =>
      svar.predictions.reduce(
        (sum, p, i) => (valg[i] === "sikret" ? sum + premieTall(p.premie) : sum),
        0,
      ),
    [svar.predictions, valg],
  );

  const totalAlt = useMemo(
    () => svar.predictions.reduce((sum, p) => sum + premieTall(p.premie), 0),
    [svar.predictions],
  );

  const antallSikret = valg.filter((v) => v === "sikret").length;

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
            {bjarneSier ?? svar.kommentar}
          </Text>
        </Group>
      </Card>

      {svar.predictions.map((p, i) => (
        <Card
          key={i}
          withBorder
          radius="md"
          padding="lg"
          style={{
            background: valg[i] === "sikret" ? "rgba(64, 192, 87, 0.15)" : "rgba(0,0,0,0.25)",
            borderColor: valg[i] === "sikret" ? "#40c057" : undefined,
            opacity: valg[i] === "avslatt" ? 0.55 : 1,
          }}
        >
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
            <Badge
              size="lg"
              color={dramaFarge(p.dramascore)}
              variant="filled"
              style={{ flexShrink: 0 }}
              styles={{ label: { overflow: "visible" } }}
            >
              Drama {p.dramascore}/6
            </Badge>
          </Group>

          <Group mt="md" gap="sm">
            {valg[i] === "sikret" ? (
              <Badge size="lg" color="green" variant="light">
                Sikret ✓
              </Badge>
            ) : valg[i] === "avslatt" ? (
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                onClick={() => settValg(i, "sikret", kjopKvittering())}
              >
                Ombestemte meg – sikre meg likevel
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  color="grape"
                  onClick={() => settValg(i, "sikret", kjopKvittering())}
                >
                  Sikre meg
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  color="gray"
                  onClick={() => settValg(i, "avslatt", neiReplikk())}
                >
                  Nei takk
                </Button>
              </>
            )}
          </Group>
        </Card>
      ))}

      {/* Sikre mot ALT + total */}
      <Card
        withBorder
        radius="md"
        padding="lg"
        style={{ background: "rgba(255, 214, 0, 0.08)", borderColor: "#ffd600" }}
      >
        <Group justify="space-between" wrap="wrap" gap="md">
          <Stack gap={2}>
            <Text fw={700} c="yellow.4">
              Sikre meg mot ALT
            </Text>
            <Text size="sm" c="dimmed">
              Full pakke: {formaterKr(totalAlt)}
            </Text>
          </Stack>
          <Button
            color="yellow"
            variant="filled"
            disabled={antallSikret === svar.predictions.length}
            onClick={sikreAlt}
          >
            {antallSikret === svar.predictions.length ? "Alt er sikret ✓" : "Sikre meg mot ALT"}
          </Button>
        </Group>
        {antallSikret > 0 && (
          <Text mt="md" fw={600} c="green.4">
            Du har sikret deg mot {antallSikret} av {svar.predictions.length} skader – total:{" "}
            {formaterKr(total)}
          </Text>
        )}
      </Card>
    </Stack>
  );
}
