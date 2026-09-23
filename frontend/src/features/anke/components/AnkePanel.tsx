import { useEffect, useState } from "react";
import { Alert, Button, Stack, Text } from "@mantine/core";
import { sendAnke } from "../api/ankeApi";
import type { OrakelSvar } from "../../orakel/types/orakel";
import type { AnkeSvar } from "../types/anke";

const VENTETEKSTER = [
  "Oppretter sak i et saksbehandlingssystem ingen husker navnet på…",
  "Trond synkroniserer kundereisen på tvers av siloer… 🚀",
  "Henter inn datadrevet risikoeksponering… ✨",
  "Bjarne er informert. Bjarne krever å få se saksdokumentene.",
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
  onOverproeving: (svar: AnkeSvar, antall: number) => void;
};

export const AnkePanel = ({ spaadom, onOverproeving }: Props) => {
  const [resultat, setResultat] = useState<AnkeSvar | null>(null);
  const [antall, setAntall] = useState(0);
  const [venter, setVenter] = useState(false);
  const [feil, setFeil] = useState<string | null>(null);

  useEffect(() => {
    if (!resultat) return;
    if (antall >= resultat.predictions.length) return;

    const timer = window.setTimeout(() => {
      const neste = antall + 1;
      setAntall(neste);
      onOverproeving(resultat, neste);
    }, 950);
    return () => window.clearTimeout(timer);
  }, [resultat, antall, onOverproeving]);

  const anke = async () => {
    setVenter(true);
    setFeil(null);
    try {
      const svar = await sendAnke(spaadom);
      setResultat(svar);
      onOverproeving(svar, 0);
    } catch (err) {
      setFeil(err instanceof Error ? err.message : "Anken gikk tapt.");
    } finally {
      setVenter(false);
    }
  };

  if (venter) return <Ventetekst />;

  if (resultat) return null;

  return (
    <Stack align="center" mt="xl" gap={4}>
      <Button variant="light" color="cyan" onClick={anke}>
        Anke til Trond
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
