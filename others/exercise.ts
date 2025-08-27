type DeepReadOnly<T> = {
  readonly [key in keyof T]: T[key] extends object
    ? DeepReadOnly<T[key]>
    : T[key];
};

type TupleToUnion<T extends any[]> = T[number];

type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

declare function PromiseAll<T extends any[]>(
  value: T,
): Promise<{ [P in keyof T]: T[P] extends Promise<infer R> ? R : T[P] }>;

type Last<T extends any[]> = T extends [...any[], infer R] ? R : never;

type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};

type Merge<T, U> = {
  [P in keyof T | keyof U]: P extends keyof U
    ? U[P]
    : P extends keyof T
    ? T[P]
    : never;
};

type Intersection<T, U> = {
  [P in keyof T & keyof U]: T[P] | U[P];
};

type isNever<T> = [T] extends [never] ? true : false;

type Curry<T, K> = T extends [infer R, ...infer Rest]
  ? (args: R) => Curry<Rest, K>
  : K;
