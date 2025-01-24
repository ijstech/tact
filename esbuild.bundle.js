const esbuild = require("esbuild");
const { promises: Fs } = require("fs");

// async function readFile(fileName) {
//     return new Promise((resolve, reject) => {
//         Fs.readFile(fileName, "utf8", function (err, data) {
//             if (err) reject(err);
//             else resolve(data);
//         });
//     });
// }

async function readFile(fileName) {
    let result = await Fs.readFile(fileName, "utf8");
    return result;
}

esbuild
    .build({
        entryPoints: ["dist/index.js"],
        outfile: "bundle/index.js",
        bundle: true,
        minify: false,
        sourcemap: false,
        target: "esnext",
        format: "cjs",
        platform: "node",
        plugins: [
            {
                name: "alias",
                setup(build) {
                    build.onResolve({ filter: /^@ton\/core$/ }, () => {
                        return {
                            path: require.resolve(
                                "@scom/ton-core/lib/index.js",
                            ),
                        };
                    });
                },
            },
        ],
    })
    .then(async () => {
        console.log("Bundling completed!");
        try {
            const types = await readFile("types/index.d.ts");
            const indexType = await readFile("dist/index.d.ts");
            const content = `declare namespace TactCompiler {
${types}
${indexType}
};\n export = TactCompiler;`;
            await Fs.writeFile("bundle/index.d.ts", content, "utf8");
        } catch (e) {
            process.exit(1);
        }
    })
    .catch((error) => {
        console.error("Bundling failed:", error);
        process.exit(1);
    });
