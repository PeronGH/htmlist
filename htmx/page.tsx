import { Children } from "$/utils/types.ts";

export interface PageProps {
  title: string;
  children: Children;
}

export function Page({ title, children }: PageProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <script src="/assets/tailwindcss" />
        <script src="/assets/htmx" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
