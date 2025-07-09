let sharedArray;

self.onmessage = function(e) {
    if (e.data.buffer) {
        sharedArray = new Int32Array(e.data.buffer);
    }
    
    if (e.data.message === 'sayhello') {
        // 等待主线程设置状态为1
        Atomics.wait(sharedArray, 0, 0);
        const newValue = Atomics.add(sharedArray, 1, 2);
        console.log('Worker: new value =', newValue + 2);
        Atomics.store(sharedArray, 0, 0);
        Atomics.notify(sharedArray, 0);
        self.postMessage({ type: 'updated', value: newValue + 2 });
    } else if (e.data.message === 'saybye') {
        // 等待主线程设置状态为1
        Atomics.wait(sharedArray, 0, 0);
        const newValue = Atomics.add(sharedArray, 1, 3);
        console.log('Worker: new value =', newValue + 3);
        Atomics.store(sharedArray, 0, 0);
        Atomics.notify(sharedArray, 0);
        self.postMessage({ type: 'updated', value: newValue + 3 });
    }
};

