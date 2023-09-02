import "std/dotenv/load.ts";
import { Hono } from "hono/mod.ts";
import { Page } from "$/htmx/page.tsx";
import { assets } from "$/routes/assets.ts";

const app = new Hono();

app.route("/assets", assets);

app.get("/", (ctx) =>
  ctx.html(
    <Page title="Index Page">
      <h1>Hello, world!</h1>
    </Page>,
  ));

Deno.serve(app.fetch);
