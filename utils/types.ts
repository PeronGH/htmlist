import type { HtmlEscapedString } from "hono/utils/html.ts";

export type Children =
  | string
  | HtmlEscapedString
  | HtmlEscapedString[];
