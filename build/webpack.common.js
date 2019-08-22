const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  target: 'web',
  // 入口， __dirname 是当前文件所在目录
  entry: path.join(__dirname, '../src/main.js'),
  // 出口
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, '../dist')
  },
  resolve: {
    alias: {
      // Utilities: path.resolve(__dirname, 'src/utilities/'),
      '@': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      // webpack原生只支持js文件类型，只支持ES5语法，我们使用以.vue文件名结尾的文件时，需要为其指定loader
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // vue2.0开始支持jsx--用JavaScript写HTML
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader'
      },
      // 将小于1024d的图片转为base64，减少http请求
      {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name]-vc.[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件！且要在其它插件前面
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      // 'process.env': {
      //   NODE_ENV: isDev ? '"development"' : '"production"'
      // }
    }),
    // 配置挂载app.vue的文件
    new HTMLPlugin({
      firename: 'index.html',
      template: './index.html',
      inject: true
    }),
    // 单独分离打包css
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false
    }),
    // 提取公共的依赖模块 optimize haved been removed
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common' // 指定公共 bundle 的名称
    // })
  ]
}