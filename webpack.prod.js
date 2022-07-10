const path = require("path");
const {merge} = require("webpack-merge");
const common = require("./webpack.common.js");
const ZipPlugin = require("zip-webpack-plugin");

module.exports = merge(common, {
    mode: "production",
    output: {
        path: path.resolve(__dirname, "dist/音乐播放器"),
        libraryTarget: "window",
        globalObject: "this",
        clean: true
    },
    plugins: [new ZipPlugin({path: "../", filename: "音乐播放器.zip"})]
});
