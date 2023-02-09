import { build } from 'esbuild'
import esbuildPluginHtml from '../dist/index.esm.js'

;(async () => {
  await build({
    entryPoints: ['./main.ts'],
    outfile: './output/static/main.js',
    format: 'iife',
    bundle: true,
    tsconfig: '../tsconfig.json',
    sourcemap: true,
    plugins: [
      esbuildPluginHtml({
        template: './index.html',
        minify: true,
        filename: './output/index.html',
        renderData: {
          title: 'title'
        }
      })
    ]
  })
})()