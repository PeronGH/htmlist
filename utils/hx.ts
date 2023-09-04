import { Context, Hono } from "hono/mod.ts";
import { AddPrefix, addPrefix } from "$/utils/add_prefix.ts";

const htmxHttpMethods = ["get", "post"] as const;

export type HtmxHttpMethod = typeof htmxHttpMethods[number];

type HtmxCoreAttributesWithoutPrefixes = {
  target: string;
  swap: string;
  trigger: string;
};

export type HtmxCoreAttributes = AddPrefix<
  HtmxCoreAttributesWithoutPrefixes & Record<HtmxHttpMethod, string>,
  "hx-"
>;

export const hxRouter = new Hono();

export type HxHandler = (ctx: Context) => Response | Promise<Response>;

export type HxParams = Partial<
  & HtmxCoreAttributesWithoutPrefixes
  & {
    [M in HtmxHttpMethod]: HxHandler;
  }
>;

type ForceStringValues<T> = {
  [K in keyof T]: string;
};

type HtmxHttpMethodAndPathToHandler = {
  [M in HtmxHttpMethod]: Record<string, HxHandler | undefined>;
};

// initialize router map
const methodAndPathToHandler: HtmxHttpMethodAndPathToHandler = {
  get: {},
  post: {},
};

for (const method of htmxHttpMethods) {
  hxRouter[method]("/:id", (ctx) => {
    const { id } = ctx.req.param();
    const handler = methodAndPathToHandler[method][id];
    if (handler) {
      return handler(ctx);
    }
    return ctx.notFound();
  });
}

// cache
const hxCache = new Map<string, ReturnType<typeof hx>>();

export function hx<P extends HxParams>(
  params: P,
): AddPrefix<ForceStringValues<P>, "hx-"> {
  const id = new Error().stack!;
  const cached = hxCache.get(id);
  if (cached) {
    return cached as AddPrefix<ForceStringValues<P>, "hx-">;
  }
  // register routes for methods
  const methodToPath: Partial<Record<HtmxHttpMethod, string>> = {};

  for (const method of htmxHttpMethods) {
    const handler = params[method];
    if (!handler) continue;

    const uuid = crypto.randomUUID();
    methodAndPathToHandler[method][uuid] = handler;

    methodToPath[method] = `/hx/${uuid}`;
    console.debug("hx:", `new route: ${method} /hx/${uuid}`);
  }

  // return htmx attributes
  const attributes = addPrefix({
    ...params,
    ...methodToPath,
  } as ForceStringValues<P>);

  hxCache.set(id, attributes);
  console.debug("hx:", `cached: ${JSON.stringify(attributes)}`);

  return attributes;
}
