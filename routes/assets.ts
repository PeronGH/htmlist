import { Hono } from "hono/mod.ts";
import { lazy } from "$/utils/lazy.ts";
import { VERSIONS } from "$/constants/versions.ts";

const fetchTailwindcssScript = lazy(() =>
  fetch(
    `https://cdn.tailwindcss.com/${VERSIONS.TAILWINDCSS}?plugins=forms,typography,aspect-ratio`,
  )
);
const fetchHtmxScript = lazy(() =>
  fetch(`https://unpkg.com/htmx.org@${VERSIONS.HTMX}/dist/htmx.min.js`)
);

export const assets = new Hono();

assets.get(
  `/tailwindcss@${VERSIONS.TAILWINDCSS}`,
  () => fetchTailwindcssScript().then((res) => res.clone()),
);
assets.get(
  `/htmx@${VERSIONS.HTMX}`,
  () => fetchHtmxScript().then((res) => res.clone()),
);
