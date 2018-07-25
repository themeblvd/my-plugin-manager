const path = require('path');
const webpack = require('webpack');
const addUnminified = require('unminified-webpack-plugin');

module.exports = ({ entry, script }) => {
  return {
    entry,
    output: {
      // Note: The typical "path" is replaced with gulp.dest in
      // task, and so only filename is needed here.
      filename: `./plugin-manager/assets/js/plugin-${script}.min.js`
    },
    mode: 'production',
    externals: {
      wp: 'wp',
      jquery: 'jQuery',
      settings: 'pluginManagerSettings'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
      ]
    },
    plugins: [new addUnminified()]
  };
};
