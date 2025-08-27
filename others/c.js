console.log('Start');

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    setTimeout(() => {
      console.log('setTimeout 1');
    }, 0);
    return Promise.resolve('resolved value');
  })
  .then(value => {
    console.log('Promise 2:', value);
    setTimeout(() => {
      console.log('setTimeout 2');
      Promise.resolve().then(() => {
        console.log('Promise in setTimeout 2');
      });
    }, 0);
    throw new Error('Error in Promise 2');
  })
  .catch(err => {
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
  .catch(err => {
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

new Promise(resolve => {
  console.log('Promise constructor');
  setTimeout(() => {
    resolve('Promise constructor resolved');
    console.log('Resolved in setTimeout of constructor');
  }, 0);
}).then(value => {
  console.log('Promise constructor then:', value);
});

console.log('End');
/////////////////////////////////////////////
console.log('start'); //1
new Promise(resolve => {
  console.log('promise1'); // 2
  resolve();
})
  .then(() => {
    console.log('then1'); // 4
    new Promise(resolve => {
      console.log('promise2'); // 5
      resolve();
    })
      .then(() => {
        console.log('then2'); // 6
      })
      .then(() => {
        console.log('then3'); //8
      });
  })
  .then(() => {
    console.log('then4'); // 7
  });
console.log('end'); // 3

const promise = new Promise((resolve, reject) => {
  resolve('success1');
  reject('error');
  resolve('success2');
});
promise
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  });

function delay(ms, value) {
  return new Promise(res => {
    setTimeout(() => {
      res(value);
    }, ms);
  });
}

async function async1() {
  console.log('async1 start'); // 2
  await async2();
  console.log('async1 end'); // 6
}
async function async2() {
  console.log('async2'); // 3
}
console.log('script start'); // 1
setTimeout(() => {
  console.log('setTimeout'); // 8
}, 0);
async1();
new Promise(resolve => {
  console.log('promise1'); // 4
  resolve();
}).then(() => {
  console.log('promise2'); // 7
});
console.log('script end'); // 5

Promise.myAll = function (promises) {
  let result = [];
  let num = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((item, index) => {
      promise
        .resolve(item)
        .then(res => {
          result[index] = res;
          num++;
          if (num === promises.length) {
            return resolve(result);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  });
};

Promise.myRace = function (promises) {
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      Promise.resolve(promise).then(resolve).catch(reject);
    }
  });
};

async function async2Sync(tasks) {
  for (const item of tasks) {
    await item();
  }
}

Promise.mySettled = function (promises) {
  let queue = [];
  let finishNum = 0;
  return new Promise(res => {
    promises.forEach((item, index) => {
      Promise.resolve(item)
        .then(result => {
          [index] = result;
        })
        .catch(e => {
          queue[index] = e;
        })
        .finally(() => {
          finishNum++;
          if (finishNum === promises.length) {
            res(queue);
          }
        });
    });
  });
};

console.log('start'); // 1

setTimeout(() => {
  console.log('setTimeout1'); // 6
  new Promise(resolve => {
    resolve();
  }).then(() => {
    console.log('then1'); // 7
  });
}, 0);

new Promise(resolve => {
  console.log('promise1'); // 2
  resolve();
})
  .then(() => {
    console.log('then2'); // 4
    setTimeout(() => {
      console.log('setTimeout2'); // 8
    }, 0);
  })
  .then(() => {
    console.log('then3'); // 5
  });

console.log('end'); // 3

Promise.retry = function (fn, times) {
  let err = null;
  return new Promise(async (res, rej) => {
    for (let i = 0; i < times; i++) {
      await fn()
        .then(r => {
          res(r);
          console.log(r);
        })
        .catch(e => {
          err = e;
          console.log(e);
        });
    }
    rej(err);
  });
};
let count = 0;
const unstableTask = () => {
  return new Promise((resolve, reject) => {
    count++;
    if (count < 3) reject(new Error('失败'));
    else resolve('成功');
  });
};
Promise.retry(unstableTask, 3).then(console.log);

Promise.resolve()
  .then(() => {
    throw new Error('err1');
  })
  .then(() => {
    console.log('then1');
  })
  .catch(err => {
    console.log(err.message); // err1
    throw new Error('err2');
  })
  .then(() => {
    console.log('then2');
  })
  .catch(err => {
    console.log(err.message); // err2
    return '修复错误';
  })
  .then(res => {
    console.log(res); // 修复错误
  });

class Scheduler {
  constructor(max) {
    this.queue = [];
    this.max = max;
    this.running = 0;
  }
  add(task) {
    return new Promise((res, rej) => {
      this.queue.push([task, res, rej]);
      this.run();
    });
  }
  run() {
    if (this.running < max && this.queue.length) {
      const [task, res, rej] = this.queue.shift();
      this.running++;

      task()
        .then(result => {
          res(result);
          this.running--;
          this.run();
        })
        .catch(e => {
          rej(e);
          this.running--;
          this.run();
        });
    }
  }
}

async function async1() {
  try {
    await Promise.reject('error1');
    console.log('async1 success');
  } catch (e) {
    console.log(e); // error1
    return Promise.reject('error2');
  }
  console.log('async1 end');
}

async1()
  .then(() => {
    console.log('then success');
  })
  .catch(e => {
    console.log(e); // error2
  });

function delay(duration) {
  return {
    then: cb => {
      return new Promise(res => {
        setTimeout(() => {
          res(delay(cb()));
        }, duration);
      });
    },
  };
}

delay(1000)
  .then(() => 2000) // 1秒后执行，返回下一个延迟时间2000
  .then(() => 3000) // 再2秒后执行，返回下一个延迟时间3000
  .then(ms => console.log(ms)); // 再3秒后输出3000

(async function light() {
  let list = ['黄', '绿', '红'];
  let index = 2;
  while (true) {
    await new Promise(res => {
      console.time('time');
      setTimeout(() => {
        res();
        console.timeEnd('time');
        console.log(list[index]);
        index--;
        if (index < 0) {
          index = 2;
        }
      }, (index + 1) * 1000);
    });
  }
})();

function fn() {
  let num = 0;
  for (let i = 0; i < 10000; i++) {
    num += i;
  }
  fn();
}
fn();
