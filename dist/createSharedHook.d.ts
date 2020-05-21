import * as React from "react";
import { Hook } from "./Hook";
import { O, F, Class } from "./shared";
export declare type SharedHookFn<P extends O = {}, S extends O = {}, A extends F = {}> = [(props: P & {
    children: React.ReactNode;
}) => React.ReactNode, () => S & A];
export declare function createSharedHook<P extends O = {}, S extends O = {}, A extends F = {}>(HookClass: Class<Hook<P, S, A>, P>): SharedHookFn<P, S, A>;
