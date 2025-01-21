module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/bundle/",
        "/esbuild.bundle.js/",
        "/types/",
    ],
    maxWorkers: "50%",
    globalSetup: "./jest.setup.js",
    globalTeardown: "./jest.teardown.js",
    snapshotSerializers: ["@tact-lang/ton-jest/serializers"],
};
