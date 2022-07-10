const fs = require("fs");
const path = require("path");
const {merge} = require("webpack-merge");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const common = require("./webpack.common.js");
const jsonc = require("jsonc");

const {nonameDir} = jsonc.parse(fs.readFileSync("./config.json").toString());
module.exports = merge(common, {
    mode: "development",
    watch: true,
    output: {
        path: path.resolve(nonameDir, "resources/app/extension/音乐播放器"),
        libraryTarget: "window",
        globalObject: "this"
    },
    plugins: [
        new CleanWebpackPlugin({
            dry: false,
            dangerouslyAllowCleanPatternsOutsideProject: true
        })
    ]
});
