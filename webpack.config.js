module.exports = (env, argv) => ({
  entry: './client/index.js',
  watch: argv.mode == 'development',
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
})
