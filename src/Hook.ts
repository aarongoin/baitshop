import { O, F, noop } from "./shared";

export class Hook<P extends O = {}, S extends O = {}, A extends F = {}> {
  public props: P;
  public state: S;
  public bait: A & S;

  public update: () => void = noop;

  constructor(props: P) {
    this.props = props;
    this.state = this.initialState();
    this.bait = { ...this.getActions(), ...this.state };
  }

  public setState(update: Partial<S>): void {
    if (this.hasStateChanged(update)) {
      this.state = { ...this.state, ...update };
      this.bait = { ...this.bait, ...this.state };
      this.update();
    }
  }

  public initialState(): S {
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

  public watchProps(): ReadonlyArray<keyof P> {
    return Object.keys(this.props);
  }
  public havePropsChanged(
    prev: P,
    watch: ReadonlyArray<keyof P>
  ): boolean {
    return watch.some(key => prev[key] !== this.props[key]);
  }
  public hasStateChanged(update: Partial<S>): boolean {
    return Object.keys(update).some(key => update[key] !== this.state[key]);
  }
}
