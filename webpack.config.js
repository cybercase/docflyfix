'use strict';
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');

var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

// css modules
var autoprefixer = require('autoprefixer');
var postcssSimpleVars = require('postcss-simple-vars');
var postcssImport = require('postcss-import');
var postcssMixins = require('postcss-mixins');
var postcssNested = require('postcss-nested');
var postcssNormalize = require('postcss-normalize');

var DEBUG = argv.debug;

var rootDir = path.resolve(__dirname, '');
var srcDir = 'src';
var distDir = 'dist';

module.exports = [{
  context: path.resolve(rootDir, srcDir),

  cache: DEBUG ? {} : false,
  debug: DEBUG,
  devtool: DEBUG ? 'cheap-inline-source-map' : undefined,  //cheap-module-eval-source-map

  entry: {
    vendor: ['babel-polyfill', 'react', 'moment', 'redux-form', 'lodash', 'react-redux', 'react-router', 'history',
             'redux-actions', 'hash.js', 'react-dropzone', 'react-list'],
    main: './main.js'
  },

  externals: {},
  node: {
    fs: "empty"
  },

  postcss: function () {
    return [
      postcssImport({
        addDependencyTo: webpack,
        // path: [path.resolve(rootDir, 'node_modules')]
        // path: path.resolve(rootDir, 'src')
      }),
      postcssMixins,
      postcssSimpleVars,
      postcssNested,
      postcssNormalize,
      autoprefixer({browsers: ['last 2 version']})
    ];
  },

  resolve: {
    root: path.resolve(rootDir, srcDir),
    modulesDirectories: ['web_modules', 'node_modules'],
  },

  output: {
    path: path.resolve(rootDir, distDir),
    filename: '[name]-[hash].bundle.js',
    publicPath: ''
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"[name]-[hash].bundle.js"),
    new HtmlWebpackPlugin({template: './index.html'}),
  ].concat(DEBUG ? [
        new webpack.DefinePlugin({__DEBUG: true})
      ] : [
        new webpack.DefinePlugin({
          __DEBUG: false,
          'process.env': {
            NODE_ENV: '"production"'
          }
        }),
        new ExtractTextPlugin("[name]-[hash].css"),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
  ]),

  module: {

    loaders: (DEBUG ? [{
        test: /\.css/,
        loader: "style!css?root=.!postcss",
      }] : [{
        test: /\.css/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
      }])
      .concat([
        // HANDLEBARS
        {
          test: /\.handlebars$/,
          loader: "handlebars-loader"
        },
        // TPL
        {
          test: /.(txt|md)$/,
          loader: 'raw-loader'
        },

        // FONTS
        {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "url-loader?limit=10000&name=fonts/[path][name].[ext]?[hash]&mimetype=application/font-woff"
        },
        {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: "file-loader?name=fonts/[path][name].[ext]"
        },

        // IMAGES
        {
          test: /(\.jpg|\.jpeg)/,
          loader: 'url-loader?limit=10000&name=images/[path][name].[ext]?[hash]&mimetype=image/jpg',
        },
        {
          test: /\.png/,
          loader: 'url-loader?limit=10000&name=images/[path][name].[ext]?[hash]&mimetype=image/png',
        },
        {
          test: /\.svg/,
          loader: 'url-loader?limit=10000&name=images/[path][name].[ext]?[hash]&mimetype=image/svg',
        },
        {
          test: /\.gif/,
          loader: 'url-loader?limit=5000&name=images/[path][name].[ext]?[hash]&mimetype=image/gif',
        },

        // JS
        {
          loader: 'babel-loader',
          test: /\.jsx?$/,

          exclude: /(node_modules)/,
          include: [path.resolve(rootDir, 'src'), /node_modules\/react\-forms/],
          cacheDirectory: true,
          plugins: ['transform-runtime']
          // query: {
          //   presets: ['es2015', 'react', 'stage-0']
          // }
        }
    ])

  },

  devServer: {
    contentBase: path.resolve(rootDir, distDir),
  }
}];

