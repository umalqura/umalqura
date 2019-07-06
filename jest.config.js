module.exports = {
    globals: {
        "ts-jest": {
            tsConfig: "./tsconfig.jest.json",
        }
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
};