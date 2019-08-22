const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HTMLPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const ExtractPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config = {
  target: 'web',
  // 入口， __dirname 是当前文件所在目录
  entry: path.join(__dirname, 'src/main.js'),
  // 出口
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist')
  },
  resolve: {
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      '@': path.resolve(__dirname, 'src')
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
              name: '[name]-vc&sisi.[ext]'
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
    // 清理 /dist 文件夹
    new CleanWebpackPlugin(),
    // 请确保引入这个插件！且要在其它插件前面
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
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
    })
  ]
}

if (isDev) {
  config.mode = 'development'
  //css预处理器，使用模块化的方式写css代码
  //stylus-loader专门用来处理stylus文件，处理完成后变成css文件，交给css-loader.webpack的loader就是这样一级一级向上传递，每一层loader只处理自己关心的部分
  config.module.rules.push(
    {
      test: /\.scss?$/,
      use: [
        'style-loader',
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
  )
  config.devtool = '#cheap-module-eval-source-map'
  config.devServer = {
    port: 8000,
    host: '0.0.0.0',
    overlay: {
      errors: true
    },
    hot: true
  },
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    )
} else {
  config.mode = 'production'
  config.entry = { // 类库文件单独打包
    app: path.join(__dirname, 'src/main.js'),
    vendors: ['vue']
  }
  config.output.filename = '[name].[chunkhash:8].js'
  config.module.rules.push(
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
  )
  config.plugins.push(
    // new ExtractPlugin('styles.[contentHash:8].css')
    // 单独分离打包css
    new MiniCssExtractPlugin({
      filename: 'styles.[contenthash].[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false
    })
  )
  config.optimization = {
    // 分离js文件
    splitChunks: {
      chunks: 'async',
      // 大于30KB才单独分离成chunk
      minSize: 30000,
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
        // echarts: {
        //   name: 'echarts',
        //   chunks: 'all',
        //   // 对echarts进行单独优化，优先级较高
        //   priority: 20,
        //   test: function (module) {
        //     var context = module.context;
        //     return context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0)
        //   }
        // }
      }
    }
  }
}

module.exports = config