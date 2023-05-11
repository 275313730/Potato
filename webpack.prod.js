const path = require('path');

module.exports = {
  entry: {
    Potato: './dist/Demo.js'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist')
  }
};