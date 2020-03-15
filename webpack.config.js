module.exports = {
  entry: './client/index.js',
  watch: true,
  output: {
    filename: 'bundle.js',
    path: __dirname  + '/assets'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    }]
  }
}
