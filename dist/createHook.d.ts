import { Hook } from "./Hook";
import { O, F, Class } from "./shared";
export declare type HookFn<P extends O = {}, S extends O = {}, A extends F = {}> = (props: P) => A & S;
export declare function createHook<P extends O = {}, S extends O = {}, A extends F = {}>(HookClass: Class<Hook<P, S, A>, P>): HookFn<P, S, A>;
