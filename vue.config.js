const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        lib: path.resolve(__dirname, "./lib"),
      },
    },
    entry: {
      // tableForm: path.resolve(__dirname, "./lib/TableForm"),
    },
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, "./dist"),
    },
  },
  lintOnSave: true,

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          "primary-color": "#0068FB",
          // 'link-color': '#F5222D',
          "border-radius-base": "2px",
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true,
      },
    },
  },
});
