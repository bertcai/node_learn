const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: './app/index.jsx',
    mode: 'development',
    output: {
        path: __dirname,
        filename: 'dist/bundle.js'
    },
    module: {
        rules: [{
            test: /\.m?jsx$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react'
                    ]
                }
            }
        }]
    }
}