import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { RootLayout } from "./RootLayout.js";
import { LivsstilsscoreSkjerm } from "../components/LivsstilsscoreSkjerm.js";

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LivsstilsscoreSkjerm,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
