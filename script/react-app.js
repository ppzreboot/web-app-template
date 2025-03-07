// @ts-check
import { writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { context, build } from 'esbuild'

const is_pro = (() => {
  switch(process.argv[2]) {
    case 'dev': return false
    case 'pro': return true
    default:
      throw Error('invalid mode')
  }
})()
const page_title = process.argv[3]
const timestamp = Date.now()

main()

function main() {
  /* 1. drop dist */
  empty_dist()

  /* 2. output html */
  output_html()

  /** @type {import('esbuild').BuildOptions} */
  const options = {
    entryPoints: ['src/main.tsx'],
    entryNames: '[dir]/[name]-' + timestamp,
    outdir: 'dist',
    bundle: true,
    loader: {
      '.webp': 'file',
      '.otf': 'file',
      '.ttf': 'file',
    },
    logLevel: 'debug',
  }

  if (is_pro)
    _build(options)
  else
    _serve(options)
}

async function _serve(opts) {
  const ctx = await context(opts)
  await ctx.watch()
  await ctx.serve({
    servedir: 'dist',
  })
}
async function _build(opts) {
  await build(opts)
}

function output_html() {
  writeFileSync('dist/index.html', `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${page_title}</title>
        <link href="./main-${timestamp}.css" rel="stylesheet">
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="./main-${timestamp}.js"></script>
      </body>
    </html>
  `)
}

function empty_dist() {
  try {
    rmSync('dist', { recursive: true })
  } catch(err) {
    console.log('dist not exist')
  }
  mkdirSync('dist')
}
