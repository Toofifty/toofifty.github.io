const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const validate = require('webpack-validator')
const parts = require('./libs/parts');

const PATHS = {
  index: path.join(__dirname, 'app', 'index.pug'),
  app: [
    path.join(__dirname, 'app', 'js')
  ],
  style: [
    path.join(__dirname, 'node_modules', 'purecss'),
    path.join(__dirname, 'app', 'scss', 'main.scss')
  ],
  build: path.join(__dirname, 'build')
}

const common = {
  entry: {
    style: PATHS.style,
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: PATHS.index
    })
  ]
}

var config

switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.minify(),
      parts.clean(PATHS.build),
      parts.extractCSS(PATHS.style),
      parts.loadFiles(PATHS.app)
    )
    break
  default:
    config = merge(
      common,
      {
        devtool: 'source-map'
      },
      parts.extractCSS(PATHS.style),
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      }),
      parts.loadFiles(PATHS.app)
    )
}

module.exports = validate(config)
