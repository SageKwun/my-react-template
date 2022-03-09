const path = require("path");
const { merge } = require("webpack-merge"); // 合并两个 config ，注意要解构
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");
// 使用 merge 函数合并
module.exports = merge(common, {
  // 设置为生产模式
  mode: "production",
  // 输出配置
  output: {
    path: path.resolve(__dirname, "dist"), // 输出路径
    filename: "[name]-[contenthash:8].js", // [] 占位符
    clean: true, // 每次删除上次构建的文件
  },
  optimization: {
    minimize: true, // 开启体积优化
    minimizer: [
      new TerserPlugin({
        parallel: 4, // 默认是 os.cpus().length - 1
        terserOptions: {
          ecma: 5, // compress 和 output 的 ecma
          // 压缩配置
          compress: {
            comparisons: true, // 简化判断条件
            inline: 2, // 简化函数
          },
          // 输出配置
          output: {
            comments: true, // 去除注释
          },
        },
      }),
    ],
  },
});
