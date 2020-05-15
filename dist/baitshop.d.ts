import * as React from "react";
declare type O = Record<string, any>;
declare type F = Record<string, Function>;
interface Class<C, I> {
    new (props: I): C;
}
export declare type HookFn<P extends O = {}, S extends O = {}, A extends F = {}> = (props: P) => A & S;
export declare type SharedHookFn<P extends O = {}, S extends O = {}, A extends F = {}> = [(props: P & {
    children: React.ReactNode;
}) => React.ReactNode, () => S & A];
export declare class Hook<P extends O = {}, S extends O = {}, A extends F = {}> {
    props: P;
    state: S;
    bait: A & S;
    update: () => void;
    constructor(props: P);
    setState(update: Partial<S>): void;
    initialState(props: P): S;
    getActions(): A;
    onMount(): void;
    onUnmount(): void;
    onRender(): void;
    onChange(prevProps: P, newProps: P): void;
    watchProps(): ReadonlyArray<keyof P>;
    havePropsChanged(prev: P, props: P, watch: ReadonlyArray<keyof P>): boolean;
    hasStateChanged(update: Partial<S>, state: S): boolean;
}
export declare function createHook<P extends O = {}, S extends O = {}, A extends F = {}>(HookClass: Class<Hook<P, S, A>, P>): HookFn<P, S, A>;
export declare function createSharedHook<P extends O = {}, S extends O = {}, A extends F = {}>(HookClass: Class<Hook<P, S, A>, P>): SharedHookFn<P, S, A>;
export {};
