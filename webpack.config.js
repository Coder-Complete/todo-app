const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin"); // Import the plugin
const path = require("path");

module.exports = {
  entry: "./src/app.js", // Your entry point
  output: {
    filename: "bundle.js", // The name of the bundled output file
    path: path.resolve(__dirname, "dist"), // Output directory
  },
  mode: "development", // Set to 'production' for minification
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html", // Path to your template file
      filename: "index.html", // Name of the output file (optional)
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./style.css", to: "" }, // Adjust the path as needed
        { from: "./images", to: "images" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/, // Apply this rule to JavaScript files
        exclude: /node_modules/, // Do not transpile node_modules
        use: {
          loader: "babel-loader", // Use babel-loader to transpile the files
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // Note: svgo is disabled by default in the latest versions
              // of image-webpack-loader due to security concerns.
              // svgo: {
              //   plugins: [
              //     {
              //       removeViewBox: false,
              //     },
              //   ],
              // },
              // Enable/disable webp conversion
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js"], // Resolve these extensions
  },
};
