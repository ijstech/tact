module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/bundle/",
        "/esbuild.bundle.js/",
        "/esbuild.browser.js/",
        "/types/",
    ],
    moduleNameMapper: {
        "^@ton/core$": "<rootDir>/node_modules/@scom/ton-core",
    },
    maxWorkers: "50%",
    globalSetup: "./jest.setup.js",
    globalTeardown: "./jest.teardown.js",
    snapshotSerializers: ["@tact-lang/ton-jest/serializers"],
};
