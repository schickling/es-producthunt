#!/usr/bin/env node
const fs = require('fs').promises
const path = require('path')
const { build, cliopts } = require('estrella')
build({
  entry: 'src/index.ts',
  outfile: 'dist/src/index.js',
  minify: false,
  bundle: true,
  run: true,
  platform: 'node',
  // pass any options to esbuild here...
})
;(async () => {
  const distDir = path.join(__dirname, 'dist')
  await fs.mkdir(path.join(distDir, 'static'), { recursive: true })
  await fs.copyFile(
    path.join(__dirname, 'static', 'playground.html'),
    path.join(distDir, 'static', 'playground.html'),
  )
})()
