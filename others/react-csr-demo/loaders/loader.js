module.exports = function(source) {
    this.cacheable && this.cacheable();
    console.log('loader start');
    const callback = this.async();

    setTimeout(() => {
        const options = this.getOptions() || {};
        const content = source.replace(/box1/g, 'box2');
        const { name } = options;
        console.log(name);
        callback(null, content + name);
    }, 100);
}