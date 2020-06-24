import { noop } from "./utils";
import { Hook as HookClass } from "./types";

export class Hook<
  P extends Record<string, unknown> = {},
  S extends Record<string, unknown> = {},
  A extends { [K in keyof A]: Function } = {}
> implements HookClass<P, S, A> {
  public props: P;
  public state: S;
  public bait: A & S;

  public update: () => void = noop;

  constructor(props: P) {
    this.props = props;
    this.state = this.getInitialState();
    this.bait = { ...this.getActions(), ...this.state };
  }

  public setState(update: Partial<S>): void {
    if (this.didStateChange(update)) {
      this.state = { ...this.state, ...update };
      this.bait = { ...this.bait, ...this.state };
      this.update();
    }
  }

  public getInitialState(): S {
    return {} as S;
  }
  public getActions(): A {
    return {} as A;
  }
  public onMount(): void {
    return;
  }
  public onUnmount(): void {
    return;
  }
  public onRender(): void {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onChange(prevProps: P): void {
    return;
  }

  public didPropsChange(prev: P): boolean {
    return Object.keys(this.props).some(key => prev[key] !== this.props[key]);
  }
  public didStateChange(update: Partial<S>): boolean {
    return Object.keys(update).some(key => update[key] !== this.state[key]);
  }
}
