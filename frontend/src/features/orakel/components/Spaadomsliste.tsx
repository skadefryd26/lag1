import { useMemo, useState } from "react";
import { Badge, Button, Card, Group, Stack, Text } from "@mantine/core";
import type { OrakelSvar } from "../types/orakel";
import type { AnkeSvar } from "../../anke/types/anke";
import { ikonForSkade } from "./skadeIkon";
import { si, stoppAllLyd } from "../lyd/bjarneLyd";
import { formaterKr, kjopAltKvittering, kjopKvittering, neiReplikk, premieTall } from "./kjopTekster";

type Valg = "ingen" | "sikret" | "avslatt";

function dramaFarge(score: number): string {
  if (score >= 5) return "red";
  if (score >= 3) return "orange";
  return "teal";
}

type Overproeving = { svar: AnkeSvar; antall: number };

type Props = {
  svar: OrakelSvar;
  overproeving?: Overproeving;
  kaffeRabatt: boolean;
  onGiKaffe: () => void;
};

export function Spaadomsliste({ svar, overproeving, kaffeRabatt, onGiKaffe }: Props) {
  const [valg, setValg] = useState<Valg[]>(() => svar.predictions.map(() => "ingen"));
  const [bjarneSier, setBjarneSier] = useState<string | null>(null);
  const ankeFerdig = overproeving?.antall === svar.predictions.length;
  const visSvar = ankeFerdig
    ? { kommentar: overproeving.svar.vurdering, predictions: overproeving.svar.predictions }
    : svar;
  const prisMedKaffe = (premie: string): number =>
    Math.round(premieTall(premie) * (kaffeRabatt ? 0.8 : 1));

  function settValg(i: number, nyttValg: Valg, replikk: string) {
    setValg((forrige) => forrige.map((v, idx) => (idx === i ? nyttValg : v)));
    setBjarneSier(replikk);
    stoppAllLyd();
    si(replikk, { rate: 0.85, pitch: 0.65 });
  }

  function sikreAlt() {
    setValg(visSvar.predictions.map(() => "sikret"));
    const replikk = kjopAltKvittering();
    setBjarneSier(replikk);
    stoppAllLyd();
    si(replikk, { rate: 0.8, pitch: 0.6 });
  }

  const total = useMemo(
    () => visSvar.predictions.reduce((sum, p, i) => (valg[i] === "sikret" ? sum + prisMedKaffe(p.premie) : sum), 0),
    [visSvar.predictions, valg, kaffeRabatt],
  );
  const totalAlt = useMemo(
    () => visSvar.predictions.reduce((sum, p) => sum + prisMedKaffe(p.premie), 0),
    [visSvar.predictions, kaffeRabatt],
  );
  const antallSikret = valg.filter((v) => v === "sikret").length;

  return (
    <Stack gap="md" mt="xl">
      {overproeving && (
        <Card withBorder radius="md" padding="lg" style={{ background: "#07133b", borderColor: "#00bfd3", color: "white" }}>
          <Text fw={900} fz="xl" c="white">TROND TAR OVER SAKEN</Text>
          <Text c="#b2f2ff" role="status">
            {ankeFerdig ? "Alle forslag er overprøvd." : `Overskriver ${overproeving.antall} av ${svar.predictions.length} forslag …`}
          </Text>
        </Card>
      )}

      <Card withBorder radius="md" padding="lg" style={{ background: ankeFerdig ? "#edf9fc" : "#f5efff", borderColor: ankeFerdig ? "#00a4bd" : "#a267e8" }}>
        <Group gap="sm" wrap="nowrap">
          <Text fz={28}>{ankeFerdig ? "🚀" : "🔮"}</Text>
          <Stack gap={4}>
            {ankeFerdig && <Text fw={800} c="#12435c">Tronds vurdering</Text>}
            <Text fs="italic" c="#251149" fz="lg" fw={600} lh={1.5}>{bjarneSier ?? visSvar.kommentar}</Text>
          </Stack>
        </Group>
      </Card>

      {ankeFerdig && (
        <Card withBorder radius="md" padding="xl" style={{ background: "#fff0e8", borderColor: "#e8590c", borderLeftWidth: 8 }} role="status">
          <Text fw={900} fz="xl" c="#9c2900">😤 BJARNE GODTAR IKKE TRONDS VEDTAK</Text>
          <Text fz="lg" fw={600} c="#3e2118" mt="sm">«{overproeving.svar.bjarnesReaksjon}»</Text>
        </Card>
      )}

      {svar.predictions.map((gammeltForslag, i) => {
        const erstattet = !!overproeving && overproeving.antall > i;
        const p = erstattet ? overproeving.svar.predictions[i] : gammeltForslag;
        return (
          <Card
            key={i}
            withBorder
            radius="md"
            padding="xl"
            style={{
              background: valg[i] === "sikret" ? "#effbf1" : erstattet ? "#f1fbfd" : "#ffffff",
              borderColor: valg[i] === "sikret" ? "#40c057" : erstattet ? "#00a4bd" : "#d9d4e4",
              opacity: valg[i] === "avslatt" ? 0.62 : 1,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {overproeving && (
              <Text size="xs" fw={900} c={erstattet ? "#006e80" : "#665574"} mb="sm">
                {erstattet ? "TROND · OVERPRØVD" : "BJARNE 1.0 · AVVENTER OVERPRØVING"}
              </Text>
            )}
            {erstattet && (
              <Stack gap={2} mb="md" className="anke-gammelt-forslag">
                <Text size="xs" fw={700} c="#6b5160">BJARNE 1.0 SITT FORSLAG · STRØKET</Text>
                <Text size="sm" c="#6b5160" td="line-through">
                  {gammeltForslag.skade} · Drama {gammeltForslag.dramascore}/6 · {gammeltForslag.premie}
                </Text>
              </Stack>
            )}
            <div key={erstattet ? "ny" : "gammel"} className={erstattet ? "anke-nytt-forslag" : undefined}>
              <Group justify="space-between" wrap="wrap" align="flex-start">
                <Group gap="md" wrap="nowrap" align="flex-start" style={{ minWidth: 0, flex: "1 1 230px" }}>
                  <Text fz={40} style={{ lineHeight: 1 }}>{ikonForSkade(p.skade)}</Text>
                  <Stack gap={4} style={{ minWidth: 0 }}>
                    <Text fw={800} fz="xl" c="#171137">{p.skade}</Text>
                    <Text size="md" c="#3f3a4a">Forventet: {p.dato}</Text>
                    <Text size="md" c="#6b4100" fw={700}>
                      Anbefalt premie: {kaffeRabatt ? formaterKr(prisMedKaffe(p.premie)) : p.premie}
                    </Text>
                    {kaffeRabatt && <Text size="sm" c="#5f6470" td="line-through">Før kaffe: {p.premie}</Text>}
                  </Stack>
                </Group>
                <Badge size="lg" color={dramaFarge(p.dramascore)} variant="filled" style={{ flexShrink: 0 }}>
                  Drama {p.dramascore}/6
                </Badge>
              </Group>
            </div>

            {(!overproeving || ankeFerdig) && <Group mt="lg" gap="sm" wrap="wrap">
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
            </Group>}
          </Card>
        );
      })}

      {(!overproeving || ankeFerdig) && <Card withBorder radius="md" padding="lg" style={{ background: "#fffbe8", borderColor: "#d8b600" }}>
        <Group justify="space-between" wrap="wrap" gap="md">
          <Stack gap={2}>
            <Text fw={800} c="#574500">Sikre meg mot alt</Text>
            <Text size="sm" c="#3f3a4a">Full pakke: {formaterKr(totalAlt)}</Text>
          </Stack>
          <Button color="yellow" variant="filled" disabled={antallSikret === visSvar.predictions.length} onClick={sikreAlt}>
            {antallSikret === visSvar.predictions.length ? "Alt er sikret ✓" : "Sikre meg mot alt"}
          </Button>
        </Group>
        {antallSikret > 0 && <Text mt="md" fw={700} c="#176b34">Du har sikret deg mot {antallSikret} av {visSvar.predictions.length} skader - total: {formaterKr(total)}</Text>}
      </Card>}
      {(!overproeving || ankeFerdig) && (
        <Card withBorder radius="md" padding="lg" style={{ background: "#f7f0e4", borderColor: "#ac7c45" }}>
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <Stack gap={3}>
              <Text fw={800} fz="lg" c="#49301c">☕ Bestikk Bjarne med kaffe</Text>
              <Text size="sm" c="#49301c">En kopp gir 20 % lavere oppdiktet månedspris.</Text>
            </Stack>
            <Button color="orange" onClick={onGiKaffe} disabled={kaffeRabatt}>
              {kaffeRabatt ? "Kaffe servert ✓" : "Gi Bjarne kaffe"}
            </Button>
          </Group>
          {kaffeRabatt && (
            <Text mt="md" fw={700} c="#49301c" role="status">
              «En kopp kaffe, og jeg fant plutselig rom for 20 % lavere premie. Ikke si det til Trond.»
            </Text>
          )}
        </Card>
      )}
      <style>{`
        .anke-gammelt-forslag { animation: anke-stryk 0.55s ease-out both; }
        .anke-nytt-forslag { animation: anke-skriv 0.75s ease-out both; }
        @keyframes anke-stryk { from { opacity: 1; transform: translateY(8px); } to { opacity: .7; transform: translateY(0); } }
        @keyframes anke-skriv { from { opacity: 0; transform: translateY(16px); filter: blur(5px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }
        @media (prefers-reduced-motion: reduce) { .anke-gammelt-forslag, .anke-nytt-forslag { animation: none; } }
      `}</style>
    </Stack>
  );
}
