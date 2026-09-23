import { useEffect, useState } from "react";
import { Box, Text } from "@mantine/core";
import { spillSpaaord } from "../lyd/bjarneLyd";

type Props = {
  status: "klar" | "skanner" | "feilet";
  nedtelling: number;
  onLegg: () => void;
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

export function Handflate({ status, nedtelling, onLegg }: Props) {
  const skanner = status === "skanner";
  const feilet = status === "feilet";
  const [trollordIndex, setTrollordIndex] = useState(0);

  // Veksle trollord mens hånden leses, og les dem høyt
  useEffect(() => {
    if (!skanner) return;
    // les det første trollordet med en gang
    spillSpaaord(TROLLORD[trollordIndex]);
    const t = window.setInterval(() => {
      setTrollordIndex((i) => {
        const neste = (i + 1) % TROLLORD.length;
        spillSpaaord(TROLLORD[neste]);
        return neste;
      });
    }, 1600);
    return () => window.clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skanner]);

  return (
    <Box
      onClick={status === "klar" || feilet ? onLegg : undefined}
      style={{
        position: "relative",
        width: 340,
        height: 440,
        margin: "0 auto",
        cursor: status === "klar" || feilet ? "pointer" : "default",
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
        ✋
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
        {status === "klar" && "Legg hånden på flaten →"}
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
      `}</style>
    </Box>
  );
}
