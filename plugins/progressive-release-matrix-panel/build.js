const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  const distDir = path.resolve(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Copy plugin.json and img
  fs.copyFileSync(path.resolve(__dirname, 'src/plugin.json'), path.resolve(distDir, 'plugin.json'));
  const imgDist = path.resolve(distDir, 'img');
  if (!fs.existsSync(imgDist)) {
    fs.mkdirSync(imgDist, { recursive: true });
  }
  if (fs.existsSync(path.resolve(__dirname, 'img/logo.svg'))) {
    fs.copyFileSync(path.resolve(__dirname, 'img/logo.svg'), path.resolve(imgDist, 'logo.svg'));
  }

  // Bundle TSX to CJS
  const result = await esbuild.build({
    entryPoints: [path.resolve(__dirname, 'src/module.ts')],
    bundle: true,
    write: false,
    format: 'cjs',
    target: ['es2020'],
    external: ['react', 'react-dom', '@grafana/data', '@grafana/ui', '@grafana/runtime'],
    minify: false,
  });

  const cjsCode = result.outputFiles[0].text;

  // Wrap in AMD define for Grafana SystemJS loader
  const amdCode = `define(["exports", "react", "react-dom", "@grafana/data"], function (_exports, _react, _reactDom, _grafanaData) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: true });

  var module = { exports: _exports };
  function require(name) {
    if (name === "react") return _react;
    if (name === "react-dom") return _reactDom;
    if (name === "@grafana/data") return _grafanaData;
    throw new Error("Cannot find module " + name);
  }

  ${cjsCode}

  return _exports;
});
`;

  fs.writeFileSync(path.resolve(distDir, 'module.js'), amdCode, 'utf8');
  console.log('Successfully built Grafana panel plugin to', distDir);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
