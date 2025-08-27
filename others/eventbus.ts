let listeners: { [key: string]: ((data: any) => void)[] } = {};
export const eventBus = {
  on(event: string, callback: (data: any) => void) {
    if (!listeners[event]) {
      listeners[event] = [];
      listeners[event].push(callback);
    }
  },
  emit(event: string, data: any) {
    if (listeners[event]) {
      listeners[event].forEach(callback => callback(data));
    }
  },
};

declare function Curry<T extends any[], R>(...args: T): curryType<T, R>;

type curryType<A extends any[], R> = A extends []
  ? R
  : A extends [infer F]
  ? F
  : A extends [infer F, ...infer Rest]
  ? (args: F) => curryType<Rest, R>
  : never;

function foo() {
  return 123;
}

const curried = Curry(foo);

const r = curried();
