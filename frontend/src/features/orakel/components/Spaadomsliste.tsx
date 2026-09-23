import { useMemo, useState } from "react";
import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";
import type { OrakelSvar } from "../types/orakel";
import { ikonForSkade } from "./skadeIkon";
import { si, stoppAllLyd } from "../lyd/bjarneLyd";
import { formaterKr, kjopAltKvittering, kjopKvittering, neiReplikk, premieTall } from "./kjopTekster";

type Valg = "ingen" | "sikret" | "avslatt";

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

  const total = useMemo(
    () => svar.predictions.reduce((sum, p, i) => (valg[i] === "sikret" ? sum + premieTall(p.premie) : sum), 0),
    [svar.predictions, valg],
  );
  const totalAlt = useMemo(
    () => svar.predictions.reduce((sum, p) => sum + premieTall(p.premie), 0),
    [svar.predictions],
  );
  const antallSikret = valg.filter((v) => v === "sikret").length;

  return (
    <Stack gap="md" mt="xl">
      <Card withBorder radius="md" padding="lg" style={{ background: "#f5efff", borderColor: "#a267e8" }}>
        <Group gap="sm" wrap="nowrap">
          <Text fz={28}>🔮</Text>
          <Text fs="italic" c="#251149" fz="lg" fw={600} lh={1.5}>{bjarneSier ?? svar.kommentar}</Text>
        </Group>
      </Card>

      {svar.predictions.map((p, i) => (
        <Card
          key={i}
          withBorder
          radius="md"
          padding="xl"
          style={{
            background: valg[i] === "sikret" ? "#effbf1" : "#ffffff",
            borderColor: valg[i] === "sikret" ? "#40c057" : "#d9d4e4",
            opacity: valg[i] === "avslatt" ? 0.62 : 1,
          }}
        >
          <Group justify="space-between" wrap="nowrap" align="flex-start">
            <Group gap="md" wrap="nowrap" align="flex-start">
              <Text fz={40} style={{ lineHeight: 1 }}>{ikonForSkade(p.skade)}</Text>
              <Stack gap={4}>
                <Text fw={800} fz="xl" c="#171137">{p.skade}</Text>
                <Text size="md" c="#3f3a4a">Forventet: {p.dato}</Text>
                <Text size="md" c="#6b4100" fw={700}>Anbefalt premie: {p.premie}</Text>
              </Stack>
            </Group>
            <Badge size="lg" color={dramaFarge(p.dramascore)} variant="filled" style={{ flexShrink: 0 }} styles={{ label: { overflow: "visible" } }}>
              Drama {p.dramascore}/6
            </Badge>
          </Group>

          <Group mt="lg" gap="sm" wrap="wrap">
            {valg[i] === "sikret" ? (
              <Badge size="lg" color="green" variant="light">Sikret ✓</Badge>
            ) : valg[i] === "avslatt" ? (
              <Button size="sm" variant="subtle" color="gray" onClick={() => settValg(i, "sikret", kjopKvittering())}>
                Ombestemte meg - sikre meg likevel
              </Button>
            ) : (
              <>
                <Button size="sm" color="grape" onClick={() => settValg(i, "sikret", kjopKvittering())}>Sikre meg</Button>
                <Button size="sm" variant="outline" color="gray" onClick={() => settValg(i, "avslatt", neiReplikk())}>Nei takk</Button>
              </>
            )}
          </Group>
        </Card>
      ))}

      <Card withBorder radius="md" padding="lg" style={{ background: "#fffbe8", borderColor: "#d8b600" }}>
        <Group justify="space-between" wrap="wrap" gap="md">
          <Stack gap={2}>
            <Text fw={800} c="#574500">Sikre meg mot alt</Text>
            <Text size="sm" c="#3f3a4a">Full pakke: {formaterKr(totalAlt)}</Text>
          </Stack>
          <Button color="yellow" variant="filled" disabled={antallSikret === svar.predictions.length} onClick={sikreAlt}>
            {antallSikret === svar.predictions.length ? "Alt er sikret ✓" : "Sikre meg mot alt"}
          </Button>
        </Group>
        {antallSikret > 0 && <Text mt="md" fw={700} c="#176b34">Du har sikret deg mot {antallSikret} av {svar.predictions.length} skader - total: {formaterKr(total)}</Text>}
      </Card>
    </Stack>
  );
}
