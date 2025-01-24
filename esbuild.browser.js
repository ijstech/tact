const esbuild = require("esbuild");
const { promises: Fs } = require("fs");
const {
    nodeModulesPolyfillPlugin,
} = require("esbuild-plugins-node-modules-polyfill");

async function readFile(fileName) {
    let result = await Fs.readFile(fileName, "utf8");
    return result;
}

// const nodePolyfills = {
//     "node:path": "path-browserify",
//     "path": "path-browserify",
//     "fs": "browserify-fs",
//     "stream": "stream-browserify",
//     "crypto": "crypto-browserify"
// }
// {
//     name: 'node-polyfills',
//     setup(build) {
//       for (const [moduleName, modulePath] of Object.entries(nodePolyfills)) {
//         build.onResolve({ filter: new RegExp(`^${moduleName}$`) }, () => ({
//           path: require.resolve(modulePath),
//         }));
//       }
//     },
// }

esbuild
    .build({
        entryPoints: ["dist/index.js"],
        outfile: "bundle/browser.js",
        bundle: true,
        minify: false,
        sourcemap: false,
        target: "esnext",
        format: "iife",
        platform: "browser",
        external: ["@scom/ton-core", "@ton/core", "bignumber.js"],
        plugins: [
            nodeModulesPolyfillPlugin({
                globals: {
                    process: true,
                    Buffer: true,
                    path: true,
                    fs: true,
                },
            }),
        ],
    })
    .then(async () => {
        console.log("Bundling browser completed!");
        let indexContent = await readFile("bundle/browser.js");
        indexContent = indexContent.replace(/@ton\/core/g, "@scom/ton-core");
        await Fs.writeFile(
            "bundle/browser.js",
            `
 "use strict";
${indexContent}
            `,
            "utf8",
        );
    })
    .catch((error) => {
        console.error("Bundling browser failed:", error);
        process.exit(1);
    });
