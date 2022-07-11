const {CleanWebpackPlugin} = require("clean-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const fs = require("fs");

if (!fs.existsSync("./config.json")) {
    fs.writeFileSync("./config.json", JSON.stringify({nonameDir: "./dist/音乐播放器"}, null, 4));
}

module.exports = {
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            }
        ]
    },
    target: ["web", "es5"],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: {path: false}
    },
    entry: {
        extension: "./src/index.ts"
    },
    output: {
        filename: "[name].js" // 输出文件
    },
    plugins: [
        new CleanWebpackPlugin({
            dry: false,
            dangerouslyAllowCleanPatternsOutsideProject: true
        })
        // new CopyWebpackPlugin({
        //     patterns: [{from: "src/assets", to: "assets"}]
        // })
    ]
};
