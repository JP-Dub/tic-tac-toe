const path = require('path');


const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   entry: './main.js',
   output: {
      // path: path.join(__dirname, '/public'),
      // filename: 'index.html'
      path: path.join(__dirname, '/bundle'),
      filename: 'index_bundle.js'
   },
   devServer: {
      inline: true,
      port: 8080
   },
   module: {
      rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
               presets: ['@babel/preset-env', '@babel/preset-react']
            }
         },
         { 
            test: /\.css$/i,
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader'],            
         }
      ]
   },
   plugins:[
      new HtmlWebpackPlugin({
         template: './public/index.html',
         inject: 'body'
      })
   ]
}