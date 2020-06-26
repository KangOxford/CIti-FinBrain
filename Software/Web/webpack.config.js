const webpack = require('webpack');
const path = require('path');

// variables
const isProduction = process.argv.indexOf('-p') >= 0;
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');
const moment = require("moment");

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const tsImportPluginFactory = require('ts-import-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const buildTime = moment();


const basePlugins = [
  new HtmlWebpackPlugin({
    template: './assets/index.html',
    favicon: './assets/logo.png',
    filename: 'index.html'
  }),
  new HtmlWebpackPlugin({
    template: './assets/404.html',
    favicon: './assets/logo.png',
    filename: '404.html'
  }),
  new webpack.DefinePlugin({
    FRONT_END_BUILD: JSON.stringify(buildTime.format("YYYYMMDD")),
    FRONT_END_BUILD_TIME: JSON.stringify(buildTime.format())
  }),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: "[name].css",
    chunkFilename: "[id].css"
  }),
  // new ForkTsCheckerWebpackPlugin({
  //   tsconfig: path.resolve(__dirname, "tsconfig.json")
  // })
];


const devPlugins = [
  new webpack.DefinePlugin({
    APIROOTURL: JSON.stringify("http://localhost:5000/api/")
  }),

];

const prodPlugins = [
  new webpack.DefinePlugin({
    APIROOTURL: JSON.stringify("http://118.25.55.247:5000/api/"),
  }),
];

const plugins = basePlugins.concat(isProduction ? prodPlugins : devPlugins);

module.exports = {
  mode: isProduction ? "production" : "development",
  context: sourcePath,
  entry: {
    main: './index.ts'
  },
  output: {
    path: outPath,
    filename: 'index.[hash:5].js',
    chunkFilename: '[name].[hash:5].js',
    publicPath: '/'
  },
  target: 'web',

  resolve: {
    extensions: ['.js', '.ts', '.tsx', 'json'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // (jsnext:main directs not usually distributable es6 format, but es6 sources)
    mainFields: ['module', 'browser', 'main'],
    alias: {
      'app': path.resolve(__dirname, 'src/app/')
    }
  },
  plugins: plugins,
  module: {
    rules: [
      // .ts, .tsx

      {
        test: /\.(t|j)sx?$/,
        use: [
          "cache-loader",
          {
            loader: "ts-loader",
            options: {
              happyPackMode: true,
              getCustomTransformers: () => ({
                before: [
                  createStyledComponentsTransformer(),
                  tsImportPluginFactory({
                  libraryName: 'antd',
                  libraryDirectory: 'lib',
                  style: true
                })
                ],
              }),

            },
          }]
      },
      // css
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            query: {
              sourceMap: !isProduction
            }
          },
          {
            loader: "less-loader", // compiles Less to CSS
            options: {
              javascriptEnabled: true,
              modifyVars: {
                "@layout-header-background": "#001529"
              }
            }
          }
        ]
      },
      // static assets
      {test: /\.html$/, use: 'html-loader'},
      {test: /\.png$/, use: 'url-loader?limit=10000'},
      {test: /\.jpg$/, use: 'file-loader'},
      {test: /\.(md|txt)$/, use: 'raw-loader'},
      {
        // make all files ending in .json5 use the `json5-loader`
        test: /\.json5$/,
        loader: 'json5-loader'
      },
    ]
  },
  devtool: isProduction ? false : 'cheap-module-eval-source-map',
  optimization: {
    splitChunks: {
      name: true,
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: -10
        },
      }
    },
    runtimeChunk: true,
    minimizer: isProduction
      ? [
        new UglifyJSPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({})]
      : []
  },
  devServer: {
    contentBase: sourcePath,
    hot: true,
    inline: true,
    historyApiFallback: {
      disableDotRule: true
    },
    stats: 'minimal',
    open: true,
    port: 3000
  },

};
