import { Container } from "@mantine/core";
import { Outlet } from "@tanstack/react-router";

export function RootLayout() {
  return (
    <Container size="sm" py="xl">
      <Outlet />
    </Container>
  );
}
