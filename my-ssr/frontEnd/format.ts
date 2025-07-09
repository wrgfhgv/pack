export function format(data: any) {
    return 123;
}

export const extension = {
    format
}

type info = {
    name: string,
    age: number;
}

const Info = {name: 'a', age: 12}

function fn<T extends keyof info>(a: info, b: T, callback: (value: info[T]) => {})
