// Override problematic d3-dispatch types
declare module '@types/d3-dispatch' {
    export interface Dispatch<T = any> {
        on(typenames: string, listener: any): this;
        on(typenames: string, listener: null): this;
        on(typenames: string): any;
        call(type: string, that?: any, ...args: any[]): this;
        apply(type: string, that?: any, args?: any[]): this;
    }

    export function dispatch<T = any>(...types: string[]): Dispatch<T>;
}
