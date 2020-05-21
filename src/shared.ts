// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type O = Record<string, any>;
export type F = Record<string, Function>;

export interface Class<C, I> {
  new (props: I): C;
}

export function noop() {
  return null;
}
