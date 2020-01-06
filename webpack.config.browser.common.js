"use strict"

const webpack = require("webpack");
const path = require("path");
//const nodeExternals = require("webpack-node-externals");
//nodeExternals();

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
//    defaultRules: [
//      {
//        type: "javascript/auto",
//        resolve: {}
//      }
//    ],
//    rules: [
//      {
//        test: /fibonacci\.js$/,
//        loader: "exports-loader"
//      },
//      {
//        test: /fibonacci\.wasm$/,
//        loader: "file-loader",
//        options: {
//          publicPath: "dist/"
//        }
//      }
//    ],
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
  // web code into one file. The node part uses Node’s `fs` module to load
  // the wasm file.
  // Issue: https://github.com/kripken/emscripten/issues/6542.
  //plugins: [new webpack.IgnorePlugin(/(worker_threads|ws|perf_hooks)/)]
  externals: ['worker_threads','ws','perf_hooks']
//  externals : [ nodeExternals() ]
  
//	module: {
//		rules: [
//			{
//				test: /\.js$/,
//				type: "javascript/auto",
//				exclude: path.join(__dirname, 'node_modules'),
//				loader: "file-loader",
//        options: {
//          publicPath: "dist/",
//          cacheDirectory: false
//        }
//			}
//		]
//	}
}