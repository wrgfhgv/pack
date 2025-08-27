import { createRoot } from 'react-dom/client';
import React, { useEffect, useState, useRef } from 'react';
import { Child } from './child';

const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body.appendChild(rootElement);

export const MyContext = React.createContext({});

const App = () => {
  const [message, setMessage] = useState('');
  const [worker, setWorker] = useState<Worker | null>(null);
  const value = useRef({ value: 123 });

  const sharedArrayBuffer = new SharedArrayBuffer(8);
  let sharedArray = new Int32Array(sharedArrayBuffer);
  sharedArray[0] = 0; // 0表示主线程运行
  sharedArray[1] = 0; // 累加值

  useEffect(() => {
    const newWorker = new Worker(new URL('./worker.js', import.meta.url));
    newWorker.onmessage = (event: MessageEvent) => {
      if (event.data.type === 'updated') {
        sharedArray = new Int32Array(sharedArrayBuffer);
        const currentValue = Atomics.load(sharedArray, 1);
        console.log('Main: shared value =', currentValue);
        console.log('Main: message value =', event.data.value);
        setMessage('' + currentValue);
      }
    };
    setWorker(newWorker);

    return () => {
      newWorker.terminate();
    };
  }, []);

  return (
    <MyContext.Provider value={value.current}>
      <div>
        Hello World
        <button
          onClick={() => {
            value.current.value = 456;
          }}
        >
          按钮
        </button>
        <div>{message}</div>
        <button
          onClick={() => {
            sharedArray = new Int32Array(sharedArrayBuffer);
            console.log(
              'Main: before click, value =',
              Atomics.load(sharedArray, 1),
            );
            Atomics.store(sharedArray, 0, 1);
            worker?.postMessage({
              message: 'sayhello',
              buffer: sharedArrayBuffer,
            });
          }}
        >
          +2
        </button>
        <button
          onClick={() => {
            sharedArray = new Int32Array(sharedArrayBuffer);
            console.log(
              'Main: before click, value =',
              Atomics.load(sharedArray, 1),
            );
            Atomics.store(sharedArray, 0, 1);
            worker?.postMessage({
              message: 'saybye',
              buffer: sharedArrayBuffer,
            });
          }}
        >
          +3
        </button>
      </div>
      <Child />
    </MyContext.Provider>
  );
};

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
