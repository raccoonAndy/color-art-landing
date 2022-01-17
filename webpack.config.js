const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env) => {
  return {
    mode: env.production ? 'production' : 'development',
    devtool: 'inline-source-map',
    entry: './src/index.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
      static: './public',
      port: 9000,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: '/node_modules/',
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            env.production
            ? MiniCssExtractPlugin.loader
            : 'style-loader',
            { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ],
        },
        {
          test: /\.(png,jp[e]g,gif)/i,
          type: 'asset/resource'
        },
        {
          test: /\.svg/i,
          type: 'asset/inline'
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new HTMLWebpackPlugin({
        title: 'Color in art',
        template: path.resolve(__dirname, 'public/index.html'),
      }),
      new MiniCssExtractPlugin({
        filename: "styles.css",
      }),
    ]
  }
}