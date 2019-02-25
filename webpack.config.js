const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './src/common/index.jsx',
  output: {
    filename: 'index.js'
  },
  devServer: { historyApiFallback: true },
  module: {
    rules: [
      {
        test: [/\.js$/, /\.jsx$/],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [ "react", "es2015" ],
            plugins:[require("babel-plugin-transform-object-rest-spread")]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/common/index.html'
    })
  ]
};
