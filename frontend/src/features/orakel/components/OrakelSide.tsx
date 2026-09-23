import { useCallback, useRef, useState } from "react";
import { Alert, Box, Container, Text, Title } from "@mantine/core";
import { hentSpaadom } from "../api/orakelApi";
import type { OrakelSvar } from "../types/orakel";
import { Handflate } from "../components/Handflate";
import { Spaadomsliste } from "../components/Spaadomsliste";

type Status = "klar" | "skanner" | "feilet";

export function OrakelSide() {
  const [status, setStatus] = useState<Status>("klar");
  const [nedtelling, setNedtelling] = useState(3);
  const [svar, setSvar] = useState<OrakelSvar | null>(null);
  const [feil, setFeil] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const startSkanning = useCallback(() => {
    setSvar(null);
    setFeil(null);
    setStatus("skanner");
    setNedtelling(3);

    let sekunder = 3;
    timer.current = window.setInterval(async () => {
      sekunder -= 1;
      setNedtelling(sekunder);

      if (sekunder <= 0) {
        if (timer.current) window.clearInterval(timer.current);

        // Bjarne gidder ikke helt: skanningen feiler av og til (~1 av 4)
        if (Math.random() < 0.25) {
          setStatus("feilet");
          return;
        }

        try {
          const resultat = await hentSpaadom();
          setSvar(resultat);
          setStatus("klar");
        } catch (err) {
          setFeil(err instanceof Error ? err.message : "Noe gikk galt.");
          setStatus("klar");
        }
      }
    }, 800);
  }, []);

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at 50% 30%, #2a1a4a 0%, #120a24 70%)",
        paddingTop: 48,
        paddingBottom: 64,
      }}
    >
      <Container size="sm">
        <Title order={1} ta="center" c="grape.1" style={{ letterSpacing: 1 }}>
          🔮 Krystallkulen
        </Title>
        <Text ta="center" c="grape.3" mb="xl" fz="lg">
          Bjarnes skadeorakel – han sukker, men han ser alt
        </Text>

        <Handflate status={status} nedtelling={nedtelling} onLegg={startSkanning} />

        {feil && (
          <Alert color="red" mt="xl" title="Bjarne trakk på skuldrene">
            {feil}
          </Alert>
        )}

        {svar && <Spaadomsliste svar={svar} />}
      </Container>
    </Box>
  );
}
