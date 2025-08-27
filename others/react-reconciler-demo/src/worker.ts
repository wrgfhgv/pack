// 在 Worker 中执行耗时计算
self.onmessage = (e) => {
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }
  self.postMessage(result);
}; 