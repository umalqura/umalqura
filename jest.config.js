module.exports = {
    globals: {
        "ts-jest": {
            tsConfig: "./tests/tsconfig.jest.json",
        }
    },
    preset: 'ts-jest',
    testEnvironment: 'node'
};
