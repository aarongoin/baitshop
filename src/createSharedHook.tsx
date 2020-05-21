import * as React from "react";
import { Hook } from "./Hook";
import { createHook } from "./createHook";
import { O, F, Class } from "./shared";

export type SharedHookFn<
  P extends O = {},
  S extends O = {},
  A extends F = {}
> = [
  // SharedHookProvider
  (props: P & { children: React.ReactNode }) => React.ReactElement,
  // useSharedHookFn
  () => S & A
];

export function createSharedHook<
  P extends O = {},
  S extends O = {},
  A extends F = {}
>(HookClass: Class<Hook<P, S, A>, P>): SharedHookFn<P, S, A> {
  const useSharedHook = createHook(HookClass);
  const sharedHookContext = React.createContext({} as A & S);
  const { Provider } = sharedHookContext;

  return [
    ({ children, ...props }) => {
      const bait = useSharedHook((props as unknown) as P);
      return <Provider value={bait}>{children}</Provider>;
    },
    () => React.useContext(sharedHookContext)
  ];
}
