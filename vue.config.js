const buildTarget = process.env.BUILD_TARGET;
const publicPath = buildTarget === 'docs' ? '/andykurage/':'/';
const path = require("path");
module.exports = {
  parallel: false,
	publicPath,
	devServer: {
		port: 5000,
		contentBase: path.resolve(__dirname, "public"),
		host: "localhost",
		disableHostCheck: true,
		open: true,
		openPage: "",
		hot: true
	},
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.json', '.vue', '.sass','.ts','.scss'],
    },
    plugins: [
    ],
  },
  // css: {
  //   loaderOptions: {
  //     sass: {
  //       includePaths: ['node_modules'],
  //     },
  //   },
  // },
}