import { Hono } from "hono/mod.ts";
import { parse, relative, resolve } from "std/path/mod.ts";
import { walk } from "std/fs/walk.ts";

export async function initFsRouting(hono: Hono, importUrl: string) {
  const { pathname } = new URL(importUrl);
  const routesFolder = resolve(pathname, "../routes");
  for await (
    const file of walk(routesFolder, {
      includeDirs: false,
    })
  ) {
    const router = (await import(file.path)).default;
    if (!(router instanceof Hono)) continue;

    const relativePath = relative(routesFolder, file.path);
    const { dir, name } = parse(relativePath);
    const reqPath = dir ? `/${dir}/${name}` : `/${name}`;

    hono.route(reqPath, router);
  }
}
