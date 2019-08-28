const cssnano = require("cssnano");
const purgecss = require("@fullhuman/postcss-purgecss");

module.exports = {
  plugins: [
    require("tailwindcss"),
    cssnano({
      preset: "default"
    }),
    // purgecss({
    //   content: "./src/views/*html"
    // }),
    require("autoprefixer")
  ]
};
