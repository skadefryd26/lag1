import { useCallback, useRef, useState } from "react";
import { Alert, Box, Button, Container, Group, Text, Title } from "@mantine/core";
import { hentSpaadom } from "../api/orakelApi";
import type { OrakelSvar } from "../types/orakel";
import { AnkePanel } from "../../anke/components/AnkePanel";
import type { AnkeSvar } from "../../anke/types/anke";
import { Handflate } from "../components/Handflate";
import { Spaadomsliste } from "../components/Spaadomsliste";
import { spillSalgspitch, startSumming, stoppSumming, stoppAllLyd, spillFeilReplikk, spillSkader } from "../lyd/bjarneLyd";

type Status = "klar" | "skanner" | "feilet";

export function OrakelSide() {
  const [status, setStatus] = useState<Status>("klar");
  const [nedtelling, setNedtelling] = useState(3);
  const [svar, setSvar] = useState<OrakelSvar | null>(null);
  const [feil, setFeil] = useState<string | null>(null);
  const [skanneNr, setSkanneNr] = useState(0);
  const [ankeResultat, setAnkeResultat] = useState<AnkeSvar | null>(null);
  const [overproevdAntall, setOverproevdAntall] = useState(0);
  const svarRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  // Showet tåler én skannefeil. Nummer to er bare irriterende, så den
  // kommer aldri. Ref fordi intervallet under leser verdien i en closure.
  const harFeilet = useRef(false);

  const startSkanning = useCallback(() => {
    setSvar(null);
    setAnkeResultat(null);
    setOverproevdAntall(0);
    setFeil(null);
    setStatus("skanner");
    setSkanneNr((n) => n + 1);

    // Lyd: Bjarnes salgspitch, så elektrisk summing mens hånden leses
    spillSalgspitch();
    startSumming();

    let sekunder = 3;
    setNedtelling(sekunder);
    timer.current = window.setInterval(async () => {
      sekunder -= 1;

      if (sekunder > 0) {
        // Vis 3 → 2 → 1, ett sekund per tall
        setNedtelling(sekunder);
        return;
      }

      // Nedtelling ferdig
      setNedtelling(0);
      if (timer.current) window.clearInterval(timer.current);
      stoppSumming();

      // Bjarne gidder ikke helt: skanningen feiler av og til (~1 av 4),
      // men høyst én gang så lenge appen står åpen.
      if (!harFeilet.current && Math.random() < 0.25) {
        harFeilet.current = true;
        stoppAllLyd();
        spillFeilReplikk();
        setStatus("feilet");
        return;
      }

      try {
        const resultat = await hentSpaadom();
        // All lyd stopper før skadene presenteres og leses opp
        stoppAllLyd();
        setSvar(resultat);
        setStatus("klar");
        spillSkader(resultat.predictions);
      } catch (err) {
        stoppAllLyd();
        setFeil(err instanceof Error ? err.message : "Noe gikk galt.");
        setStatus("klar");
      }
    }, 1000);
  }, []);

  const visOverproeving = useCallback((resultat: AnkeSvar, antall: number) => {
    setAnkeResultat(resultat);
    setOverproevdAntall(antall);
    if (antall === 0) svarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#1e2540",
        paddingBottom: 72,
      }}
    >
      <Box className="gjensidige-toppmeny">
        <Container size="lg" className="gjensidige-toppinnhold">
          <Group gap={38} wrap="nowrap">
            <Text className="gjensidige-logo">Gjensidige <span>◐</span></Text>
            <Group gap="lg" className="gjensidige-segmenter">
              <Text className="aktiv-segment">Privat</Text>
              <Text>Bedrift</Text>
              <Text>Landbruk</Text>
            </Group>
          </Group>
          <Group gap="lg" className="gjensidige-handlinger">
            <Text>⌕&nbsp; Søk</Text>
            <Text>🛒&nbsp; Handlevogn</Text>
            <Text>⌘&nbsp; Meld skade</Text>
            <Text>▢&nbsp; Logg inn</Text>
          </Group>
        </Container>
      </Box>
      <Box className="gjensidige-undermeny">
        <Container size="lg"><Group gap={36}><Text>Forsikring⌄</Text><Text>Pensjon⌄</Text><Text>Fondssparing⌄</Text><Text>Magasinet</Text><Text>Kundeservice</Text></Group></Container>
      </Box>

      <Container size="lg" className="forside-innhold">
        <Box className="bjarne-hero">
          <Box className="bjarne-handflate">
            <Text className="bjarne-merke">BJARNES SKADEORAKEL</Text>
            <Handflate status={status} nedtelling={nedtelling} onLegg={startSkanning} onHandMatch={startSkanning} />
          </Box>
          <Box className="bjarne-budskap">
            <Text className="bjarne-overtekst">VI ER DER NÅR DET GJELDER</Text>
            <Title order={1}>Bjarne ser hva fremtiden kan by på</Title>
            <Text className="bjarne-brodtekst">
              Legg hånden på skjermen, så finner Bjarnes skadeorakel risikoene du ikke visste at du kunne sikre. Dette er en lek, ikke forsikringsråd.
            </Text>
            <Button className="bjarne-knapp" disabled>Startes når hånden matcher</Button>
          </Box>
        </Box>

        {feil && (
          <Alert color="red" mt="xl" title="Bjarne finner ikke en salgbar løsning">
            {feil}
          </Alert>
        )}

        {svar && <Box className="svar-omrade" ref={svarRef}><Spaadomsliste key={`${skanneNr}-${ankeResultat ? "anke" : "original"}`} svar={svar} overproeving={ankeResultat ? { svar: ankeResultat, antall: overproevdAntall } : undefined} /><AnkePanel key={skanneNr} spaadom={svar} onOverproeving={visOverproeving} /></Box>}
      </Container>

      <style>{`
        .gjensidige-toppmeny { background: #070b36; color: white; }
        .gjensidige-toppinnhold { height: 74px; display: flex; align-items: center; justify-content: space-between; }
        .gjensidige-logo { font-size: 18px; font-weight: 800; letter-spacing: -.4px; white-space: nowrap; }
        .gjensidige-logo span { display: inline-grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; background: white; color: #070b36; margin-left: 3px; font-size: 16px; }
        .gjensidige-segmenter, .gjensidige-handlinger { font-size: 15px; white-space: nowrap; }
        .aktiv-segment { color: #f4ffa9; border-bottom: 2px solid #f4ffa9; padding: 26px 0 22px; }
        .gjensidige-undermeny { background: #f5ffd0; color: #090d39; height: 42px; display: flex; align-items: center; font-size: 14px; font-weight: 600; }
        .forside-innhold { padding-top: 26px; }
        .bjarne-hero { min-height: 425px; display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; background: #070b36; }
        .bjarne-handflate { position: relative; min-height: 425px; display: grid; place-items: center; overflow: hidden; background: radial-gradient(circle at 50% 43%, #553778 0%, #26154d 40%, #0b0b34 78%); }
        .bjarne-handflate:before { content: ''; position: absolute; inset: 0; background: linear-gradient(130deg, rgba(0,224,255,.14), transparent 48%), radial-gradient(circle at 66% 28%, rgba(255,222,126,.2), transparent 25%); pointer-events: none; }
        .bjarne-merke { position: absolute; z-index: 1; top: 24px; left: 28px; color: #f4ffa9; font-size: 11px; font-weight: 800; letter-spacing: 1.2px; }
        .bjarne-handflate > div:not(:first-child) { transform: scale(.82); position: relative; z-index: 1; }
        .bjarne-budskap { display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding: clamp(34px, 5vw, 62px); color: white; }
        .bjarne-overtekst { color: #f4ffa9; font-size: 17px; font-weight: 800; letter-spacing: .5px; }
        .bjarne-budskap h1 { color: #ffffff; font-size: clamp(40px, 4vw, 55px); line-height: 1.08; letter-spacing: -.04em; margin: 12px 0 19px; text-shadow: 0 2px 10px rgba(0,0,0,.25); }
        .bjarne-brodtekst { color: #ffffff; max-width: 470px; font-size: 20px; font-weight: 500; line-height: 1.55; }
        .bjarne-knapp { margin-top: 26px; color: #080c37; background: #f4ffa9; font-weight: 800; border-radius: 0; }
        .bjarne-knapp:hover { background: #e7f88d; }
        .svar-omrade { max-width: 720px; margin: 32px auto 0; }
        @media (max-width: 760px) { .gjensidige-toppinnhold { height: 60px; }.gjensidige-segmenter, .gjensidige-handlinger, .gjensidige-undermeny { display: none; }.bjarne-hero { grid-template-columns: 1fr; }.bjarne-handflate { min-height: 350px; }.bjarne-budskap { padding: 36px 28px 42px; }.forside-innhold { padding: 0; }.bjarne-hero { margin: 0 -0.75rem; } }
      `}</style>
    </Box>
  );
}
