import * as React from "react";
import { Hook } from "./Hook";
import { O, F, Class, noop } from "./shared";

export type HookFn<P extends O = {}, S extends O = {}, A extends F = {}> = (
  props: P
) => A & S;

interface CurrentRef<P extends O = {}, S extends O = {}, A extends F = {}> {
  instance: Hook<P, S, A>;
  update: () => void;
  props: P;
  watch: ReadonlyArray<keyof P>;
}

export function createHook<
  P extends O = {},
  S extends O = {},
  A extends F = {}
>(HookClass: Class<Hook<P, S, A>, P>): HookFn<P, S, A> {
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
          watch: instance.watchProps()
        };
        instance.onMount();
      }
      const self = ref.current as CurrentRef<P, S, A>;
      // make update a noop while we're already in the update section
      // to prevent additional, unneccessary rerenders
      self.instance.update = noop;

      // watch for changing props and call HookClass's onChange() with previous props
      self.instance.props = props;
      if (self.instance.havePropsChanged(self.props, self.watch))
        self.instance.onChange(self.props);
      self.props = props;

      // call HookClass's onUnmount() for cleanup
      React.useEffect(
        () => () => {
          // turn update into noop
          self.instance.update = noop;
          self.instance.onUnmount();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
      );

      self.instance.onRender();
      // restore update back into real update method
      self.instance.update = self.update;
      return self.instance.bait;
    }
  };

  return wrapper[name];
}