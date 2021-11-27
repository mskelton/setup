const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin")

module.exports = {
  entry: "./src/index.js",
  experiments: {
    asyncWebAssembly: true,
  },
  mode: "development",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "solver"),
      outName: "solver",
    }),
  ],
}
