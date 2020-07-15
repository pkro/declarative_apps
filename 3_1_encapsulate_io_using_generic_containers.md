**Reminder quicky node setup for web dev**

    npm install -D webpack webpack-cli webpack-dev-server html-webpack-plugin @babel/core @babel/preset-env babel-loader 
    npm install @babel/runtime core-js@3
    npm install ramda [...]

package.json:

    [...]
    "scripts": {
        "dev": "webpack --mode development",
        "build": "webpack --mode production",
        "start": "webpack-dev-server --mode development --open"
      },
    [...]

.babelrc:

    {
      "presets": [
        [
          "@babel/preset-env",
          {
            "useBuiltIns": "usage",
            "corejs": "3",
            "targets": {
              "browsers": ["last 5 versions", "ie >= 8"]
            }
          }
        ]
      ]
    }

webpack.config.js

    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    module.exports = {
      entry: './src/index.js',
      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',
      },
      devServer: {
        contentBase: './dist',
      },
      plugins: [
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: './src/index.html',
        }),
      ],
      module: {
        rules: [
          {
            test: /\.js$/, //using regex to tell babel exactly what files to transcompile
            exclude: /node_modules/, // files to be ignored
            use: {
              loader: 'babel-loader', // specify the loader
            },
          },
        ],
      },
    };



**Generic containers**
- used for encapsulating I/O
- protect functional code from impurities (side effects)
- Hide and contain impurities
  - we could model results of impure operations (DOM manipulation) to have a virtual DOM and then have oner containerized impurity to do something impure (rendering to the actual DOM)
  