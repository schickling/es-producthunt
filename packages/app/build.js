#!/usr/bin/env node
const { build, cliopts } = require("estrella")
build({
  entry: "src/index.ts",
  outfile: "dist/src/index.js",
  minify: false,
  bundle: true,
  run: true,
  platform: 'node',
  // pass any options to esbuild here...
})