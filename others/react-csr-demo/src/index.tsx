import React, { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

type Data = {
  age: number,
  name: string
}

const data: Data = {
  age: 1,
  name: '123'
}
const Child = React.lazy(() => import('./child').then(component => ({default: component.Child})));

function getProperty<T, K extends keyof T>(data: T, property: K): T[K] {
  return data[property];
}

function logClass(constructor: Function) {
  console.log(123);
  
}

@logClass
class user {
  constructor(name: string) {

  } 
}

getProperty(data, 'name');

function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${propertyKey} with args: ${JSON.stringify(args)}`);
    return originalMethod.apply(this, args);
  };
  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number) {
    return a + b;
  }
}


function App() {
  const U = new user('a');
  const c = new Calculator()


  const childRef = useRef<any>(null);

  useEffect(() => {
    console.log(childRef.current);
    if(childRef.current) {
      childRef.current.sayHello();
    }
  }, [])

  const callback: React.RefCallback<typeof Child> = (el) => {
    console.log(el);
    
  }


  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        if(entry.isIntersecting) {
          element.style.border = '10px solid black';
        } else {
          element.style.border = 'none';
        }
      })
    },{
      threshold: 0.5
    })
  
    for(let i = 0; i < 10; i++) {
      observer.observe(document.querySelector(`.box${i}`) as Element);
    }
  },[])

  function quickSort(arr: number[], low = 0, high = arr.length - 1) {
    if(arr.length <= 1) return arr;
    if(low < high) {
      const pivotIndex = sort(arr, low, high);
      quickSort(arr, low, pivotIndex - 1);
      quickSort(arr, pivotIndex + 1, high);
    }
    return arr;


    function sort(arr: number[], low: number, high: number) {
      const pivot = arr[high];
      let i = low - 1;
      for(let j = low; j < high; j++) {
        if(arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      return i + 1;
    }
  }

  console.log(quickSort([10, 5, 98, 7, 65, 9, 10,111, 2, 22, 4]));
  
  



  return (
    <div>
      {Array(10).fill('').map((_, index) => {
        return <div className={`box${index}`} style={{boxSizing: 'border-box', width: 300, height: 300, backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`}} key={index}></div>
      })}
      <h1>React CSR 原生示例</h1>
      <p>当前时间：{new Date().toLocaleString()}</p>
      <Child ref={callback}/>
    </div>
  );
}
const root = createRoot(document.getElementById('root')!);
root.render(<App />); 