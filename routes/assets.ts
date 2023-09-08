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
const fetchHyperscriptScript = lazy(() =>
  fetch(`https://unpkg.com/hyperscript.org@${VERSIONS.HYPERSCRIPT}`)
);

const assetsRouter = new Hono();

assetsRouter.get(
  `/tailwindcss@${VERSIONS.TAILWINDCSS}`,
  () => fetchTailwindcssScript().then((res) => res.clone()),
);
assetsRouter.get(
  `/htmx@${VERSIONS.HTMX}`,
  () => fetchHtmxScript().then((res) => res.clone()),
);
assetsRouter.get(
  `/hyperscript@${VERSIONS.HYPERSCRIPT}`,
  () => fetchHyperscriptScript().then((res) => res.clone()),
);

export default assetsRouter;
