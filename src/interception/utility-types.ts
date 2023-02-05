/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Make linting pass without above directive (eslint-disable @typescript-eslint/no-explicit-any)
export type FunctionType<TArgs extends any[], TResult> = (...args: TArgs) => TResult;

export type AnyFunctionType = FunctionType<any, any>;

export type AsyncFunctionType = FunctionType<any, Promise<any>>;

export interface ClassType<TType> extends Function {
  new (...args: any[]): TType;
}

type ExtractMatching<TType, TBase> = keyof {
  [Key in keyof TType as TType[Key] extends TBase ? Key : never]: any;
};

export type ExtractMethodNames<TClass> = ExtractMatching<TClass, AnyFunctionType>;
