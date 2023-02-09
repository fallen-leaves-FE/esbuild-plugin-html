import { Options as MinifyOptions } from 'html-minifier-terser'
import { Plugin } from 'esuild'

export interface EsbuildHtmlPluginOptions {
  /**
   * 模板html字符串或者模板文件绝对路径
   * @default '<!DOCTYPE html><html lang="en">.....'
   */
  template?: string
  /**
   * 是否编译ejs
   * @default true
   */
  compile?: boolean
  /**
   * 输出后的文件绝对路径及名称
   * @default 'index.html'
   */
  filename?: string
  /**
   * 是否压缩html，详细配置请查看：https://www.npmjs.com/package/html-minifier-terser?activeTab=readme
   * @default true
   */
  minify?: boolean | MinifyOptions
  /**
   * 模板内注入的数据
   * @default {}
   */
  renderData?: Record<string, any>
  /**
   * 公共路径
   * @default '/'
   */
  publicPath?: string
}

export interface CreateDocumentTreeOptions extends EsbuildHtmlPluginOptions {
  scripts?: string[]
  styles?: string[]
  maps?: string[]
}

declare function esbuildHtmlPlugin(options?: EsbuildHtmlPluginOptions): Plugin

export default esbuildHtmlPlugin