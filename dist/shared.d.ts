export declare type O = Record<string, any>;
export declare type F = Record<string, Function>;
export interface Class<C, I> {
    new (props: I): C;
}
export declare function noop(): any;
