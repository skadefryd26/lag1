import { useEffect, useState } from "react";
import { Alert, Button, Card, Group, Stack, Text } from "@mantine/core";
import { sendAnke } from "../api/ankeApi";
import type { OrakelSvar } from "../../orakel/types/orakel";

const VENTETEKSTER = [
  "Oppretter sak i et saksbehandlingssystem ingen husker navnet på…",
  "BJARNE 2.0™ synkroniserer kundereisen på tvers av siloer… 🚀",
  "Henter inn datadrevet risikoeksponering… ✨",
  "Bjarne er informert. Bjarne har forlatt rommet.",
  "Kvalitetssikrer kvalitetssikringen… 🙌",
];

const Ventetekst = () => {
  const [steg, setSteg] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSteg((forrige) => (forrige + 1) % VENTETEKSTER.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Text ta="center" c="cyan.3" fs="italic" mt="xl">
      {VENTETEKSTER[steg]}
    </Text>
  );
};

type Props = {
  spaadom: OrakelSvar;
  /** Kalles med 2.0 sin versjon, som erstatter Bjarnes i listen over. */
  onOverproevd: (nytt: OrakelSvar) => void;
};

export const AnkePanel = ({ spaadom, onOverproevd }: Props) => {
  const [reaksjon, setReaksjon] = useState<string | null>(null);
  const [venter, setVenter] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);

  const anke = async () => {
    setVenter(true);
    setFeil(null);
    try {
      const svar = await sendAnke(spaadom);
      onOverproevd({ kommentar: svar.vurdering, predictions: svar.predictions });
      setReaksjon(svar.bjarnesReaksjon);
    } catch (err) {
      setFeil(err instanceof Error ? err.message : "Anken gikk tapt.");
    } finally {
      setVenter(false);
    }
  };

  if (venter) return <Ventetekst />;

  if (reaksjon) {
    return (
      <Card
        withBorder
        radius="md"
        mt="xl"
        padding="md"
        style={{ background: "rgba(112, 72, 232, 0.12)", borderColor: "#7048e8" }}
      >
        <Group gap="sm" wrap="nowrap" align="flex-start">
          <Text fz={28}>😤</Text>
          <Stack gap={2}>
            <Text fw={700} c="grape.1">
              Bjarne, etter at anken ble behandlet
            </Text>
            <Text fs="italic" c="grape.1">
              {reaksjon}
            </Text>
          </Stack>
        </Group>
      </Card>
    );
  }

  return (
    <Stack align="center" mt="xl" gap={4}>
      <Button variant="light" color="cyan" onClick={anke}>
        Anke til nærmeste leder
      </Button>
      <Text size="xs" c="dimmed">
        Bjarne anbefaler sterkt at du lar være.
      </Text>
      {feil && (
        <Alert color="red" mt="md" title="Anken kom ikke frem">
          {feil}
        </Alert>
      )}
    </Stack>
  );
};
