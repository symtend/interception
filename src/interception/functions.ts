/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Make linting pass without above directive (eslint-disable @typescript-eslint/no-explicit-any)
import { DecoratorClass, Interceptor } from './interception-types';
import { ClassType } from './utility-types';

export function generateDecoratorFor<TDecoratee>(targetClass: ClassType<TDecoratee>): DecoratorClass<TDecoratee> {
  const Decorator = class GeneratedDecorator {
    constructor(public readonly decoratee: TDecoratee, public readonly interceptor: Interceptor<TDecoratee>) {}
  };

  const methodNames: string[] = Object.getOwnPropertyNames((targetClass as any).prototype)
    .filter((name) => typeof targetClass.prototype[name] === 'function')
    .filter((name) => !/^_.*$/.test(name));

  for (const name of methodNames) {
    const callDecoratorFunction = function (this: InstanceType<typeof Decorator>, ...cdfArgs: any[]): any {
      const proceed = () => {
        return (this.decoratee as any)[name](...cdfArgs);
      };
      const proceedWith = (...args: any) => {
        return (this.decoratee as any)[name](...args);
      };
      const method = targetClass.prototype[name];

      const invocation = {
        name,
        proceed,
        proceedWith,
        method,
        args: cdfArgs,
        class: targetClass,
      };

      const result = this.interceptor.intercept(invocation as any);

      return result;
    };

    (Decorator.prototype as any)[name] = callDecoratorFunction;
  }

  return Decorator as any;
}
