import { Hono } from "hono/mod.ts";
import { dirname, parse, relative, resolve } from "std/path/mod.ts";
import { walk } from "std/fs/walk.ts";

export async function initFsRouting(hono: Hono, importUrl: string) {
  const mainPath = new URL(importUrl).pathname;
  const routesFolder = resolve(dirname(mainPath), "./routes");
  for await (
    const file of walk(routesFolder, { includeDirs: false })
  ) {
    const currentPath = new URL(import.meta.url).pathname;
    const importPath = relative(dirname(currentPath), file.path);

    const router = (await import(importPath)).default;
    if (!(router instanceof Hono)) continue;

    const relativePath = relative(routesFolder, file.path);
    const { dir, name } = parse(relativePath);
    const reqPath = dir ? `/${dir}/${name}` : `/${name}`;

    hono.route(reqPath, router);
  }
}
