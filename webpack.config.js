const path = require('path')

const libraryName = 'csm'

const createConfig = ({ libraryTarget, target }) => {
  return {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    mode: 'production',
    target,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    externals: {
      '@ge-fnm/action-object': {
        commonjs2: '@ge-fnm/action-object',
        commonjs: '@ge-fnm/action-object',
        amd: '@ge-fnm/action-object',
        root: '@ge-fnm/action-object' // indicates global variable
      },
      axios: {
        commonjs2: 'axios',
        commonjs: 'axios',
        amd: 'axios',
        root: 'axios' // indicates global variable
      }
    },
    output: {
      filename: `bundle-${target}.js`,
      path: path.resolve(__dirname, 'dist'),
      library: libraryName,
      libraryTarget
    }
  }
}

module.exports = [
  createConfig({ libraryTarget: 'umd', target: 'web' }),
  createConfig({ libraryTarget: 'umd', target: 'node' })
]
