const esbuild = require("esbuild");
const { promises: Fs } = require("fs");
const Path = require("path");

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

function normalizePath(path) {
    return path.replace(/\\/g, "/").replace(/\/+$/, "");
}

async function bundleTypes(filePath, parentDir = "", content) {
    const src = Path.resolve(__dirname, filePath);
    const isFile = await Fs.stat(src);
    if (isFile.isFile()) {
        const fileContent = await readFile(src);
        const fileName = normalizePath(Path.join(parentDir, filePath));
        content += `declare module "tact-compiler/${fileName}" {
            ${fileContent}
        };\n`;
        return content;
    }

    const entries = await Fs.readdir(src, { withFileTypes: true });
    for (const entry of entries) {
        const destPath = Path.join(filePath, entry.name);
        if (entry.isDirectory()) {
            const newParentDir = normalizePath(
                Path.join(parentDir, entry.name),
            );
            content = await bundleTypes(destPath, newParentDir, content);
        } else {
            if (!entry.name.endsWith(".d.ts") || entry.name === "index.d.ts")
                continue;

            const fileContent = await readFile(destPath);
            const fileName = normalizePath(Path.join(parentDir, entry.name));
            content += `/// <amd-module name="tact-compiler/${fileName}" /> \n declare module "tact-compiler/${fileName}" {
                ${fileContent}
            };\n`;
        }
    }

    return content;
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
        external: ["@ton/core"],
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
