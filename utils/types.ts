import type { HtmlEscaped } from "hono/utils/html.ts";

export type Children =
  | string
  | HtmlEscaped
  | HtmlEscaped[];

export interface PropsWithChildren {
  children?: Children;
}

// deno-lint-ignore ban-types
export type FC<P = {}> = (props: P & PropsWithChildren) => HtmlEscaped;
