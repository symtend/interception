import { AnyFunctionType, AsyncFunctionType, ClassType, ExtractMethodNames } from './utility-types';

export type Invocation<
  TDecoratee,
  TMethodName = ExtractMethodNames<TDecoratee>,
> = TMethodName extends ExtractMethodNames<TDecoratee>
  ? {
      name: TMethodName;
      proceed: TDecoratee[TMethodName] extends AnyFunctionType ? () => ReturnType<TDecoratee[TMethodName]> : never;
      proceedWith: TDecoratee[TMethodName] extends AnyFunctionType
        ? (...args: Parameters<TDecoratee[TMethodName]>) => ReturnType<TDecoratee[TMethodName]>
        : never;
      method: TDecoratee[TMethodName] extends AnyFunctionType ? TDecoratee[TMethodName] : never;
      args: TDecoratee[TMethodName] extends AnyFunctionType ? Parameters<TDecoratee[TMethodName]> : never;
      // TODO: Make autocomplete work for "prototype" field:
      class: ClassType<TDecoratee>;
    }
  : never;

type ResultPlain<
  TDecoratee,
  TMethodName = ExtractMethodNames<TDecoratee>,
> = TMethodName extends ExtractMethodNames<TDecoratee>
  ? TDecoratee[TMethodName] extends AnyFunctionType
    ? ReturnType<TDecoratee[TMethodName]>
    : never
  : never;

type ResultAsync<
  TDecoratee,
  TMethodName = ExtractMethodNames<TDecoratee>,
> = TMethodName extends ExtractMethodNames<TDecoratee>
  ? TDecoratee[TMethodName] extends AsyncFunctionType
    ? ReturnType<TDecoratee[TMethodName]>
    : never
  : never;

// This forces transformation
// from Promise<AsyncMethod1Result> | ... | Promise<AsyncMethodNResult>
// into Promise<AsyncMethod1Result | ... | AsyncMethodNResult>.
// The latter is expected by Typescript from intercept(...) implementation functions
// in certain cases (one of them being type-narrowing with if/case statements).
type UndistributedPromise<T> = Promise<Awaited<T>>;

export type Result<TDecoratee> = ResultPlain<TDecoratee> | UndistributedPromise<ResultAsync<TDecoratee>>;

export interface Interceptor<TDecoratee> {
  intercept(invocation: Invocation<TDecoratee>): Result<TDecoratee>;
}

export type DecoratorClass<TDecoratee> = {
  new (decoratee: TDecoratee, interceptor: Interceptor<TDecoratee>): TDecoratee;
};
