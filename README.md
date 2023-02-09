使用ejs作为模板引擎的esbuild html模板插件
## 安装
`npm install -D esbuild-plugin-html`

## 使用
```js
// esbuild.config.js

import { build } from 'esbuild'
import esbuildPluginHtml from 'esbuild-plugin-html'

build({
  entryPoints: ['src/main.js'],
    outfile: 'output/static/main.js',
    format: 'iife',
    bundle: true,
    sourcemap: true,
    plugins: [
      esbuildPluginHtml({
        template: 'public/index.html',
        minify: true,
        compile: true,
        filename: 'output/index.html',
        renderData: {
          title: 'title'
        },
        publicPath: './'
      })
    ]
})
```

## 配置项
### `template`
`Type: String`
`Default: <!DOCTYPE html><html lang="en">.....`

html模板字符串或者模板文件绝对路径，支持ejs语法。例如：
```js
// 1.文件路径
esbuildPluginHtml({
  template: 'public/index.html'
})

// 2.模板字符串
esbuildPluginHtml({
  template: `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title%></title>
  </head>
  <body>
    <div id="app"></div>
  </body>
  </html>
`
})
```
### `minify`
`Type: Boolean | MinifyOptions`
`Default: true`

是否对html文本内容进行压缩。详细配置请查看[MinifyOptions](https://www.npmjs.com/package/html-minifier-terser?activeTab=readme)
```js
// 1.布尔值控制
esbuildPluginHtml({
  minify: false // true
})
// 2.详细配置
esbuildPluginHtml({
  minify: {
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    removeComments: true,
    ...
  }
})
```
### `filename`
`Type: String`
`Default: 'index.html'`

模板文件输出路径及文件名称。
```js
esbuildPluginHtml({
  filename: './path/to/output.html'
})
```
### `compile`
`Type: Boolean`
`Default: true`

是否编辑ejs语法，配合`renderData`字段使用。
### `renderData`
`Type: Record<string, any>`
`Default: {}`

设置要注入给ejs模板的数据。使用方法见
```js
esbuildPluginHtml({
  compile: true, // false
  renderData: {
    title: '鸡你太美'
  }
})
```
原始模板：
```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title%></title>
  </head>
  <body>
    <div id="app"></div>
  </body>
  </html>
```
输出后：
```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>鸡你太美</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
  </html>
```
### `publicPath`
`Type: String`
`Default: '/'`

设置输出后script、link标签的公共路径
```js
esbuildPluginHtml({
  publicPath: 'https://www.cdn-domain.com/'
})
```
输出结果：
```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>title</title>
    <link rel="stylesheet" href="https://www.cdn-domain.com/output/static/main.css">
    <link href="https://www.cdn-domain.com/output/static/main.css.map">
    <link href="https://www.cdn-domain.com/output/static/main.js.map">
  </head>
  <body>
    <div id="app"></div>
    <script src="https://www.cdn-domain.com/output/static/main.js"></script>
  </body>
  </html>
```

