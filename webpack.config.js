const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { ESBuildMinifyPlugin } = require("esbuild-loader")
// const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin")

const mode = process.env.NODE_ENV || "development"
const prod = mode === "production"
const publicPath = "/setup"

// ESBuild target
const target = "chrome96"

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
  entry: "./src/main.ts",
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true,
  },
  mode,
  module: {
    rules: [
      {
        loader: "esbuild-loader",
        options: { loader: "ts", target },
        test: /\.ts$/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [new ESBuildMinifyPlugin({ target })],
  },
  output: {
    clean: true,
    filename: `${filename}.js`,
    path: path.resolve(__dirname, "dist"),
    publicPath,
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: `${filename}.css` }),
    new HtmlWebpackPlugin({ template: "src/index.html" }),
    // new WasmPackPlugin({
    //   crateDirectory: path.resolve(__dirname, "solver"),
    //   outName: "solver",
    // }),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
}
