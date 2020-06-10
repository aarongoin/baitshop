export interface Class<C, I> {
  new (props: I): C;
}

export type HookFn<
  P extends Record<string, unknown> = {},
  S extends Record<string, unknown> = {},
  A extends { [K in keyof A]: Function } = {}
> = (props: P) => A & S;

export interface CurrentRef<
  P extends Record<string, unknown> = {},
  S extends Record<string, unknown> = {},
  A extends { [K in keyof A]: Function } = {}
> {
  instance: Hook<P, S, A>;
  update: () => void;
  props: P;
}

export interface Hook<
  P extends Record<string, unknown> = {},
  S extends Record<string, unknown> = {},
  A extends { [K in keyof A]: Function } = {}
> {
  props: P;
  state: S;
  bait: A & S;
  update(): void;
  setState(update: Partial<S>): void;
  getInitialState(): S;
  getActions(): A;
  onMount(): void;
  onUnmount(): void;
  onRender(): void;
  onChange(prevProps: P): void;
  didPropsChange(prev: P): boolean;
  didStateChange(update: Partial<S>): boolean;
}

export type SharedHookFn<
  P extends Record<string, unknown> = {},
  S extends Record<string, unknown> = {},
  A extends { [K in keyof A]: Function } = {}
> = [
  // SharedHookProvider
  (props: P & { children: React.ReactNode }) => React.ReactElement,
  // useSharedHookFn
  () => A & S
];
