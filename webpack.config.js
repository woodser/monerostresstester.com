const path = require("path");
//const fileLoader = require("file-loader");

let configBase = {
    module: {
      rules: [
//        {
//          test: /\.wasm$/,
//          loader: "file-loader",
//          exclude: path.join(__dirname, 'node_modules')
//        },
        {
          test: /\.js$/,
          exclude: path.join(__dirname, 'node_modules'),
          type: "javascript/auto",
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: false
                // ,
                // presets: [ "es2015" ],
                // plugins: ["transform-runtime"]
              }
            }
          ]
        }
      ]
    },
    devtool: 'source-map',
    externals: ['worker_threads','ws','perf_hooks'], // exclude nodejs
    resolve: {
      alias: {
        "fs": "html5-fs"
      },
      extensions: ['.js', '.jsx', '.css', '.json', 'otf', 'ttf', 'eot', 'svg'],
      modules: [
        'node_modules'
      ]
    },
    cache: true,
    context: __dirname
};

let configMoneroJS = Object.assign({}, configBase, {
    name: "MoneroJS config",
    entry: "./src/worker_exports.js",
    output: {
      path: path.resolve(__dirname, "browser_build"),
      filename: "worker_imports.js"
    },
});

let configApp = Object.assign({}, configBase, {
    name: "App config",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "browser_build"),
      filename: "xmr-sample-app.js"
    },
});

let configTest = Object.assign({}, configBase, {
  name: "Tests config",
  entry: "./src/tests.js",
  output: {
    path: path.resolve(__dirname, "browser_build"),
    filename: "xmr-sample-tests.js"
  },
});

module.exports = [
  //configMoneroJS, configTest
  configMoneroJS, configApp, configTest
];