const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'demo/main.js'),
  output: {
    path: path.resolve(__dirname, 'demo/dist'),
    filename: 'bundle.js'
  },
  plugins: [new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'demo/index.html') })]
}
