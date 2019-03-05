const webpack = require('webpack')
const config = require('./config.json')

const HtmlWebPackPlugin = require("html-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

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
    optimization: env.prod && {
      minimizer: [new UglifyJsPlugin({
        test: [/\.js$/, /\.jsx$/]
      })],
    },
    plugins: [
      new HtmlWebPackPlugin({ 
        template: './src/index.html',
        base: base_url
      }),
      new CopyPlugin([
        { from: 'assets/', to: 'assets/' },
      ]),
      new webpack.DefinePlugin({
        WP_CONF_BASE_URL: JSON.stringify(base_url),
        WP_CONF_REMOTE_DB_URL: env.prod 
          ? JSON.stringify(config.remote_db_url_prod) 
          : JSON.stringify(config.remote_db_url_dev)
      })
    ]
  }
}
