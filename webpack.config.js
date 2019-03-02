const HtmlWebPackPlugin = require("html-webpack-plugin")
const webpack = require('webpack')
const config = require('./config.json')

module.exports = (env, argv) => {
  const base_url = env.prod ? '/couchdb-react-boilerplate/' : '/'

  return {
    entry: './src/index.jsx',
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
        template: './src/index.html',
        base: base_url
      }),
      new webpack.DefinePlugin({
        WP_CONF_BASE_URL: JSON.stringify(base_url),
        WP_CONF_REMOTE_DB_URL: JSON.stringify(config.remote_db_url)
      })
    ]
  }
}
