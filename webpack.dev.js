const path = require('path');

module.exports = {
  entry: {
    bundle: './dev/Demo.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dev')
  }
};