import "std/dotenv/load.ts";
import { Hono } from "hono/mod.ts";
import { Page } from "$/htmx/page.tsx";
import { assets } from "$/routes/assets.ts";
import { hx, hxRouter } from "$/utils/hx.ts";

const app = new Hono();

app.route("/assets", assets);
app.route("/hx", hxRouter);

// Your code goes here:

app.get("/", (ctx) =>
  ctx.html(
    <Page title="Index Page">
      <div class="container mx-auto p-4">
        <button
          {...hx({
            get(ctx) {
              return ctx.html(
                <p>
                  Loaded at {new Date().toString()}
                </p>,
              );
            },
            target: "#content",
            swap: "innerHTML",
          })}
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Load
        </button>
        <div id="content" />
      </div>
    </Page>,
  ));

Deno.serve(app.fetch);
