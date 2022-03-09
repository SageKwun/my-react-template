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

# 五、静态资源配置（图片、字体文件）

1. 配置字体

/webpack.common.js

```javascript
// ...
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
    ],
  },
  // ...
};
```

2. 配置开发环境（使用 webpack 自带的处理方式）

/webpack.dev.js

```javascript
// ...
module.exports = merge(common, {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: "asset/inline",
      },
    ],
  },
  // ...
});
```

3. 配置生产环境（使用 file-loader）

安装 file-loader

```shell
pnpm install -D file-loader
```

配置 /webpack.prod.js

```javascript
// ...
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            // 定义打包后文件的名称；
            // [name]:原文件名，[hash]:hash字符串（如果不定义名称，默认就以hash命名，[ext]:原文件的后缀名）
            name: "[name]_[hash].[ext]",
            outputPath: "images/", //  定义图片输出的文件夹名（在output.path目录下）
          },
        },
      },
    ],
  },
  // ...
};
```

4. 测试

让我们在 /src/index.jsx 里引入一张图片 /public/a.jpg

/src/index.jsx

```javascript
// ...
import a from "../public/a.jpg";

function App() {
  return (
    <div>
      react template
      <img src={a} />
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
```

分别测试开发环境和生产环境

```shell
pnpm run dev
```

```shell
pnpm run build
```

快去欣赏你的照片吧～

# 六、配置 css、less 支持

1. 安装 css 所需的 loader

```shell
pnpm install -D mini-css-extract-plugin css-loader postcss postcss-loader
```

- mini-css-extract-plugin

  > 这个插件将 CSS 提取到单独的文件中。它为每个包含 css 的 js 文件创建一个 css 文件。它支持按需加载 css 和 SourceMaps。

  需要变为行内样式的话可以把这个替换为 style-loader

- css-loader

  > css-loader 会对 @import 和 url() 进行处理，就像 js 解析 import/require() 一样

- postcss-loader

  > 是一个用 JavaScript 工具和插件转换 CSS 代码的工具

  个人看法：postcss 就像是 javascript 里的 babel，有着强大插件体系来对 css 做各种处理。通过 postcss，我们可以像 babel 将 ES6 转译成 ES5 或更早一样处理 css 的兼容性、转译等需求

2. 配置 loader

/webpack.common.js

```javascript
// ...
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    // ...
    new MiniCssExtractPlugin({
      filename: "assets/[name].css", // 提取出的 css 文件的输出路径
    }),
  ],
};
```

3. 安装 postcss 插件

```shell
pnpm install -D cssnano autoprefixer@latest
```

- cssnano
  压缩 css 代码
- autoprefixer
  由于标准的通过需要很长的时间，因此各浏览器厂商可能自己先实现功能，并通过浏览器前缀来区别、使用。而 autoprefixer 就能帮我们自动加入所需的前缀

4. 配置 postcss

新建 /postcss.config.js

```javascript
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
```

5. 测试 css

新建 /src/index.css

```css
.redRect {
  width: 100px;
  height: 100px;
  background-color: red;
}
```

/src/index.jsx

```javascript
import React from "react";
import ReactDOM from "react-dom";
import a from "../public/a.jpg";
import "./index.css";

function App() {
  return (
    <div class='redRect'>
      react template
      <img src={a} />
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
```

```shell
pnpm run dev
```

```shell
pnpm run build
```

看一下有没有红色的矩形吧～

6. 安装 less-loader

```shell
pnpm install -D less less-loader
```

7. 配置 less-loader

/webpack.common.js

```javascript
// ...
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /\.(c|le)ss$/, // 对 css 和 less 使用同一套 loader
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "postcss-loader",
          // 当解析antd.less，必须写成下面格式，否则会报Inline JavaScript is not enabled错误
          {
            loader: "less-loader",
            options: { lessOptions: { javascriptEnabled: true } },
          },
        ],
      },
    ],
  },
  // ...
};
```

8. 测试

新建 /src/index.less

```less
@circle: 50%;

#circle {
  border-radius: @circle;
}
```

/src/index.jsx

```javascript
import React from "react";
import ReactDOM from "react-dom";
import a from "../public/a.jpg";
import "./index.css";
import "./index.less";

function App() {
  return (
    <div id='circle' class='redRect'>
      react template
      <img src={a} />
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
```

```shell
pnpm run dev
```

```shell
pnpm run build
```

看看有没有一个红色的圆呢～

## 七、js 压缩

由于 js 压缩包括其他的体积优化需要额外的配置和额外的时间、计算资源，因此我们放在生产环境

/webpack.prod.js

```javascript
// ...
const TerserPlugin = require("terser-webpack-plugin");
module.exports = merge(common, {
  // ...
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
```

运行

```shell
pnpm run build
```

打开 /dist/index-[hash].js，有没有感觉代码很鬼畜呢～

## 八、css 体积优化

由于 js 压缩包括其他的体积优化需要额外的配置和额外的时间、计算资源，因此我们放在生产环境

其实在 六、配置 css、less 支持 一节中，在 postcss 里就用了 cssnano 来压缩我们的 css 代码。在这一节，我们会再涉及 purgecss 和 css-minimizer-webpack-plugin

purgecss 清除没有用到的 css 代码的插件，它可以在 postcss 中作为其插件使用，或者单独作为 webpack 的插件（purgecss-webpack-plugin）使用。在这一节我们选择前者，并合并到 main 分支中

css-minimizer-webpack-plugin 就像 purgecss-webpack-plugin 一样，是单独的 webpack 插件，由于其也使用了 cssnano 来压缩代码，因此我们仅做示例，不会合并到 main 分支

1. 安装

```shell
pnpm install -D @fullhuman/postcss-purgecss
```

2. 配置 postcss.config.js

/postcss.config.js

```javascript
module.exports = {
  plugins: [
    // ...
    // 清除没用到的 css 代码
    require("@fullhuman/postcss-purgecss")({
      content: ["index.html", "**/*.js", "**/*.html"], // 处理范围
    }),
  ],
};
```

3. 测试

我们在 /src/index.css 里加入一些没有用到的样式

/src/index.css

```css
/* ... */

/* 没有用到的样式 */
.unused {
  display: none;
}
```

```shell
pnpm run build
```

打开 /dist/assets/index.css，可以看到没有测试代码～
