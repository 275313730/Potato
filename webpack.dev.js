const path = require('path');

module.exports = {
  entry: {
    bundle: './dist/Demo.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dev')
  }
};