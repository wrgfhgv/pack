const fcp = performance.getEntriesByName('first-contentful-paint')[0].startTime;
console.log('fcp:', fcp, 'ms');

const lcpObserver = new PerformanceObserver(entries => {
  let lcp;
  if (entries[0]) {
    lcp = entries[0].startTime;
    console.log('lcp:', lcp, 'ms');
  }
});
lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
