let worker = new Worker('./worker.js');
worker.postMessage('sayhello');
worker.onmessage = function(event) {
    console.log(event.data);
}
worker.postMessage('saybye');

worker.terminate();