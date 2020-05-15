import * as React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type O = Record<string, any>;
type F = Record<string, Function>;

interface Class<C, I> {
  new (props: I): C;
}

export type HookFn<P extends O = {}, S extends O = {}, A extends F = {}> = (props: P) => A & S;
export type SharedHookFn<P extends O = {}, S extends O = {}, A extends F = {}> = [
  // SharedHookProvider
  (props: P & { children: React.ReactNode }) => React.ReactNode,
  // useSharedHookFn
  () => S & A,
];

export class Hook<P extends O = {}, S extends O = {}, A extends F = {}> {

  public props: P;
  public state: S;
  public bait: A & S;

  public update: () => void = noop;

  constructor(props: P) {
    this.props = props;
    this.state = this.initialState(props);
    this.bait = { ...this.getActions(), ...this.state };
  }

  public setState(update: Partial<S>): void {
    if (this.hasStateChanged(update, this.state)) {
      this.state = { ...this.state, ...update };
      this.bait = { ...this.bait, ...this.state }
      this.update();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public initialState(props: P): S { return {} as S; }
  public getActions(): A { return {} as A; }
  public onMount(): void { return }
  public onUnmount(): void { return }
  public onRender(): void { return }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public onChange(prevProps: P, newProps: P): void { return }

  public watchProps(): ReadonlyArray<keyof P> {
    return Object.keys(this.props);
  }
  public havePropsChanged(prev: P, props: P, watch: ReadonlyArray<keyof P>): boolean {
    return watch.some(key => prev[key] !== props[key]);
  }
  public hasStateChanged(update: Partial<S>, state: S): boolean {
    return Object.keys(state).some(key => update[key] !== state[key]);
  }


}

interface CurrentRef<P extends O = {}, S extends O = {}, A extends F = {}> {
  instance: Hook<P, S, A>;
  update: () => void;
  props: P;
  watch: ReadonlyArray<keyof P>;
}

export function createHook<P extends O = {}, S extends O = {}, A extends F = {}>(
  HookClass: Class<Hook<P, S, A>, P>
): HookFn<P, S, A> {

  // this `wrapper = { [name]: hookFn }` stuff looks a little nuts but
  // it ensures that the hook function is actually named after the store class
  const name = `use${HookClass.name || "Hook"}`;
  const wrapper = {
    [name]: (props: P = {} as P) => {
      const [, forceUpdate] = React.useState(Number.MIN_VALUE);
      const ref = React.useRef<CurrentRef<P, S, A> | null>(null);
      // initialize the HookClass and call it's onMount() method
      if (!ref.current) {
        const instance = new HookClass(props);
        const update = () => forceUpdate(k => k + Number.EPSILON);
        ref.current = {
          instance,
          update,
          props: {} as P,
          watch: instance.watchProps(),
        };
        instance.onMount();
      }
      const self = ref.current as CurrentRef<P, S, A>;
      // make update a noop while we're already in the update section
      // to prevent additional, unneccessary rerenders
      self.instance.update = noop;

      // watch for changing props and call HookClass's onChange() with previous props
      self.instance.props = props;
      if (self.instance.havePropsChanged(self.props, props, self.watch))
        self.instance.onChange(self.props, props);
      self.props = props;

      // call HookClass's onUnmount() for cleanup
      React.useEffect(() => () => {
        // turn update into noop
        self.instance.update = noop;
        self.instance.onUnmount();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      self.instance.onRender();
      // restore update back into real update method
      self.instance.update = self.update;
      return self.instance.bait;
    }
  }

  return wrapper[name];
}

export function createSharedHook<P extends O = {}, S extends O = {}, A extends F = {}>(
  HookClass: Class<Hook<P, S, A>, P>
): SharedHookFn<P, S, A> {

  const useSharedHook = createHook(HookClass);
  const sharedHookContext = React.createContext({} as A & S);
  const { Provider } = sharedHookContext;

  return [
    ({ children, ...props }) => {
      const bait = useSharedHook(props as unknown as P);
      return <Provider value={bait}>{children}</Provider>
    },
    () => React.useContext(sharedHookContext),
  ];
}

function noop() { return null; }