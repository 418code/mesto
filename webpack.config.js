const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
  entry: {main: './src/pages/index.js'}, //one entry point per html page
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '' //ex. local /assets folder for dev and CDN /assets folder for prod
  },
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, './dist'), //only exists in devServer for serving static files
    compress: true, //use gzip compression for everything served
    port: 8080,
    open: true //page will open when running npm run dev
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: '/node_modules/'
      },
      {
        test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
        type: 'asset/resource'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, {
          loader: 'css-loader',
          options: { importLoaders: 1 }
        },
        'postcss-loader']
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new CleanWebpackPlugin(), //empty dist folder before build
    new MiniCssExtractPlugin(),
  ]
}
