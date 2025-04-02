const path = require("path");

module.exports = {
  entry: "./src/AudioRecorder.js",
  mode: "development",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "audiorecorder.js",
    library: {
      name: "AudioRecorder",
      type: "umd",
      export: "default",
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
};
