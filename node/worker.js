self.onmessage = function(event) {
    if(event.data === 'sayhello') {
        self.postMessage('hello');
    } else if(event.data === 'saybye') {
        self.postMessage('bye');
    }
}
self.close();