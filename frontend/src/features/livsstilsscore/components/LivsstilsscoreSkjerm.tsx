import { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Group,
  List,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Transition,
} from "@mantine/core";
import { VANER } from "./vaner.js";
import { BjarneAvatar } from "./BjarneAvatar.js";
import { SunnereLivsstil } from "./SunnereLivsstil.js";
import { useVurderMeg } from "../hooks/useVurderMeg.js";

export function LivsstilsscoreSkjerm() {
  const [valgte, setValgte] = useState<string[]>([]);
  const [vurderte, setVurderte] = useState<string[]>([]);
  const vurder = useVurderMeg();

  const tilstand = vurder.isPending
    ? "tenker"
    : vurder.data
      ? "svart"
      : "hvile";

  function veksle(etikett: string, på: boolean) {
    setValgte((forrige) =>
      på ? [...forrige, etikett] : forrige.filter((v) => v !== etikett),
    );
  }

  function vurderMeg() {
    setVurderte(valgte);
    vurder.mutate(valgte);
  }

  const score = vurder.data?.score ?? 0;
  const scoreFarge = score > 70 ? "red" : score > 40 ? "yellow" : "teal";

  const personligeTips = VANER.filter((vane) =>
    valgte.includes(vane.etikett),
  )
    .map((vane) => vane.tips)
    .slice(0, 3);
  const tips =
    personligeTips.length > 0
      ? personligeTips
      : [
          "Velg ett lite grep som passer hverdagen din, for eksempel en kort gåtur eller litt mer vann.",
          "Små endringer du trives med, er lettere å holde fast ved. Bjarne har forsøkt å gjøre dette til et regneark.",
        ];

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title order={1}>Små livsstilsgrep, forsikring som passer</Title>
        <Text c="dimmed">
          Få noen vennlige tips til vanene dine, og husk å sjekke at forsikringen
          passer til livet ditt. Bjarne later som han ikke bryr seg.
        </Text>
      </Stack>

      <Card withBorder radius="md" padding="lg">
        <BjarneAvatar tilstand={tilstand} />
      </Card>

      <Card withBorder radius="md" padding="lg">
        <Stack gap="md">
          <Title order={3}>Hvilke av disse kjenner du deg igjen i?</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            {VANER.map((vane) => (
              <Checkbox
                key={vane.id}
                label={vane.etikett}
                checked={valgte.includes(vane.etikett)}
                onChange={(e) => veksle(vane.etikett, e.currentTarget.checked)}
              />
            ))}
          </SimpleGrid>

          <Group justify="space-between" align="center">
            <Text size="sm" c="dimmed">
              {valgte.length} valgt
            </Text>
            <Button
              size="md"
              color="brand"
              loading={vurder.isPending}
              onClick={vurderMeg}
            >
              {vurder.isPending ? "Bjarne sukker..." : "Vurder meg"}
            </Button>
          </Group>
        </Stack>
      </Card>

      <Transition mounted={!!vurder.data} transition="slide-up" duration={400}>
        {(styles) => (
          <Card withBorder radius="md" padding="lg" style={styles}>
            <Stack gap="sm">
              <Text size="sm" c="dimmed">
                Scoren er bare for moro skyld. Den sier ingenting om helsen din
                eller hva forsikringen din dekker.
              </Text>
              <Group justify="space-between" align="flex-end">
                <Title order={3}>Bjarnes dom</Title>
                <Text fw={900} size="2rem" c={scoreFarge}>
                  {score}
                  <Text span size="md" c="dimmed">
                    {" "}
                    / 100
                  </Text>
                </Text>
              </Group>
              <Progress value={score} color={scoreFarge} size="lg" radius="xl" />
              <Text size="lg" style={{ lineHeight: 1.6 }}>
                {vurder.data?.begrunnelse}
              </Text>
              <Card withBorder radius="md" padding="md">
                <Stack gap="xs">
                  <Title order={4}>Små grep Bjarne faktisk anbefaler</Title>
                  <List spacing="xs">
                    {(vurder.data?.tips?.length
                      ? vurder.data.tips.slice(0, 3)
                      : tips
                    ).map((tipslinje) => (
                      <List.Item key={tipslinje}>{tipslinje}</List.Item>
                    ))}
                  </List>
                  <Text size="xs" c="dimmed">
                    Velg bare råd som passer for deg. Dette er generelle tips,
                    ikke medisinsk rådgivning.
                  </Text>
                </Stack>
              </Card>
              <Card
                radius="md"
                padding="md"
                style={{
                  background: "var(--mantine-color-blue-0)",
                  border: "1px solid var(--mantine-color-blue-2)",
                }}
              >
                <Stack gap="xs">
                  <Title order={4}>Passer forsikringen fortsatt til livet ditt?</Title>
                  <Text>
                    {vurder.data?.forsikringspaminnelse ??
                      "Se gjennom forsikringsvilkårene eller spør forsikringsselskapet om dekningen passer til livet ditt."}{" "}
                    Bjarne kan lese vilkår, men kan ikke trylle fram dekning.
                  </Text>
                  <Text size="xs" c="dimmed">
                    Livsstilstipsene endrer ikke forsikringen eller prisen din.
                    Sjekk alltid vilkårene for din egen avtale.
                  </Text>
                </Stack>
              </Card>
              <SunnereLivsstil valgte={vurderte} />
            </Stack>
          </Card>
        )}
      </Transition>

      {vurder.isError && (
        <Text c="red">
          Noe gikk galt da Bjarne skulle vurdere deg. Prøv igjen.
        </Text>
      )}
    </Stack>
  );
}
