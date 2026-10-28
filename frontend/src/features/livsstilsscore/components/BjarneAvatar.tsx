import { Avatar, Badge, Group, Stack, Text } from "@mantine/core";

type Props = {
  tilstand: "hvile" | "tenker" | "svart";
};

// Bjarnes ansikt. En enkel kaffekopp-avatar med humør etter tilstand.
export function BjarneAvatar({ tilstand }: Props) {
  const humor =
    tilstand === "tenker"
      ? "Sukker... vurderer... hvor er kaffen?"
      : tilstand === "svart"
        ? "Der, ja. Vær så god."
        : "Bjarne, til tjeneste. Motvillig.";

  return (
    <Group gap="sm" wrap="nowrap">
      <Avatar
        radius="xl"
        size={56}
        styles={{
          placeholder: {
            background:
              "linear-gradient(135deg, var(--mantine-color-brand-6), var(--mantine-color-brand-9))",
            color: "white",
            fontSize: 26,
          },
        }}
      >
        ☕
      </Avatar>
      <Stack gap={2}>
        <Group gap="xs">
          <Text fw={700}>Bjarne</Text>
          <Badge variant="light" color="brand" size="sm">
            AI-risikovurderer
          </Badge>
        </Group>
        <Text size="sm" c="dimmed" fs={tilstand === "tenker" ? "italic" : undefined}>
          {humor}
        </Text>
      </Stack>
    </Group>
  );
}
