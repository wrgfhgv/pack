console.log('Start');

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    setTimeout(() => {
      console.log('setTimeout 1');
    }, 0);
    return Promise.resolve('resolved value');
  })
  .then((value) => {
    console.log('Promise 2:', value);
    setTimeout(() => {
      console.log('setTimeout 2');
      Promise.resolve().then(() => {
        console.log('Promise in setTimeout 2');
      });
    }, 0);
    throw new Error('Error in Promise 2');
  })
  .catch((err) => {
    console.log('Promise 3:', err.message);
    setTimeout(() => {
      console.log('setTimeout 3');
    }, 0);
    return Promise.reject('new rejection');
  })
  .finally(() => {
    console.log('Promise finally');
    setTimeout(() => {
      console.log('setTimeout 4');
    }, 0);
  })
  .catch((err) => {
    console.log('Promise 4:', err);
  });

setTimeout(() => {
  console.log('setTimeout 5');
  Promise.resolve().then(() => {
    console.log('Promise in setTimeout 5');
    setTimeout(() => {
      console.log('setTimeout 6');
    }, 0);
  });
  setTimeout(() => {
    console.log('setTimeout 7');
  }, 0);
}, 0);

new Promise((resolve) => {
  console.log('Promise constructor');
  setTimeout(() => {
    resolve('Promise constructor resolved');
    console.log('Resolved in setTimeout of constructor');
  }, 0);
}).then((value) => {
  console.log('Promise constructor then:', value);
});

console.log('End');