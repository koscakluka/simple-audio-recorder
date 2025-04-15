const path = require("path");

module.exports = {
  entry: "./src/react.js",
  mode: "development",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "react.js",
    library: {
      name: "ReactAudioRecorder",
      type: "module",
    },
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /mp3worker\.js$/i,
        loader: "worker-loader",
        options: {
          inline: "no-fallback",
        },
      },
    ],
  },
  externals: ["react"],
  experimental: {
    outputModule: true,
  },
};
