const HtmlWebPackPlugin = require("html-webpack-plugin")
const webpack = require('webpack')

module.exports = (env, argv) => {
  const base_url = '/couchdb-react-boilerplate/'

  return {
    entry: './src/common/index.jsx',
    devServer: { historyApiFallback: true },
    mode: env.prod ? 'production' : 'development',
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
        base: base_url
      }),
      new webpack.DefinePlugin({
        WP_CONF_BASE_URL: JSON.stringify(base_url)
      })
    ]
  }
}
