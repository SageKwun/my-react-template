const { merge } = require("webpack-merge"); // 合并两个 config ，注意要解构
const common = require("./webpack.common.js");
// 使用 merge 函数合并
module.exports = merge(common, {
  // 设置为开发模式
  mode: "development",
});
