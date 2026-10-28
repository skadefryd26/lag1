import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import { VANER } from "./vaner.js";

// Hver vane får et "før -> etter"-bilde (emoji) og en kort etikett for
// reisen mot et sunnere liv. Alt er på liksom, i Bjarnes ånd.
type Reise = { for: string; etter: string; tekst: string };

const REISER: Record<string, Reise> = {
  brus: { for: "🥤", etter: "💧", tekst: "Brus → vann" },
  fastfood: { for: "🍔", etter: "🥗", tekst: "Fastfood → salat" },
  gronnsaker: { for: "🥦", etter: "🍲", tekst: "Pynt → faktisk mat" },
  nattmat: { for: "🌙", etter: "😴", tekst: "Nattmat → nattesøvn" },
  sofa: { for: "🛋️", etter: "🚶", tekst: "Sofa → en tur ut" },
  heis: { for: "🛗", etter: "🪜", tekst: "Heis → trappa" },
  fredagspils: { for: "🍺", etter: "🫖", tekst: "«Én øl» → te" },
  bingedrikking: { for: "🍻", etter: "📅", tekst: "Lørdagsfyll → fordelt uke" },
  royk: { for: "🚬", etter: "🌬️", tekst: "Røyk → frisk luft" },
  vaping: { for: "💨", etter: "🫁", tekst: "Vaping → vanlig pust" },
};

export function SunnereLivsstil({ valgte }: { valgte: string[] }) {
  // Finn id-ene til de valgte vanene (valgte inneholder etikettene).
  const valgteIder = VANER.filter((v) => valgte.includes(v.etikett)).map(
    (v) => v.id,
  );
  const reiser = valgteIder
    .map((id) => REISER[id])
    .filter((r): r is Reise => Boolean(r));

  return (
    <Card
      radius="md"
      padding="md"
      style={{
        background:
          "linear-gradient(135deg, var(--mantine-color-brand-0), var(--mantine-color-teal-0))",
        border: "1px solid var(--mantine-color-brand-2)",
      }}
    >
      <Stack gap="sm">
        <div>
          <Group gap="xs" align="center">
            <Text fw={800}>Bjarnes bilde av et sunnere deg</Text>
            <Badge color="teal" variant="light">
              På vei
            </Badge>
          </Group>
          <Text size="sm" c="dimmed">
            En liten reise basert på valgene dine. Fra venstre mot høyre.
          </Text>
        </div>

        {reiser.length === 0 ? (
          <Group gap="sm" justify="center" py="xl">
            <Text size="5rem">🧘</Text>
            <Text fs="italic" c="dimmed">
              Ingen vaner valgt – blanke ark.
            </Text>
          </Group>
        ) : (
          <Stack gap="lg" py="sm">
            {reiser.map((r) => (
              <Group key={r.tekst} justify="space-between" wrap="nowrap">
                <Group gap="md" wrap="nowrap" align="center">
                  <Text size="3.5rem" aria-hidden>
                    {r.for}
                  </Text>
                  <Text size="2.5rem" c="brand" fw={700} aria-hidden>
                    →
                  </Text>
                  <Text size="3.5rem" aria-hidden>
                    {r.etter}
                  </Text>
                </Group>
                <Text size="md" fw={600}>
                  {r.tekst}
                </Text>
              </Group>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
