const esbuild = require("esbuild");

const Fs = require("fs");

async function readFile(fileName) {
    return new Promise((resolve, reject) => {
        Fs.readFile(fileName, "utf8", function (err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
}

async function bundleTypes() {
    const dist = Fs.readdirSync("dist");
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
    })
    .then(async () => {
        console.log("Bundling completed!");
        let content = await readFile("bundle/index.js");
        content = `
            define("tact", ["require", "exports"], function (require, exports) {
              ${content}

              exports.default = Tact;
            });
          `;
        bundleTypes();
        Fs.writeFileSync("bundle/index.js", content);
    })
    .catch((error) => {
        console.error("Bundling failed:", error);
        process.exit(1);
    });
