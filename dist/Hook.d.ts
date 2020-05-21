import { O, F } from "./shared";
export declare class Hook<P extends O = {}, S extends O = {}, A extends F = {}> {
    props: P;
    state: S;
    bait: A & S;
    update: () => void;
    constructor(props: P);
    setState(update: Partial<S>): void;
    initialState(): S;
    getActions(): A;
    onMount(): void;
    onUnmount(): void;
    onRender(): void;
    onChange(prevProps: P): void;
    watchProps(): ReadonlyArray<keyof P>;
    havePropsChanged(prev: P, watch: ReadonlyArray<keyof P>): boolean;
    hasStateChanged(update: Partial<S>): boolean;
}
