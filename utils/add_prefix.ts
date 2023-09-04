export function addPrefix<T extends object>(
  obj: T,
): AddPrefix<T, "hx-"> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [`hx-${k}`, v]),
  ) as AddPrefix<T, "hx-">;
}

export type AddPrefix<T, K extends string> = {
  [P in Extract<keyof T, string> as `${K}${P}`]: T[P];
};
