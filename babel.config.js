const presets = [
  ['@babel/preset-env', { // which preset to use
    targets: '> 0.25%, not dead', // https://web.dev/serve-modern-code-to-modern-browsers/
    bugfixes: true, // enables optimization for bugfixes to reduce resulting file size; default in babel v8

    //use polyfills for targeted browsers
    //by default babel uses core-js library polyfills
    useBuiltIns: "entry"
  }]
];

module.exports = { presets };

//also, can use module pattern: https://github.com/babel/preset-modules
