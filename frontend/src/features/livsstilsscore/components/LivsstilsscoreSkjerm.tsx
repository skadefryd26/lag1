import { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Transition,
} from "@mantine/core";
import { VANER } from "./vaner.js";
import { BjarneAvatar } from "./BjarneAvatar.js";
import { useVurderMeg } from "../hooks/useVurderMeg.js";

export function LivsstilsscoreSkjerm() {
  const [valgte, setValgte] = useState<string[]>([]);
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
    vurder.mutate(valgte);
  }

  const score = vurder.data?.score ?? 0;
  const scoreFarge = score > 70 ? "red" : score > 40 ? "yellow" : "teal";

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title order={1}>Bjarnes livsstils-forsikringsscore</Title>
        <Text c="dimmed">
          Kryss av på vanene dine. Bjarne vurderer risikoen. Alt er på liksom.
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
