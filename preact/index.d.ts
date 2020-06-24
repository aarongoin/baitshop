import { VNode } from "preact";

type JsxNode = VNode;
type JsxElement = VNode;

export interface Class<C, I> {
  new (props: I): C;
}
export type HookFn<
  P extends { [K in keyof P]: unknown } = {},
  S extends { [K in keyof S]: unknown } = {},
  A extends { [K in keyof A]: Function } = {}
> = (props: P) => A & S;

export interface CurrentRef<
  P extends { [K in keyof P]: unknown } = {},
  S extends { [K in keyof S]: unknown } = {},
  A extends { [K in keyof A]: Function } = {}
> {
  instance: Hook<P, S, A>;
  update: () => void;
  props: P;
}

export type SharedHookFn<
  P extends { [K in keyof P]: unknown } = {},
  S extends { [K in keyof S]: unknown } = {},
  A extends { [K in keyof A]: Function } = {}
> = [
  // SharedHookProvider
  (props: P & { children: JsxNode }) => JsxElement,
  // useSharedHookFn
  () => A & S
];

export declare class Hook<
  P extends { [K in keyof P]: unknown } = {},
  S extends { [K in keyof S]: unknown } = {},
  A extends { [K in keyof A]: Function } = {}
> {
  public props: P;
  public state: S;
  public bait: A & S;
  public update(): void;
  constructor(props: P);
  public setState(update: Partial<S>): void;
  public getInitialState(): S;
  public getActions(): A;
  public onMount(): void;
  public onUnmount(): void;
  public onRender(): void;
  public onChange(prevProps: P): void;
  public didPropsChange(prev: P): boolean;
  public didStateChange(update: Partial<S>): boolean;
}

export declare function createHook<
  P extends { [K in keyof P]: unknown } = {},
  S extends { [K in keyof S]: unknown } = {},
  A extends { [K in keyof A]: Function } = {}
>(HookClass: Class<Hook<P, S, A>, P>): HookFn<P, S, A>;

export declare function createSharedHook<
  P extends { [K in keyof P]: unknown } = {},
  S extends { [K in keyof S]: unknown } = {},
  A extends { [K in keyof A]: Function } = {}
>(HookClass: Class<Hook<P, S, A>, P>): SharedHookFn<P, S, A>;
