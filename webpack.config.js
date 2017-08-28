const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

const plugins = [];
const cssName = isProduction ? 'app.min.css' : 'app.css';
const commonsName = isProduction ? 'commons.min.js' : 'commons.js';


const config = {
  context: `${ __dirname }/frontend/js`,

  entry: {
    styles: './styles.js',
    main: './main.js',
  },

  output: {
    path: `${ __dirname }/public/js/`,
    filename: isProduction ? '[name].min.js' : '[name].js',
    publicPath: '/public/js/',
    libraryTarget: 'umd',
  },

  resolve: {
    // Needed for Vue 2.0 stand alone build
    // See: http://vuejs.org/guide/installation.html#Standalone-vs-Runtime-only-Build
    alias: {
      vue: 'vue/dist/vue.js',
    },
  },

  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|gif|png)(\?[a-z0-9]+)?(#[A-Za-z]+)?$/,
        exclude: /node_modules/,
        loader: 'file-loader?limit=1024&name=/../font/[name].[ext]',
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?[a-z0-9]+)?(#[A-Za-z]+)?$/,
        exclude: /node_modules/,
        loader: 'file-loader?limit=1024&name=/../font/[name].[ext]',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        }]
      },
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader'
        }],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              modules: false
            }
          }]
        }),
      },
      {
        test: /\.(sass|scss)$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: false
              }
            }, {
              loader: 'sass-loader',
              options: {
                outputStyle: isProduction ? 'compressed' : 'expanded',
                includePaths: [`${ __dirname }/frontend/css/libs`]
              }
            }
          ]
        }),
      }, {
        test: /\.json$/,
        use: [{
          loader: 'json-loader'
        }],
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin({
      filename: `./../css/${ cssName }`,
      allChunks: true,
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: commonsName,
      minChunks: 2,
    }),
  ],

  devtool: 'eval-source-map',
};

if(isProduction) {
  config.devtool = 'source-map';

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    })
  );

  config.plugins.push(new webpack.NoErrorsPlugin());
  config.plugins.push(new webpack.optimize.DedupePlugin());
  config.plugins.push(new webpack.optimize.OccurenceOrderPlugin(true));

  config.plugins.push(new BabiliPlugin({
    mangle: true,
    deadcode: true,
    simplify: true,
  }));
}

module.exports = config;
