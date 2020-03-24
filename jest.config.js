module.exports = {
    verbose: true,
    rootDir: 'src',
    preset: 'ts-jest',
    setupFilesAfterEnv: [],
    moduleDirectories: ['src', 'node_modules'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '.*.spec.(js|ts|tsx)?$',
    modulePathIgnorePatterns: ['node_modules'],
    moduleNameMapper: {},
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    roots: [
        '<rootDir>'
    ],
    globals: {
        'ts-jest': {
            tsConfig: './tsconfig.json',
        },
    },
};
