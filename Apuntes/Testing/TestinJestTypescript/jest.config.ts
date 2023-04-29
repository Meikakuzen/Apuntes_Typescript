import type {Config} from '@jest/types'

const config: Config.InitialOptions = {
    preset: "ts-jest",
    testEnvironment: 'node',
    verbose: true, //mostrará mñas info en la consola
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/src/app/**/*.ts'
    ] // debe de ser un array
}

export default config