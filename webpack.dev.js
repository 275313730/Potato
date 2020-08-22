const path = require('path');

module.exports = {
  entry: {
    bundle: './dev/main.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dev')
  }
};