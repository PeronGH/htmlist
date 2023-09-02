import { Hono } from "hono/mod.ts";
import { lazy } from "$/utils/lazy.ts";

const tailwindcssScript = lazy(() => fetch("https://cdn.tailwindcss.com"));
const htmxScript = lazy(() =>
  fetch("https://unpkg.com/htmx.org/dist/htmx.min.js")
);

export const assets = new Hono();

assets.get(
  "/tailwindcss",
  () => tailwindcssScript().then((res) => res.clone()),
);
assets.get("/htmx", () => htmxScript().then((res) => res.clone()));
