const webpack = require('webpack')
const config = require('./config.json')

const HtmlWebPackPlugin = require("html-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin')

module.exports = env => {
  const base_url = env.prod ? '/couchdb-react-boilerplate/' : '/'

  return {
    entry: './src/index.jsx',
    devServer: { historyApiFallback: true },
    mode: env.prod ? 'production' : 'development',
    module: {
      rules: [
        {
          enforce: "pre",
          test: [/\.js$/, /\.jsx$/],
          exclude: /node_modules/,
          loader: "eslint-loader"
        },
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
      minimizer: [new TerserPlugin()]
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
        WP_CONF_REMOTE_DB_URL: JSON.stringify(
          env.prod ? config.remote_db_url_prod : config.remote_db_url_dev),
        WP_CONF_REMOTE_DB_NAME: JSON.stringify(
          env.prod ? config.remote_db_name_prod : config.remote_db_name_dev)
      })
    ]
  }
}
