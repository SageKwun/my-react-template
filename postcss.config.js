module.exports = {
  plugins: [
    // 为我们的 css 内容添加浏览器厂商前缀兼容
    require("autoprefixer"),
    // 尽可能小的压缩我们的 css 代码
    require("cssnano")({
      preset: "default",
    }),
  ],
};
