import { useCallback, useRef, useState } from "react";
import { Alert, Box, Button, Container, Group, Text, Title } from "@mantine/core";
import { hentSpaadom } from "../api/orakelApi";
import type { OrakelSvar } from "../types/orakel";
import { AnkePanel } from "../../anke/components/AnkePanel";
import { Handflate } from "../components/Handflate";
import { Spaadomsliste } from "../components/Spaadomsliste";
import { spillSukk, startSumming, stoppSumming, stoppAllLyd, spillFeilReplikk, spillSkader } from "../lyd/bjarneLyd";

type Status = "klar" | "skanner" | "feilet";

export function OrakelSide() {
  const [status, setStatus] = useState<Status>("klar");
  const [nedtelling, setNedtelling] = useState(3);
  const [svar, setSvar] = useState<OrakelSvar | null>(null);
  const [feil, setFeil] = useState<string | null>(null);
  const [skanneNr, setSkanneNr] = useState(0);
  const [harFeiletSkanning, setHarFeiletSkanning] = useState(false);
  const timer = useRef<number | null>(null);

  const startSkanning = useCallback(() => {
    setSvar(null);
    setFeil(null);
    setStatus("skanner");
    setNedtelling(3);
    setSkanneNr((n) => n + 1);

    // Lyd: høyt sukk fra Bjarne, så elektrisk summing mens hånden leses
    spillSukk();
    startSumming();

    let sekunder = 3;
    timer.current = window.setInterval(async () => {
      sekunder -= 1;
      setNedtelling(sekunder);

      if (sekunder <= 0) {
        if (timer.current) window.clearInterval(timer.current);
        stoppSumming();

        // Bjarne kan gjøre én dramatisk feil, men neste forsøk skal alltid lykkes.
        if (!harFeiletSkanning && Math.random() < 0.25) {
          setHarFeiletSkanning(true);
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
      }
    }, 800);
  }, [harFeiletSkanning]);

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
            <Handflate status={status} nedtelling={nedtelling} onLegg={startSkanning} />
          </Box>
          <Box className="bjarne-budskap">
            <Text className="bjarne-overtekst">VI ER DER NÅR DET GJELDER</Text>
            <Title order={1}>Bjarne ser hva fremtiden kan by på</Title>
            <Text className="bjarne-brodtekst">
              Legg hånden på skjermen, så leser vår motvillig klarsynte skadebehandler de små og store uhellene som kanskje venter. Dette er en lek, ikke forsikringsråd.
            </Text>
            <Button className="bjarne-knapp" onClick={startSkanning}>La Bjarne lese håndflaten</Button>
          </Box>
        </Box>

        {feil && (
          <Alert color="red" mt="xl" title="Bjarne trakk på skuldrene">
            {feil}
          </Alert>
        )}

        {svar && <Box className="svar-omrade"><Spaadomsliste svar={svar} /><AnkePanel key={skanneNr} spaadom={svar} onOverproevd={setSvar} /></Box>}

        <Box className="forsikring-valg">
          <Title order={2}>Sjekk pris og kjøp forsikring</Title>
          <Box className="valg-kolonne">
            <Group gap="sm"><Button variant="outline" className="valgknapp">Bil</Button><Button variant="outline" className="valgknapp">MC</Button><Button variant="outline" className="valgknapp">Person</Button><Button variant="outline" className="valgknapp">Hus</Button></Group>
            <Group gap="sm" mt="sm"><Button variant="outline" className="valgknapp">Innbø</Button><Button variant="outline" className="valgknapp">Hund</Button><Button variant="outline" className="valgknapp">Reise</Button></Group>
            <Text className="alle-forsikringer">Se alle forsikringer&nbsp; →</Text>
          </Box>
        </Box>
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
        .forsikring-valg { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; padding: 80px 10%; }
        .forsikring-valg h2 { color: #080c37; font-size: clamp(31px, 3.2vw, 46px); line-height: 1.08; letter-spacing: -.04em; max-width: 360px; }
        .valg-kolonne { padding-top: 5px; }.valgknapp { border-color: #080c37; border-radius: 999px; color: #080c37; background: white; font-size: 17px; }.alle-forsikringer { display: inline-block; margin-top: 22px; padding-bottom: 4px; color: #080c37; border-bottom: 1px solid #080c37; font-weight: 700; }
        @media (max-width: 760px) { .gjensidige-toppinnhold { height: 60px; }.gjensidige-segmenter, .gjensidige-handlinger, .gjensidige-undermeny { display: none; }.bjarne-hero, .forsikring-valg { grid-template-columns: 1fr; }.bjarne-handflate { min-height: 350px; }.bjarne-budskap { padding: 36px 28px 42px; }.forsikring-valg { padding: 52px 16px; gap: 16px; }.forside-innhold { padding: 0; }.bjarne-hero { margin: 0 -0.75rem; } }
      `}</style>
    </Box>
  );
}
