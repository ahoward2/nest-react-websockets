const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const { ProvidePlugin } = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, './src/client/index.tsx'),
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/client'),
    },
    port: 3000,
  },
  output: {
    path: path.join(__dirname, 'dist/client'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    fallback: {
      util: require.resolve('util/'),
    },
  },
  module: {
    rules: [
      {
        test: /bootstrap\.js$/,
        loader: 'bundle-loader',
        options: {
          lazy: true,
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.js$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'jsx',
          target: 'es2015',
        },
      },
      {
        test: /\.tsx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es2015',
          tsconfigRaw: require('./tsconfig.client.json'),
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015',
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};
