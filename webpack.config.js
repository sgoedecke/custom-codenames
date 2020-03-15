module.exports = {
  entry: './src/client.js',
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
