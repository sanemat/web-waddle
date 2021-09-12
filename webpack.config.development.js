/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const ForkTsCheckerNotifierWebpackPlugin = require("fork-ts-checker-notifier-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { GitRevisionPlugin } = require("git-revision-webpack-plugin");

const main = ["./src/index.ts"];

module.exports = {
  context: process.cwd(), // to automatically find tsconfig.json
  entry: {
    main,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/",
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        enabled: true,
        files: "./src/**/*",
      },
    }),
    new ForkTsCheckerNotifierWebpackPlugin({
      title: "TypeScript",
      excludeWarnings: false,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: "src/index.html",
    }),
    new CopyPlugin({ patterns: [{ context: "./src", from: "*.mp3" }] }),
    new GitRevisionPlugin(),
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: [{ loader: "ts-loader", options: { transpileOnly: true } }],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devtool: "inline-source-map",
  devServer: {
    client: {
      logging: "warn",
    },
    open: true,
    historyApiFallback: true,
  },
  stats: "errors-only",
};
