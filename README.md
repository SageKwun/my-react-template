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
