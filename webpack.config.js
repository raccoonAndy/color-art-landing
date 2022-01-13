const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

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
            "style-loader",
            "css-loader",
            "sass-loader"
          ]
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
        title: 'Test my app',
        template: path.resolve(__dirname, 'public/index.html'),
      }),
    ]
  }
}