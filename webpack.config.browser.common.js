"use strict"

const webpack = require("webpack");
const path = require("path");

module.exports = 
{
  devtool: "source-map",
  context: __dirname,
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "browser_build"),
    filename: "xmr-sample-app.js"
  },
  cache: false,
  resolve: {
    alias: {
      "fs": "html5-fs"
    },
    extensions: ['.js', '.jsx', '.css', '.json', 'otf', 'ttf', 'eot', 'svg'],
    modules: [
      'node_modules'
    ]
  },
  target: 'web',
  module: {
    rules: [
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
  
  // This is necessary due to the fact that emscripten puts both Node and
  // web code into one file. 
  externals: ['worker_threads','ws','perf_hooks']
}