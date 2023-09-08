import "std/dotenv/load.ts";
import { Hono } from "hono/mod.ts";
import { Page } from "$/htmx/page.tsx";
import { serveStatic } from "hono/middleware.ts";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { assetsRouter } from "$/routes/assets.ts";

const app = new Hono();
app.route("/assets", assetsRouter);

// Your code goes here:

app.get("/", (ctx) =>
  ctx.html(
    <Page title="Index Page">
      <div class="container mx-auto p-4">
        <button
          id="load-btn"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          hx-get="/load"
          hx-target="#content"
          hx-swap="outerHTML"
        >
          Load
        </button>
        <div id="content" />
      </div>
    </Page>,
  ));

app.get(
  "/load",
  zValidator("query", z.object({ defaultName: z.string().default("you") })),
  (ctx) =>
    ctx.html(
      <div
        id="content"
        class="mt-4 p-2 border-4 border-indigo-500 rounded"
        _="init put 'Reload' into #load-btn"
      >
        <input
          type="text"
          name="name"
          value={ctx.req.valid("query").defaultName}
        />
        <button
          class="ml-2 p-2 border-2 border-indigo-500 rounded"
          _="on click put `Hi, ${<input/>'s value}!` into #content"
        >
          Greet
        </button>
      </div>,
    ),
);

app.get("*", serveStatic({ root: "./static/" }));
Deno.serve(app.fetch);
