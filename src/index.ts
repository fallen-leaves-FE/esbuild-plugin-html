import { EsbuildHtmlPluginOptions, CreateDocumentTreeOptions } from './../types/index.d'
import { Plugin } from 'esbuild'
import fs from 'fs'
import path from 'path'
import ejs from 'ejs'
import htmlminifier from 'html-minifier-terser'
import { parse } from 'node-html-parser'

async function createDocumentTree({
  template = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>esbuild-plugin-html</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
  </html>`,
  scripts = [],
  styles = [],
  maps = [],
  filename = 'index.html',
  minify = true,
  compile = true,
  renderData = {},
  publicPath = '/'
}: CreateDocumentTreeOptions) {
  // 判断模板类型
  const isFilePath = /\.[a-z0-9]+$/i.test(template)
  let templateStr = ''
  if (isFilePath) { // 文件模板
    const file = await fs.promises.readFile(path.resolve(process.cwd(), template))
    templateStr = file.toString()
  } else { // 字符串模板
    templateStr = template
  }
  // 是否需要压缩
  if (minify) {
    templateStr = await htmlminifier.minify(templateStr, Object.assign({
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      removeComments: true,
    }, minify === true ? {} : minify))
  }
  // 是否需要编译ejs
  if (compile) {
    templateStr = ejs.render(templateStr, renderData)
  }
  // 模板字符串格式化为dom
  const root = parse(templateStr)
  const outputDir = path.dirname(filename)
  // 插入css
  styles.forEach(_path => {
    const href = path.relative(outputDir, _path)
    root.querySelector('head')?.appendChild(parse(`<link rel="stylesheet" href="${publicPath}${href}" />`))
  })
  // 插入map文件
  maps.forEach(_path => {
    const href = path.relative(outputDir, _path)
    root.querySelector('head')?.appendChild(parse(`<link href="${publicPath}${href}" />`))
  })
  // 插入js
  scripts.forEach(_path => {
    const src = path.relative(outputDir, _path)
    root.querySelector('body')?.appendChild(parse(`<script src="${publicPath}${src}"></script>`))
  })
  // 反格式化为html字符串
  const html = root.innerHTML
  // 写入文件
  try {
    await fs.promises.opendir(outputDir)
  } catch (error) {
    await fs.promises.mkdir(outputDir, { recursive: true })
  } finally {
    await fs.promises.writeFile(filename, html)
  }
}



function EsbuildHtmlPlugin(options: EsbuildHtmlPluginOptions = {}): Plugin {

  return {
    name: 'esbuild-plugin-html',
    setup(build) {
      build.initialOptions.metafile = true

      build.onEnd(async result => {
        const outputFiles = Object.keys(result.metafile?.outputs ?? {})
        const scripts: string[] = []
        const styles: string[] = []
        const maps: string[] = []

        outputFiles.forEach(item => {
          if (/\.js$/.test(item)) {
            scripts.push(item)
          } else if(/\.css$/.test(item)) {
            styles.push(item)
          } else if (/\.map$/.test(item)) {
            maps.push(item)
          }
        })

        await createDocumentTree(Object.assign(options, { scripts, styles, maps }))
      })
    }
  }
}

export default EsbuildHtmlPlugin