const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = env => {
  const mode = env && env.production ? 'production' : 'development';
  const pages = ['index', 'page'];
  const pagesPlugin = pages.map(
    p =>
      new HtmlWebpackPlugin({
        filename: `${p}.html`,
        template: `./src/${p}.pug`,
        favicon: 'src/favicon.ico',
      })
  );

  console.info('MODE:', mode);

  return {
    mode,
    entry: {
      app: './src/scripts/app.<%= ext %>',
    },
    devtool: mode === 'production' ? 'source-map' : 'inline-source-map',
    devServer: {
      contentBase: './dist',
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.pug$/,
          use: ['html-loader', 'pug-html-loader'],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                // Prefer `dart-sass`
                // eslint-disable-next-line global-require
                implementation: require('sass'),
                prependData: `$env: ${mode};`,
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                esModule: false,
              },
            },
          ],
        },
      ],
    },
    plugins: pagesPlugin.concat([
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.mode': JSON.stringify(mode),
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
    ]),
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
};
