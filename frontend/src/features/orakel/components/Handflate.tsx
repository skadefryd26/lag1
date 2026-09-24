import { useEffect, useRef, useState } from "react";
import { Box, Button, Text } from "@mantine/core";
import { spillSpaaord } from "../lyd/bjarneLyd";

type Props = {
  status: "klar" | "skanner" | "feilet";
  nedtelling: number;
  onLegg: () => void;
  onHandMatch: () => void;
};

// Bjarne mumler salgsargumenter mens han "vurderer" håndflaten.
const TROLLORD = [
  "… risikoprofil aktivert …",
  "egenandel, dekningsomfang, signatur …",
  "Livslinje Pluss, naturligvis …",
  "… trolldom og tilleggsdekning …",
  "krystallum maximus, premie justert …",
  "… en unik salgsmulighet. For deg, altså …",
  "vann, ild, kaos … og månedlig betaling …",
  "presto skadus, hokus forsikringus …",
];

export function Handflate({ status, nedtelling, onLegg, onHandMatch }: Props) {
  const skanner = status === "skanner";
  const feilet = status === "feilet";
  const [trollordIndex, setTrollordIndex] = useState(0);
  const [kameraStatus, setKameraStatus] = useState<"klar" | "aktiv" | "avslatt">("klar");
  const [handStatus, setHandStatus] = useState<"leter" | "funnet" | "matcher" | "feil">("leter");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const harMatchetRef = useRef(false);
  const starterKameraRef = useRef(false);
  const analysererRef = useRef(false);

  async function startKamera() {
    if (starterKameraRef.current || streamRef.current) return;
    starterKameraRef.current = true;
    try {
      setKameraStatus("klar");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (!videoRef.current) throw new Error("Mangler videoflate");
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      // Vis kamerabildet med en gang. Håndgjenkjenningen får laste i bakgrunnen.
      setKameraStatus("aktiv");
    } catch {
      setKameraStatus("avslatt");
    } finally {
      starterKameraRef.current = false;
    }
  }

  useEffect(() => { void startKamera(); }, []);

  useEffect(() => {
    if (kameraStatus !== "aktiv" || status !== "klar") return;

    // Vi er i "klar"-tilstand: nullstill match-sperren her (ikke i en
    // separat effekt), så det ikke blir en kappløp der deteksjonen bailer
    // på en gammel sperre før den rekker å bli nullstilt.
    harMatchetRef.current = false;

    const canvas = document.createElement("canvas");
    const sjekkHand = async () => {
      if (analysererRef.current || harMatchetRef.current) return;
      const video = videoRef.current;
      if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      canvas.width = 320;
      canvas.height = 240;
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
      analysererRef.current = true;
      try {
        const res = await fetch("/api/handflate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bilde: canvas.toDataURL("image/jpeg", 0.7) }) });
        const data = await res.json() as { handflate?: boolean };
        if (data.handflate) {
          setHandStatus("matcher");
          harMatchetRef.current = true;
          onHandMatch();
        } else {
          setHandStatus("leter");
        }
      } catch {
        setHandStatus("feil");
      } finally {
        analysererRef.current = false;
      }
    };
    void sjekkHand();
    const intervall = window.setInterval(() => void sjekkHand(), 1800);
    return () => window.clearInterval(intervall);
  }, [kameraStatus, onHandMatch, status]);

  useEffect(() => {
    // Ved feil: nullstill sperren så en ny skanning kan starte.
    // (I "klar" gjøres dette i deteksjons-effekten over.)
    if (status === "feilet") {
      harMatchetRef.current = false;
      setHandStatus("leter");
    }
  }, [status]);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  // Veksle trollord mens hånden leses, og les dem høyt.
  // Vent til den korte summingen er ferdig før Bjarne begynner å prate.
  useEffect(() => {
    if (!skanner) return;
    const SUMME_MS = 750;
    let intervall: number | undefined;
    const start = window.setTimeout(() => {
      // les det første trollordet når summingen er ferdig
      spillSpaaord(TROLLORD[trollordIndex]);
      intervall = window.setInterval(() => {
        setTrollordIndex((i) => {
          const neste = (i + 1) % TROLLORD.length;
          spillSpaaord(TROLLORD[neste]);
          return neste;
        });
      }, 1600);
    }, SUMME_MS);
    return () => {
      window.clearTimeout(start);
      if (intervall) window.clearInterval(intervall);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skanner]);

  return (
    <Box
      style={{
        position: "relative",
        width: 340,
        height: 440,
        margin: "0 auto",
        cursor: "default",
        userSelect: "none",
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 300,
          height: 300,
          transform: "translate(-50%, -50%)",
          fontSize: 300,
          lineHeight: 1,
          textAlign: "center",
          filter: skanner
            ? "drop-shadow(0 0 40px #b388ff) drop-shadow(0 0 12px #7048e8)"
            : "none",
          opacity: feilet ? 0.35 : 1,
          transition: "opacity 0.3s, filter 0.3s",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: "scaleX(-1)",
            opacity: kameraStatus === "aktiv" ? 0.62 : 0,
            transition: "opacity 180ms ease",
          }}
        />
        {kameraStatus !== "aktiv" && (
          <Box style={{ position: "absolute", inset: 18, display: "grid", placeItems: "center", textAlign: "center", border: "1px dashed rgba(211,184,255,.6)", borderRadius: "50%", background: "rgba(24, 13, 58, .4)" }}>
            <Box>
              <Text c="grape.1" fw={700}>Klargjør kameraet</Text>
              <Text c="grape.2" size="sm" mt={5} maw={200}>Godkjenn kameraet når nettleseren spør. Det brukes bare mens denne siden er åpen.</Text>
              <Button mt="md" size="xs" color="grape" onClick={startKamera}>
                {kameraStatus === "avslatt" ? "Prøv kameraet igjen" : "Slå på kamera"}
              </Button>
            </Box>
          </Box>
        )}
        {kameraStatus === "aktiv" && (
          <Text
            size="xs"
            fw={700}
            style={{ position: "absolute", zIndex: 2, top: 14, left: 14, padding: "7px 10px", borderRadius: 999, background: "rgba(9, 8, 35, .76)", color: "white" }}
          >
            {handStatus === "leter" && "Ser etter hånd ..."}
            {handStatus === "funnet" && "Hånd oppdaget - flytt den inn i omrisset"}
            {handStatus === "matcher" && "Match! Starter spådom ..."}
            {handStatus === "feil" && "Håndgjenkjenning er ikke tilgjengelig"}
          </Text>
        )}
        <svg viewBox="0 0 300 300" aria-label="Plasser håndflaten innenfor omrisset" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
          <path
            d="M92 280 L91 230 C75 214 64 193 66 169 C68 145 77 126 91 111 L91 59 C91 44 100 34 112 34 C124 34 132 44 132 59 L132 37 C132 22 141 13 153 13 C165 13 173 22 173 37 L173 28 C173 13 182 5 194 5 C207 5 215 13 215 28 L215 46 C215 32 224 23 236 23 C248 23 256 32 256 46 L256 77 C256 64 264 56 276 56 C288 56 295 65 294 78 L290 160 C288 190 279 214 263 239 C253 254 250 269 250 280 Z"
            className={skanner ? "hand-kamera-omriss skanner" : "hand-kamera-omriss"}
            fill="rgba(179, 136, 255, 0.08)"
          />
          <path className="hand-kamera-linje" d="M96 137 C132 125 185 132 245 160 M91 164 C130 169 180 168 239 151 M100 188 C128 200 143 224 145 252" />
        </svg>
        {skanner && (
          <svg
            viewBox="0 0 300 300"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            <path
              d="M208 166 C 194 186, 188 225, 143 258"
              className="livslinje"
              stroke="#00e5ff"
              strokeWidth={3}
              fill="none"
            />
            <path
              d="M76 202 C 120 218, 176 211, 209 192"
              className="livslinje"
              stroke="#b388ff"
              strokeWidth={3}
              fill="none"
            />
            <path
              d="M77 165 C 116 151, 174 152, 208 166"
              className="livslinje"
              stroke="#ff4dff"
              strokeWidth={3}
              fill="none"
            />
          </svg>
        )}
      </Box>

      {/* Gnister – holdes innenfor håndflaten (x 40-65%, y 55-80%) */}
      {skanner && (
        <>
          {[...Array(8)].map((_, i) => (
            <Box
              key={i}
              style={{
                position: "absolute",
                left: `${38 + Math.random() * 22}%`,
                top: `${52 + Math.random() * 22}%`,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: i % 2 ? "#00e5ff" : "#ffe066",
                boxShadow: `0 0 12px 3px ${i % 2 ? "#00e5ff" : "#ffe066"}`,
                animation: `gnist 0.9s ${i * 0.12}s infinite ease-out`,
              }}
            />
          ))}
        </>
      )}

      {/* Trollord + nedtelling / status */}
      <Text
        ta="center"
        mt="sm"
        fw={600}
        c={feilet ? "red.4" : "grape.2"}
        style={{ position: "absolute", bottom: -52, left: 0, right: 0, minHeight: 44 }}
      >
        {status === "klar" && (kameraStatus === "aktiv" ? "Plasser håndflaten din innenfor omrisset" : "Godkjenn kameraet for å starte spådommen")}
        {skanner && (
          <>
            <span style={{ display: "block", fontStyle: "italic", color: "#00e5ff" }}>
              {TROLLORD[trollordIndex]}
            </span>
            <span>{nedtelling > 0 ? `Leser håndflaten … ${nedtelling}` : "Tyder skjebnen …"}</span>
          </>
        )}
        {feilet && "Skanningen mangler salgbar dokumentasjon. Trykk for å prøve igjen."}
      </Text>

      <style>{`
        @keyframes gnist {
          0% { transform: scale(0.4); opacity: 0; }
          40% { transform: scale(1.4); opacity: 1; }
          100% { transform: scale(0.4); opacity: 0; }
        }
        .livslinje {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: tegne 2s ease-in-out infinite alternate;
          filter: drop-shadow(0 0 6px currentColor);
        }
        @keyframes tegne {
          to { stroke-dashoffset: 0; }
        }
        .hand-kamera-omriss { stroke: #f1d8ff; stroke-width: 3; stroke-linejoin: round; filter: drop-shadow(0 0 8px #8b5cf6); }
        .hand-kamera-omriss.skanner { stroke-dasharray: 900; stroke-dashoffset: 900; animation: tegn-kamera-hand 2.2s linear infinite; }
        .hand-kamera-linje { fill: none; stroke: rgba(241,216,255,.72); stroke-width: 1.5; stroke-linecap: round; }
        @keyframes tegn-kamera-hand { to { stroke-dashoffset: 0; } }
      `}</style>
    </Box>
  );
}
