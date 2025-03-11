module: {
  rules: [
    {
      test: /\.html$/,
      use: ['html-loader'],
    },
    // other rules...
  ]
}

module.exports = {
  resolve: {
    fallback: {
      "fs": false, // Disable 'fs' module as it's only for backend
      "os": require.resolve("os-browserify/browser"),
      "path": require.resolve("path-browserify")
    }
  }
};
