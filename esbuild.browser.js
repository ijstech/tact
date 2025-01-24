const esbuild = require("esbuild");
const { promises: Fs } = require("fs");
const {
    nodeModulesPolyfillPlugin,
} = require("esbuild-plugins-node-modules-polyfill");

async function readFile(fileName) {
    let result = await Fs.readFile(fileName, "utf8");
    return result;
}

esbuild
    .build({
        entryPoints: ["dist/index.js"],
        outfile: "bundle/browser.js",
        bundle: true,
        minify: false,
        sourcemap: false,
        target: "esnext",
        format: "iife",
        globalName: "TactCompiler",
        platform: "browser",
        external: ["@scom/ton-core", "@ton/core"],
        plugins: [
            nodeModulesPolyfillPlugin({
                globals: {
                    process: true,
                    Buffer: true,
                    path: true,
                    fs: true,
                },
            }),
            // {
            //     name: 'node-polyfills',
            //     setup(build) {
            //       for (const [moduleName, modulePath] of Object.entries(nodePolyfills)) {
            //         build.onResolve({ filter: new RegExp(`^${moduleName}$`) }, () => ({
            //           path: require.resolve(modulePath),
            //         }));
            //       }
            //     },
            // },
        ],
    })
    .then(async () => {
        console.log("Bundling browser completed!");
        let indexContent = await readFile("bundle/browser.js");
        indexContent = indexContent.replace(/@ton\/core/g, "@scom/ton-core");
        await Fs.writeFile("bundle/browser.js", indexContent, "utf8");
    })
    .catch((error) => {
        console.error("Bundling browser failed:", error);
        process.exit(1);
    });
