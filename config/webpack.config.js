// config/webpack.config.js
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// 配置目录
// 因为我们的webpack.config.js文件不在项目根目录下，所以需要一个路径的配置
const path = require('path');
const CURRENT_PATH = path.resolve(__dirname); // 获取到当前目录
const ROOT_PATH = path.join(__dirname, '../'); // 项目根目录
const MODULES_PATH = path.join(ROOT_PATH, './node_modules'); // node包目录
const BUILD_PATH = path.join(ROOT_PATH, './public/assets'); // 最后输出放置公共资源的目录

module.exports = {
  context: path.join(__dirname, '../'), // 设置webpack配置中指向的默认目录为项目根目录
  entry: {
    index: './public/pages/index.js',
    public: './public/pages/public.js',
    jquery: ['jquery']
  },
  output: {
    path: BUILD_PATH, // 设置输出目录
    filename: '[name].bundle.js', // 输出文件名
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.coffee'] // 配置简写，配置过后，书写该文件路径的时候可以省略文件后缀
  },
  module: {
    loaders: [
      // loader 扔在这里
      // style & css & less loader
      // 把之前的style&css&less loader改为
      { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
      { test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css!less') },
      // babel loader
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: ['babel-loader'],
        query: {
          presets: ['es2015']
          // 如果安装了React的话
          // presets: ['react', 'es2015']
        }
      },
      // image & font
      { test: /\.(woff|woff2|eot|ttf|otf)$/i, loader: 'url-loader?limit=8192&name=[name].[ext]'},
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'url-loader?limit=8192&name=[name].[ext]'},

      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: ['babel-loader'],
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  plugins: [
    // 分离css
    new ExtractTextPlugin('[name].bundle.css', {
      allChunks: true
    }),
    // 把jquery作为全局变量插入到所有的代码中
    // 然后就可以直接在页面中使用jQuery了
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),

    // public sources
    new webpack.optimize.CommonsChunkPlugin({
      // 与 entry 中的 jquery 对应
      name: 'jquery',
      // 输出的公共资源名称
      filename: 'common.bundle.js',
      // 对所有entry实行这个规则
      minChunks: Infinity
    }),

    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['$super', '$', 'exports', 'require']
        //以上变量‘$super’, ‘$’, ‘exports’ or ‘require’，不会被混淆
      },
      compress: {
        warnings: false
      }
    })
  ]
}