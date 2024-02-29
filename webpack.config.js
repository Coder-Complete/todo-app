const path = require("path");

module.exports = {
  entry: "./src/app.js", // Your entry point
  output: {
    filename: "bundle.js", // The name of the bundled output file
    path: path.resolve(__dirname, "dist"), // Output directory
  },
  mode: "development", // Set to 'production' for minification

  // tell webpack where my static files (index.html) are
  devServer: {
    static: {
      directory: path.join(__dirname, "/"),
    },
    open: true, // Automatically open the browser
  },
};
