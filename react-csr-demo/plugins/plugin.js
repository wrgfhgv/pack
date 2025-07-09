class MyPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
            console.log('MyPlugin start');
        })
        compiler.hooks.emit.tap('MyPlugin', (compilation) => {
            console.log('MyPlugin emit');
        })
        compiler.hooks.done.tap('MyPlugin', (compilation) => {
            console.log('MyPlugin done');
        })
        compiler.hooks.watchRun.tap('MyPlugin', (compilation) => {
            console.log('MyPlugin watchRun');
        })
        compiler.hooks.failed.tap('MyPlugin', (compilation) => {
            console.log('MyPlugin failed');
        })
        compiler.hooks.afterEmit.tap('MyPlugin', (compilation) => {
            console.log('MyPlugin afterEmit');
        })
        
    }
}

module.exports = MyPlugin;