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

// initialize router map
type HtmxHttpMethodAndIdToHandler = {
  [M in HtmxHttpMethod]: Map<string, HxHandler>;
};

const methodAndIdToHandler: HtmxHttpMethodAndIdToHandler = {
  get: new Map(),
  post: new Map(),
};

const handlerToPath = new Map<HxHandler, string>();

for (const method of htmxHttpMethods) {
  hxRouter[method]("/:id", (ctx) => {
    const { id } = ctx.req.param();
    const handler = methodAndIdToHandler[method].get(id);
    if (handler) {
      return handler(ctx);
    }
    return ctx.notFound();
  });
}

export function hx<P extends HxParams>(
  params: P,
): AddPrefix<ForceStringValues<P>, "hx-"> {
  // register routes for methods
  const methodToPath: Partial<Record<HtmxHttpMethod, string>> = {};

  for (const method of htmxHttpMethods) {
    const handler = params[method];
    if (!handler) continue;

    // check if handler is already registered
    const cachedPath = handlerToPath.get(handler);
    if (cachedPath) {
      methodToPath[method] = cachedPath;
      console.debug("hx:", `cache hit: ${method} ${cachedPath}`);
      continue;
    }

    const uuid = crypto.randomUUID();
    const path = `/hx/${uuid}`;
    methodAndIdToHandler[method].set(uuid, handler);

    methodToPath[method] = path;
    handlerToPath.set(handler, path);
    console.debug("hx:", `new route: ${method} ${path}`);
  }

  // return htmx attributes
  return addPrefix({
    ...params,
    ...methodToPath,
  } as ForceStringValues<P>);
}
