const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
// const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin")

const mode = process.env.NODE_ENV || "development"
const prod = mode === "production"
const publicPath = "/setup"

// The filename in production includes the content hash, while development
// just uses the chunk name.
const filename = prod ? "[name].[contenthash]" : "[name]"

/** @type {import('webpack').Configuration} */
module.exports = {
  cache: {
    buildDependencies: {
      config: [__filename],
    },
    type: "filesystem",
  },
  devServer: {
    open: "/setup",
    static: {
      publicPath,
    },
  },
  devtool: prod ? false : "source-map",
  entry: "./src/index.tsx",
  experiments: {
    asyncWebAssembly: true,
  },
  ignoreWarnings: [/Failed to parse source map/],
  mode,
  module: {
    rules: [
      {
        enforce: "pre",
        loader: "source-map-loader",
        test: /\.js$/,
      },
      {
        exclude: /node_modules/,
        test: /\.[jt]sx?$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: !prod,
            plugins: [
              "@babel/plugin-transform-runtime",
              "@emotion/babel-plugin",
            ],
            presets: [
              [
                "@babel/preset-env",
                {
                  corejs: "3.19",
                  useBuiltIns: "entry",
                },
              ],
              [
                "@babel/preset-typescript",
                {
                  allExtensions: true,
                  isTSX: true,
                },
              ],
              [
                "@babel/preset-react",
                {
                  development: !prod,
                  importSource: "@emotion/react",
                  runtime: "automatic",
                },
              ],
            ],
          },
        },
      },
    ],
  },
  output: {
    clean: true,
    filename: `${filename}.js`,
    path: path.resolve(__dirname, "dist"),
    publicPath,
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "src/index.html" }),
    // new WasmPackPlugin({
    //   crateDirectory: path.resolve(__dirname, "solver"),
    //   outName: "solver",
    // }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
}
