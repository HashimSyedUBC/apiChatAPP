const path = require('path');

module.exports = {
  mode: 'production', // Add this line
  entry: './src/SearchBar.js',
  output: {
    path: path.resolve('lib'),
    filename: 'SearchBar.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      // JavaScript and JSX Files
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      // CSS Files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Image Files
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
};
