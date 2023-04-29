const path = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserJSPlugin = require('terser-webpack-plugin');
const baseWebpackConfig = require('./webpack.config.base');

const { analyse } = process.env;
const plugins = [new CaseSensitivePathsPlugin()];
if (analyse) {
  plugins.push(new BundleAnalyzerPlugin());
}
const entryPath = path.resolve(__dirname, '../src/index.tsx');
module.exports = [
  {
    ...baseWebpackConfig,
    mode: 'production',
    entry: {
      'logic-flow': entryPath,
      'logic-flow.min': entryPath,
    },
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: '[name].js',
      libraryTarget: 'umd',
    },
    plugins,
    optimization: {
      minimize: true,
      minimizer: [
        new TerserJSPlugin({
          include: /\.js$/, // FIXME: SOURCEMAP会包含本地路径, dev版本先废弃
          extractComments: false,
          terserOptions: {
            compress: {
              drop_console: true,
              pure_funcs: ['console.log'],
            },
          },
        }),
      ],
    },
  },
];
