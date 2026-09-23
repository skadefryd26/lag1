import { Box, Text } from "@mantine/core";

type Props = {
  status: "klar" | "skanner" | "feilet";
  nedtelling: number;
  onLegg: () => void;
};

/**
 * Håndflate-silhuett. Brukeren "legger hånden på" (klikk/hold), og en
 * skanne-animasjon kjører over flaten med en nedtelling.
 */
export function Handflate({ status, nedtelling, onLegg }: Props) {
  const skanner = status === "skanner";
  const feilet = status === "feilet";

  return (
    <Box
      onClick={status === "klar" || feilet ? onLegg : undefined}
      style={{
        position: "relative",
        width: 240,
        height: 300,
        margin: "0 auto",
        cursor: status === "klar" || feilet ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      {/* Håndflate-silhuett (emoji som enkel silhuett i første versjon) */}
      <Box
        style={{
          fontSize: 180,
          textAlign: "center",
          lineHeight: "300px",
          filter: skanner ? "drop-shadow(0 0 24px #b388ff)" : "none",
          opacity: feilet ? 0.4 : 1,
          transition: "opacity 0.3s, filter 0.3s",
        }}
      >
        ✋
      </Box>

      {/* Skanne-linje */}
      {skanner && (
        <Box
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, transparent, #b388ff, #7048e8, #b388ff, transparent)",
            boxShadow: "0 0 16px 4px #7048e8",
            animation: "skann 1.6s ease-in-out infinite",
          }}
        />
      )}

      {/* Nedtelling / status-tekst */}
      <Text
        ta="center"
        mt="sm"
        fw={600}
        c={feilet ? "red.4" : "grape.2"}
        style={{ position: "absolute", bottom: -36, left: 0, right: 0 }}
      >
        {status === "klar" && "Legg hånden på flaten →"}
        {skanner && `Leser håndflaten … ${nedtelling}`}
        {feilet && "Skanningen glapp. Trykk for å prøve igjen."}
      </Text>

      <style>{`
        @keyframes skann {
          0% { top: 10%; }
          50% { top: 85%; }
          100% { top: 10%; }
        }
      `}</style>
    </Box>
  );
}
