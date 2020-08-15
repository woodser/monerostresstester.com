const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');

const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/main/index.html",
  filename: "./index.html"
});

let configBase = {
  devServer: {
	contentBase: './browser_build',  
	writeToDisk: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        type: "javascript/auto",
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: false,
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    esmodules: true,
                  },
                },
              ],
            ],
          }
        }
      },
      {
        // Preprocess your css files
        // you can add additional loaders here (e.g. sass/less etc.)
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [{
          loader: 'file-loader',
          /*
          options: {
            name: '[name].[ext]',
            outputPath: 'img/',
            publicPath:'img/'
          }
          */
        }]
       }
    ]
  },
  devtool: 'source-map',
  externals: ['worker_threads','ws','perf_hooks'], // exclude nodejs
  resolve: {
    symlinks: false,
    alias: {
      "fs": "html5-fs"
    },
    extensions: ['.js', '.jsx', '.css', '.json', 'otf', 'ttf', 'eot', 'svg'],
    modules: [
      'node_modules'
    ]
  },
  cache: true,
  context: __dirname,
  devServer: {
    contentBase: './browser_build',
    writeToDisk: true,
  },
  plugins: [
    htmlPlugin,
    new CopyPlugin({
      patterns: [
        { from: path.resolve("node_modules/monero-javascript/dist"), to: path.resolve("browser_build") },
      ],
    }),
  ],
};

let configStressTester = Object.assign({}, configBase, {
  name: "Stress Tester",
  entry: "./src/main/index.js",
  output: {
    path: path.resolve(__dirname, "browser_build"),
    filename: "stress_tester.dist.js"
  }
});

module.exports = [
  configStressTester,
];
