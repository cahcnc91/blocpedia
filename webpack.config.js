var path = require("path");

module.exports = {
  entry: "./src/views/static/partials/head.ejs",
  outuput: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  }
};
