import { useEffect, useState } from "react";

const MYNTER = ["💸", "💰", "🪙", "💵"];
const ANTALL = 28;
const VARIGHET_MS = 2600;

type Fnugg = {
  id: number;
  venstre: number;
  forsinkelse: number;
  fart: number;
  drift: number;
  tegn: string;
  storrelse: number;
};

function lagFnugg(): Fnugg[] {
  return Array.from({ length: ANTALL }, (_, id) => ({
    id,
    venstre: Math.random() * 100,
    forsinkelse: Math.random() * 0.6,
    fart: 1.6 + Math.random() * 1.1,
    drift: (Math.random() - 0.5) * 120,
    tegn: MYNTER[Math.floor(Math.random() * MYNTER.length)],
    storrelse: 22 + Math.random() * 22,
  }));
}

/**
 * Regner penger nedover skjermen én gang når `aktiv` slår om til true.
 * Rydder etter seg selv, så den maler ikke mynter i evig tid.
 */
export function PengeRegn({ aktiv }: { aktiv: boolean }) {
  const [fnugg, setFnugg] = useState<Fnugg[] | null>(null);

  useEffect(() => {
    if (!aktiv) return;
    setFnugg(lagFnugg());
    const timer = setTimeout(() => setFnugg(null), VARIGHET_MS);
    return () => clearTimeout(timer);
  }, [aktiv]);

  if (!fnugg) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      <style>{`
        @keyframes pengeFall {
          0%   { transform: translateY(-12vh) translateX(0) rotate(0deg); opacity: 0; }
          8%   { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(112vh) translateX(var(--drift)) rotate(540deg); opacity: 0; }
        }
      `}</style>
      {fnugg.map((f) => (
        <span
          key={f.id}
          style={{
            position: "absolute",
            top: 0,
            left: `${f.venstre}%`,
            fontSize: f.storrelse,
            ["--drift" as string]: `${f.drift}px`,
            animation: `pengeFall ${f.fart}s ${f.forsinkelse}s cubic-bezier(0.4, 0, 0.7, 1) forwards`,
          }}
        >
          {f.tegn}
        </span>
      ))}
    </div>
  );
}
