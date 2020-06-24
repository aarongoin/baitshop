import * as React from "preact";
import { useContext } from "preact/hooks";
import { createHook } from "./createHook";
import { Class, Hook, SharedHookFn } from "../shared/types";

export function createSharedHook<
  P extends Record<string, unknown> = {},
  S extends Record<string, unknown> = {},
  A extends { [K in keyof A]: Function } = {}
>(HookClass: Class<Hook<P, S, A>, P>): SharedHookFn<P, S, A> {
  const useSharedHook = createHook(HookClass);
  const sharedHookContext = React.createContext({} as A & S);
  const { Provider } = sharedHookContext;

  return [
    ({ children, ...props }) => {
      const bait = useSharedHook((props as unknown) as P);
      return <Provider value={bait}>{children}</Provider>;
    },
    () => useContext(sharedHookContext)
  ];
}
