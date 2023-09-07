import { PropsWithChildren } from "$/utils/types.ts";
import { VERSIONS } from "$/constants/versions.ts";

export interface PageProps extends PropsWithChildren {
  title: string;
}

export function Page({ title, children }: PageProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <script src={`/assets/tailwindcss@${VERSIONS.TAILWINDCSS}`} />
        <script src={`/assets/htmx@${VERSIONS.HTMX}`} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
