
function race(promises) {
    return new Promise((res, rej) => {
        promises.forEach(promise => {
            Promise.resolve(promise).then(value => res(value), err => rej(err));
        })
    })
}
function all(promises) {
    return new Promise((resolve, reject) => {
        let count = 0;
        let res = [];
        promises.forEach((promise, index) => {
            Promise.resolve(promise).then(value => {
                res[index] = value;
                count++;
                if(count === promises.length) {
                    resolve(res);
                }
            }, error => reject(error))
        })
    })
}
let b = all([
    new Promise((res) => setTimeout(() => {res(1)}, 2000)), 
    new Promise((res) => setTimeout(() => {res(2)}, 1000)), 
])
let a = Promise.all([
    new Promise((res) => setTimeout(() => {res(1)}, 2000)), 
    new Promise((res) => setTimeout(() => {res(2)}, 1000)), 
])
