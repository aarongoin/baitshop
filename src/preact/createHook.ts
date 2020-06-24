import * as preact from "preact/hooks";
import { noop } from "../shared/utils";
import { HookFn, CurrentRef, Hook, Class } from "../shared/types";

export function createHook<
  P extends Record<string, unknown> = {},
  S extends Record<string, unknown> = {},
  A extends { [K in keyof A]: Function } = {}
>(HookClass: Class<Hook<P, S, A>, P>): HookFn<P, S, A> {
  // this `wrapper = { [name]: hookFn }` stuff looks a little nuts but
  // it ensures that the hook function is actually named after the store class
  const name = `use${HookClass.name || "Hook"}`;
  const wrapper = {
    [name]: (props: P = {} as P) => {
      const [, forceUpdate] = preact.useState(Number.MIN_VALUE);
      const ref = preact.useRef<CurrentRef<P, S, A> | null>(null);
      // initialize the HookClass and call it's onMount() method
      if (!ref.current) {
        const instance = new HookClass(props);
        const update = () => forceUpdate(k => k + Number.EPSILON);
        ref.current = {
          instance,
          update,
          props: {} as P
        };
        instance.onMount();
      }
      const self = ref.current as CurrentRef<P, S, A>;
      // make update a noop while we're already in the update section
      // to prevent additional, unneccessary rerenders
      self.instance.update = noop;

      // watch for changing props and call HookClass's onChange() with previous props
      self.instance.props = props;
      if (self.instance.didPropsChange(self.props))
        self.instance.onChange(self.props);
      self.props = props;

      // call HookClass's onUnmount() for cleanup
      preact.useEffect(
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
