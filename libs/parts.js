const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PurifyCSSPlugin = require('purifycss-webpack-plugin')

exports.devServer = function (options) {
  return {
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      stats: 'errors-only',
      host: options.host,
      port: options.port
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      })
    ]
  }
}

exports.loadFiles = function () {
  return {
    module: {
      loaders: [
        {
          test: /\.(png|jpg)$/,
          loader: 'file'
        },
        {
          test: /\.pug$/,
          loader: 'pug'
        },
        {
          test: /\.svg$/,
          loader: 'file'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.webp$/,
          loader: 'file-loader'
        }
      ]
    }
  }
}

exports.extractCSS = function (paths) {
  return {
    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: paths
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style', 'css!sass'),
          include: paths
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].[chunkhash].css')
    ]
  }
}

exports.purifyCSS = function (paths) {
  return {
    plugins: [
      new PurifyCSSPlugin({
        basePath: process.cwd(),
        paths: paths
      })
    ]
  }
}

exports.minify = function () {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  }
}

exports.clean = function (path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path], {
        root: process.cwd()
      })
    ]
  }
}
