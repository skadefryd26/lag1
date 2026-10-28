import { useState } from "react";
import { Badge, Button, Card, Group, List, Stack, Text, Title } from "@mantine/core";

type Props = {
  antallVaner: number;
};

export function FiktivtTilbud({ antallVaner }: Props) {
  const [simulertSendt, setSimulertSendt] = useState(false);
  const grunnpris = 299;
  const pristilleggPerVane = 85;
  const vaneTillegg = antallVaner * pristilleggPerVane;
  const eksempelPris = grunnpris + vaneTillegg;
  const produktnivå =
    antallVaner >= 7
      ? {
          navn: "Bjarne Premium Pluss Pluss",
          kommentar:
            "Bjarne har oppgradert deg til Pluss Pluss. Han sier det er på grunn av risikoen. Kaffebudsjettet sier noe annet.",
          farge: "red",
        }
      : antallVaner >= 4
        ? {
            navn: "Bjarne Pluss",
            kommentar:
              "Du får Pluss. Bjarne kaller det en helhetsvurdering og ber om å få beholde kalkulatoren.",
            farge: "orange",
          }
        : {
            navn: "Bjarne Basis",
            kommentar:
              "Basis holder foreløpig. Bjarne virker nesten skuffet over at regnearket ble så kort.",
            farge: "teal",
          };

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
            Oppdiktet eksempelpris per måned
          </Text>
          <Group align="baseline" gap="xs">
            <Text fw={900} size="2.5rem" c="brand">
              {eksempelPris} kr
            </Text>
            <Text c="dimmed">/ måned</Text>
          </Group>
          <Text size="sm" fw={700}>
            {grunnpris} kr i grunnpris + {vaneTillegg} kr for {antallVaner} valgte {antallVaner === 1 ? "vane" : "vaner"}
          </Text>
          <Text size="sm" c="dimmed">
            Hver ekstra vane legger på {pristilleggPerVane} oppdiktede kroner. Ja, Bjarne tar betalt per bekymring.
          </Text>
          <Text size="xs" c="dimmed">
            Bare demomatematikk — dette er ikke en ekte pris eller et pristilbud.
          </Text>
        </Card>

        <Card withBorder radius="md" padding="md" bg="white">
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" c="dimmed">
                Bjarnes anbefalte demo-produkt
              </Text>
              <Text fw={900} size="xl">
                {produktnivå.navn}
              </Text>
            </div>
            <Badge color={produktnivå.farge} size="lg" variant="light">
              {antallVaner} {antallVaner === 1 ? "vane" : "vaner"}
            </Badge>
          </Group>
          <Text mt="xs">«{produktnivå.kommentar}»</Text>
          <Text size="xs" c="dimmed" mt="xs">
            Produktnivåene er oppdiktet og bestemmes bare av valgene i denne demoen.
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
