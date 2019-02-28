const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => ({
  entry: './src/common/index.jsx',
  devServer: { historyApiFallback: true },
  module: {
    rules: [
      {
        test: [/\.js$/, /\.jsx$/],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            "presets": [
              "@babel/react",
              [ 
                "@babel/preset-env", 
                { 
                  targets: "> 0.25%, not dead", 
                  useBuiltIns: "usage",
                } 
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({ 
      template: './src/common/index.html',
      base: env.production ? '/couchdb-react-boilerplate/' : '/'
    })
  ]
})
