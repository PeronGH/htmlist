import "std/dotenv/load.ts";
import { Hono } from "hono/mod.ts";
import { Page } from "$/htmx/page.tsx";
import { assets } from "$/routes/assets.ts";
import { serveStatic } from "hono/middleware.ts";

const app = new Hono();

app.get("*", serveStatic({ root: "./static/" }));
app.route("/assets", assets);

// Your code goes here:

app.get("/", (ctx) =>
  ctx.html(
    <Page title="Index Page">
      <div class="container mx-auto p-4">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          hx-get="/load"
          hx-target="#replaceMe"
          hx-swap="innerHTML"
        >
          Load
        </button>
        <div id="replaceMe" />
      </div>
    </Page>,
  ));

app.get(
  "/load",
  (ctx) =>
    ctx.html(
      <div id="replaceMe" class="mt-4 p-2 border-4 border-indigo-500 rounded">
        <p>Loaded at {new Date().toString()}</p>
        <button
          class="p-2 border-2 border-indigo-500 rounded"
          _="
on pointerdown
  repeat until event pointerup
    set rand to Math.random() * 255
    transition
      *background-color
      to `hsl($rand 100% 90%)`
      over 250ms
  end"
        >
          Click Me and Hold
        </button>
      </div>,
    ),
);

Deno.serve(app.fetch);
