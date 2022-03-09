# my-react-template

## 一、初始化环境

1. 初始化仓库

```shell
pnpm init -y
```

2. 安装 webpack

```shell
pnpm install -D webpack webpack-cli
```

## 二、安装 react 支持

1. 安装 react

```shell
pnpm install react react-dom
```

2. 安装 react 支持

```shell
pnpm install -D babel-loader @babel/preset-react @babel/core @babel/preset-env @babel/plugin-transform-runtime
```

- babel-loader
  转译器，识别文件
- @babel/preset-react
  babel 插件：识别并处理 jsx 文件 -> js 文件
- @babel/core
  babel 插件：内部核心转译功能
- @babel/preset-env
  转译的预设，ES6 -> polyfill，不包括高版本的内置模块（如 Promise ）
- @babel/plugin-transform-runtime
  处理高版本的内置模块（如 Promise）

  > 其实与 @babel/plugin-transform-runtime 达到相同的效果还可以直接安装引入 @babel/polyfill，不过相比之下这种方式不被推荐，他存在污染全局作用域，全量引入造成提及过大以及模块之间重复注入等缺点。

3. 配置 babel

/.babelrc

```javascript
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "regenerator": true
      }
    ]
  ]
}
```

## 三、配置 webpack

1. 新建配置文件

- 共用环境配置 /webpack.common.js
- 开发环境配置 /webpack.dev.js
- 生产环境配置 /webpack.prod.js

2. 配置共用环境

/webpack.common.js

```javascript
const path = require("path");
module.exports = {
  // 设置入口
  entry: {
    index: path.resolve(__dirname, "src/index.jsx"),
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, // 识别 .js .jsx 文件
        use: "babel-loader", // 使用 babel-loader 处理
      },
    ],
  },
};
```

3. 配置开发环境

/webpack.dev.js

```javascript
const { merge } = require("webpack-merge"); // 合并两个 config ，注意要解构
const common = require("./webpack.common.js");
// 使用 merge 函数合并
module.exports = merge(common, {
  // 设置为开发模式
  mode: "development",
});
```

4. 配置生产环境

/webpack.prod.js

```javascript
const path = require("path");
const { merge } = require("webpack-merge"); // 合并两个 config ，注意要解构
const common = require("./webpack.common.js");
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
});
```

5. 新建业务代码文件

/src/index.jsx

```javascript
import React from "react";
import ReactDOM from "react-dom";

function App() {
  return <div>react template</div>;
}
ReactDOM.render(<App />, document.getElementById("root"));
```

/public/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>react template</title>
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
```

6. 配置 html-webpack-plugin

```shell
pnpm install -D html-webpack-plugin
```

/webpack.common.js

```javascript
// ...
const htmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  // ...
  plugins: [
    // 打包时自动生成 .html 文件
    new htmlWebpackPlugin({
      filename: "index.html",
      template: path.resolve(__dirname, "./public/index.html"),
    }),
  ],
};
```

7. 配置 npm scripts

/package.json

```json
{
  // 省略...
  "scripts": {
    "build": "webpack --config webpack.prod.js"
  }
}
```

8. 测试打包

```shell
pnpm run build
```

如果看到当前路径下出现了 dist 文件夹，并且里面的 .html 文件打开符合你的预期，那么就通过啦～

## 四、配置开发环境

1. 安装 webpack-dev-server

```shell
pnpm install -D webpack-dev-server
```

2. 配置 webpack.dev.js

```javascript
// ...
const path = require("path");
module.exports = merge(common, {
  // ...
  devServer: {
    // 静态资源配置
    static: {
      directory: path.resolve(__dirname, "public"), // 使开发时能访问 /public 文件夹
      serveIndex: true, // （默认）查看没有 index.html 文件的目录时生成目录列表
    },
    historyApiFallback: true, // 当使用 [HTML5 History API] 时，任意的 `404` 响应被替代为 `index.html`
    open: true, // 自动打开浏览器
    hot: true, // 热更新
    compress: false, // 是否开启代码压缩
    host: "localhost",
    port: 9000, // 启动的端口
  },
});
```

3. 配置 npm scripts

/package.json

```json
{
  "scripts": {
    "dev": "webpack serve --config webpack.dev.js"
  }
}
```

4. 测试

```shell
pnpm run dev
```

看一下吧～
