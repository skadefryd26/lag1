import { useState } from "react";
import { Badge, Button, Card, Group, List, Stack, Text, Title } from "@mantine/core";

type Props = {
  score: number;
  antallVaner: number;
};

export function FiktivtTilbud({ score, antallVaner }: Props) {
  const [simulertSendt, setSimulertSendt] = useState(false);
  const eksempelPris = 249 + Math.ceil(score / 10) * 35 + antallVaner * 12;

  return (
    <Card
      withBorder
      radius="md"
      padding="lg"
      style={{
        background:
          "linear-gradient(135deg, var(--mantine-color-blue-0), var(--mantine-color-white))",
        borderColor: "var(--mantine-color-blue-3)",
      }}
    >
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={4}>Bjarnes tilbudsforslag</Title>
            <Text size="sm" c="dimmed">
              En dramatisk demo med priser Bjarne har funnet på.
            </Text>
          </div>
          <Badge color="grape" variant="light">
            Kun fiktivt
          </Badge>
        </Group>

        <Card withBorder radius="md" padding="md" bg="white">
          <Text size="sm" c="dimmed">
            Oppdiktet eksempelpris
          </Text>
          <Group align="baseline" gap="xs">
            <Text fw={900} size="2.5rem" c="brand">
              {eksempelPris} kr
            </Text>
            <Text c="dimmed">/ måned</Text>
          </Group>
          <Text size="xs" c="dimmed">
            Beregnet med en tilfeldig demoregel — ikke en ekte pris eller et pristilbud.
          </Text>
        </Card>

        <div>
          <Text fw={700} mb="xs">
            Eksempel på dekninger
          </Text>
          <List spacing="xs">
            <List.Item>Innboforsikring: oppdiktet dekning opptil 500 000 kr</List.Item>
            <List.Item>Reiseforsikring: oppdiktet dekning opptil 100 000 kr</List.Item>
            <List.Item>Egenandel: oppdiktet eksempel på 4 000 kr</List.Item>
          </List>
        </div>

        <Text size="sm">
          «Jeg har satt sammen et tilbud. Om tallene er riktige? Nei. Om jeg ser
          overbevisende ut med en kalkulator? Absolutt.»
        </Text>

        <Button
          color="brand"
          onClick={() => setSimulertSendt(true)}
          aria-label="Simuler at det fiktive tilbudet sendes"
        >
          {simulertSendt ? "Tilbud simulert" : "Simuler sending av tilbud"}
        </Button>
        {simulertSendt && (
          <Text role="status" c="teal" fw={600}>
            Bjarne har simulert sendingen. Ingen e-post er sendt, og ingen tilbud
            er opprettet.
          </Text>
        )}

        <Text size="xs" c="dimmed">
          Hele pris- og dekningsforslaget er oppdiktet for demoen. Det sier
          ingenting om en ekte forsikringsavtale. Sjekk faktiske vilkår hos
          forsikringsselskapet.
        </Text>
      </Stack>
    </Card>
  );
}
