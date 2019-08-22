const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common, {
  mode: 'production',
  entry: { // 类库文件单独打包
    app: path.join(__dirname, 'src/main.js'),
    vendors: ['vue']
  },
  output: {
    filename: '[name].[chunkhash:8].js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        //css预处理器，使用模块化的方式写css代码
        //stylus-loader专门用来处理stylus文件，处理完成后变成css文件，交给css-loader.webpack的loader就是这样一级一级向上传递，每一层loader只处理自己关心的部分
        test: /\.scss?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './',
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  devtool: 'source-map',
  plugins: [
    // 清理 /dist 文件夹
    new CleanWebpackPlugin(),
    new UglifyJSPlugin(),
    // new ExtractPlugin('styles.[contentHash:8].css')
    // 单独分离打包css
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    // 分离js文件
    splitChunks: {
      chunks: 'async',
      // 大于30KB才单独分离成chunk
      minSize: 20000,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        default: {
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "all"
        }
      }
    }
  }
})