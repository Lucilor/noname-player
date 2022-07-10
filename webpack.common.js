const {CleanWebpackPlugin} = require("clean-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");

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
        new CleanWebpackPlugin()
        // new CopyWebpackPlugin({
        //     patterns: [{from: "src/assets", to: "assets"}]
        // })
    ]
};
